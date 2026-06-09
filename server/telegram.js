import dotenv from "dotenv";
import { query } from "./db.js";

dotenv.config();

const statuses = {
  new: "Новый",
  confirmed: "Подтвержден",
  ready: "Готов",
  picked_up: "Выдан",
  cancelled: "Отменен"
};

const actionStatuses = ["confirmed", "ready", "picked_up", "cancelled"];

export async function notifyOwner(order, items) {
  const token = getTelegramToken();
  const chatIds = getOwnerChatIds();

  if (!token || chatIds.length === 0) {
    return { skipped: true };
  }

  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      const inserted = await query(
        `
          INSERT INTO telegram_notifications (order_id, chat_id, status)
          VALUES ($1, $2, 'sent')
          ON CONFLICT (order_id, chat_id) DO NOTHING
          RETURNING id
        `,
        [order.id, chatId]
      );

      if (!inserted.rowCount) {
        return { chatId, skipped: true };
      }

      try {
        const sent = await telegramRequest("sendMessage", {
          chat_id: chatId,
          text: renderOrderMessage(order, items),
          disable_web_page_preview: true,
          reply_markup: renderOrderKeyboard(order.id, order.status)
        });

        await query(
          `
            UPDATE telegram_notifications
            SET message_id = $1, status = 'sent', error = NULL, updated_at = now()
            WHERE order_id = $2 AND chat_id = $3
          `,
          [String(sent.result.message_id), order.id, chatId]
        );
        return { chatId, messageId: sent.result.message_id };
      } catch (error) {
        await query(
          `
            UPDATE telegram_notifications
            SET status = 'failed', error = $1, updated_at = now()
            WHERE order_id = $2 AND chat_id = $3
          `,
          [error.message.slice(0, 500), order.id, chatId]
        );
        return { chatId, error: error.message };
      }
    })
  );

  return results;
}

export async function startTelegramPolling() {
  if (!getTelegramToken()) {
    throw new Error("TELEGRAM_BOT_TOKEN is required for polling.");
  }

  let offset = 0;
  let stopped = false;
  const stop = () => {
    stopped = true;
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  while (!stopped) {
    try {
      const data = await telegramRequest("getUpdates", {
        offset,
        timeout: 25,
        allowed_updates: ["message", "callback_query"]
      });

      for (const update of data.result || []) {
        offset = update.update_id + 1;
        await handleTelegramUpdate(update);
      }
    } catch (error) {
      console.error(error.message);
      await delay(1800);
    }
  }
}

export async function handleTelegramUpdate(update) {
  if (update.callback_query) {
    return handleCallbackQuery(update.callback_query);
  }

  const message = update.message;
  if (message?.text === "/start" && isAllowedOwner(message.from?.id)) {
    await telegramRequest("sendMessage", {
      chat_id: message.chat.id,
      text: "Shark Mobile admin bot готов. Новые заказы будут приходить сюда."
    });
  }
}

async function handleCallbackQuery(callback) {
  const callbackId = callback.id;
  const fromId = callback.from?.id;
  const chatId = callback.message?.chat?.id;
  const messageId = callback.message?.message_id;

  if (!isAllowedOwner(fromId)) {
    await answerCallback(callbackId, "Нет доступа.");
    return;
  }

  const match = String(callback.data || "").match(/^order:([0-9a-f-]{36}):(confirmed|ready|picked_up|cancelled)$/i);
  if (!match) {
    await answerCallback(callbackId, "Команда устарела.");
    return;
  }

  const [, orderId, status] = match;
  const order = await updateOrderStatus(orderId, status);
  if (!order) {
    await answerCallback(callbackId, "Заказ не найден.");
    return;
  }

  const items = await getOrderItems(order.id);
  await telegramRequest("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: renderOrderMessage(order, items),
    disable_web_page_preview: true,
    reply_markup: renderOrderKeyboard(order.id, order.status)
  });
  await answerCallback(callbackId, `Статус: ${statuses[status]}`);
}

async function updateOrderStatus(orderId, status) {
  const { rows } = await query(
    `
      UPDATE orders
      SET status = $1, updated_at = now()
      WHERE id = $2
      RETURNING *
    `,
    [status, orderId]
  );
  return rows[0] || null;
}

async function getOrderItems(orderId) {
  const { rows } = await query(
    `
      SELECT sku, name, qty, unit_price
      FROM order_items
      WHERE order_id = $1
      ORDER BY name
    `,
    [orderId]
  );
  return rows;
}

function renderOrderMessage(order, items) {
  const lines = [
    `Shark Mobile | заказ ${order.order_number}`,
    `Статус: ${statuses[order.status] || order.status}`,
    `Клиент: ${order.customer_name}`,
    `Телефон: ${order.customer_phone}`,
    order.customer_telegram ? `Telegram: ${order.customer_telegram}` : null,
    `Цена: ${order.price_mode === "wholesale" ? "опт" : "розница"}`,
    `Самовывоз: ${formatPickup(order.pickup_date, order.pickup_time)}`,
    `Сумма: ${formatRub(order.total_amount)}`,
    "",
    ...items.map((item) => `${item.qty} x ${item.name} - ${formatRub(item.unit_price)}`)
  ];

  return lines.filter(Boolean).join("\n");
}

function renderOrderKeyboard(orderId, currentStatus) {
  return {
    inline_keyboard: [
      actionStatuses.map((status) => ({
        text: `${currentStatus === status ? ">" : ""}${statuses[status]}`,
        callback_data: `order:${orderId}:${status}`
      }))
    ]
  };
}

async function answerCallback(callbackId, text) {
  await telegramRequest("answerCallbackQuery", {
    callback_query_id: callbackId,
    text,
    show_alert: false
  });
}

async function telegramRequest(method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${getTelegramToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(`Telegram ${method} failed: ${JSON.stringify(data)}`);
  }
  return data;
}

function getOwnerChatIds() {
  return [
    process.env.TELEGRAM_OWNER_CHAT_ID,
    ...(process.env.OWNER_TELEGRAM_IDS || "").split(",")
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
}

function isAllowedOwner(id) {
  return getOwnerChatIds().includes(String(id || ""));
}

function getTelegramToken() {
  return process.env.TELEGRAM_BOT_TOKEN;
}

function formatRub(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(value));
}

function formatPickup(date, time) {
  return `${formatDate(date)}${time ? ` в ${String(time).slice(0, 5)}` : ""}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
