import { query } from "./db.js";

const statuses = {
  new: "Новый",
  confirmed: "Подтвержден",
  ready: "Готов",
  picked_up: "Выдан",
  cancelled: "Отменен"
};

const statusValues = ["confirmed", "ready", "picked_up", "cancelled"];
const menuCallbacks = new Set(["menu:home", "menu:orders", "menu:stats", "menu:help"]);

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
          parse_mode: "HTML",
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

export async function syncOrderNotifications(orderId) {
  const token = getTelegramToken();
  if (!token) {
    return { skipped: true };
  }

  const order = await getOrder(orderId);
  if (!order) {
    return { skipped: true };
  }

  const items = await getOrderItems(order.id);
  const { rows: notifications } = await query(
    `
      SELECT chat_id, message_id
      FROM telegram_notifications
      WHERE order_id = $1 AND message_id IS NOT NULL
    `,
    [order.id]
  );

  return Promise.all(
    notifications.map(async (notification) => {
      try {
        await editTelegramMessage(
          notification.chat_id,
          notification.message_id,
          renderOrderMessage(order, items),
          renderOrderKeyboard(order.id, order.status)
        );
        await query(
          `
            UPDATE telegram_notifications
            SET status = 'sent', error = NULL, updated_at = now()
            WHERE order_id = $1 AND chat_id = $2
          `,
          [order.id, notification.chat_id]
        );
        return { chatId: notification.chat_id, synced: true };
      } catch (error) {
        await query(
          `
            UPDATE telegram_notifications
            SET status = 'failed', error = $1, updated_at = now()
            WHERE order_id = $2 AND chat_id = $3
          `,
          [error.message.slice(0, 500), order.id, notification.chat_id]
        );
        return { chatId: notification.chat_id, error: error.message };
      }
    })
  );
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
  if (isBotMenuCommand(message?.text) && isAllowedOwner(message.from?.id)) {
    await telegramRequest("sendMessage", {
      chat_id: message.chat.id,
      text: renderMenuMessage(),
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: renderMenuKeyboard()
    });
    return;
  }

  if (isBotMenuCommand(message?.text)) {
    await telegramRequest("sendMessage", {
      chat_id: message.chat.id,
      text: "Нет доступа."
    });
  }
}

async function handleCallbackQuery(callback) {
  const callbackId = callback.id;
  const fromId = callback.from?.id;
  const chatId = callback.message?.chat?.id;
  const messageId = callback.message?.message_id;
  const data = String(callback.data || "");

  if (!isAllowedOwner(fromId)) {
    await answerCallback(callbackId, "Нет доступа.");
    return;
  }

  if (menuCallbacks.has(data)) {
    await handleMenuCallback(data, chatId, messageId);
    await answerCallback(callbackId);
    return;
  }

  const orderMatch = data.match(/^order:([0-9a-f-]{36})(?::(confirmed|ready|picked_up|cancelled))?$/i);
  if (!orderMatch) {
    await answerCallback(callbackId, "Команда устарела.");
    return;
  }

  const [, orderId, status] = orderMatch;
  const order = await getOrder(orderId);
  if (!order) {
    await answerCallback(callbackId, "Заказ не найден.");
    return;
  }

  if (!status) {
    const items = await getOrderItems(order.id);
    await editTelegramMessage(chatId, messageId, renderOrderMessage(order, items), renderOrderKeyboard(order.id, order.status));
    await answerCallback(callbackId);
    return;
  }

  if (order.status === status) {
    await answerCallback(callbackId, `Уже ${statuses[status]}`);
    return;
  }

  const updatedOrder = await updateOrderStatus(orderId, status);
  if (!updatedOrder) {
    await answerCallback(callbackId, "Заказ не найден.");
    return;
  }

  await syncOrderNotifications(updatedOrder.id);
  await answerCallback(callbackId, `Статус: ${statuses[status]}`);
}

async function handleMenuCallback(data, chatId, messageId) {
  if (data === "menu:home") {
    await editTelegramMessage(chatId, messageId, renderMenuMessage(), renderMenuKeyboard());
    return;
  }

  if (data === "menu:orders") {
    const orders = await getRecentOrders(5);
    await editTelegramMessage(chatId, messageId, renderOrdersListMessage(orders), renderOrdersListKeyboard(orders));
    return;
  }

  if (data === "menu:stats") {
    const stats = await getOrderStats();
    await editTelegramMessage(chatId, messageId, renderStatsMessage(stats), renderBackKeyboard());
    return;
  }

  if (data === "menu:help") {
    await editTelegramMessage(chatId, messageId, renderHelpMessage(), renderBackKeyboard());
  }
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

async function getOrder(orderId) {
  const { rows } = await query(
    `
      SELECT
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_telegram,
        price_mode,
        status,
        pickup_date,
        pickup_time,
        created_at,
        total_amount
      FROM orders
      WHERE id = $1
    `,
    [orderId]
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

async function getRecentOrders(limit = 5) {
  const { rows } = await query(
    `
      SELECT
        id,
        order_number,
        customer_name,
        price_mode,
        status,
        pickup_date,
        pickup_time,
        total_amount,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );
  return rows;
}

async function getOrderStats() {
  const { rows } = await query(
    `
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE status = 'new')::int AS new_count,
        count(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_count,
        count(*) FILTER (WHERE status = 'ready')::int AS ready_count,
        count(*) FILTER (WHERE status = 'picked_up')::int AS picked_up_count,
        count(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_count
      FROM orders
    `
  );
  return rows[0] || {
    total: 0,
    new_count: 0,
    confirmed_count: 0,
    ready_count: 0,
    picked_up_count: 0,
    cancelled_count: 0
  };
}

function renderMenuMessage() {
  return [
    "<b>Shark Mobile | меню бота</b>",
    "Выбирай раздел кнопками ниже.",
    "",
    "Здесь можно смотреть последние заказы, открывать детали и менять статусы без пересылки новых сообщений."
  ].join("\n");
}

function renderOrdersListMessage(orders) {
  const lines = [
    "<b>Shark Mobile | последние заказы</b>",
    "Открой заказ кнопкой ниже. Статус меняется прямо в том же сообщении.",
    "────────────",
    ...(orders.length
      ? orders.map((order, index) => {
          const pickup = formatPickup(order.pickup_date, order.pickup_time);
          const created = formatOrderCreatedShort(order.created_at);
          return `${index + 1}. ${escapeHtml(order.order_number)} · ${escapeHtml(created)} · ${escapeHtml(statuses[order.status] || order.status)} · ${escapeHtml(formatRub(order.total_amount))} · ${escapeHtml(pickup)}`;
        })
      : ["Заказов пока нет."])
  ];
  return lines.join("\n");
}

function renderStatsMessage(stats) {
  return [
    "<b>Shark Mobile | статистика</b>",
    "────────────",
    `Всего: <b>${stats.total}</b>`,
    `Новые: <b>${stats.new_count}</b>`,
    `Подтверждены: <b>${stats.confirmed_count}</b>`,
    `Готовы: <b>${stats.ready_count}</b>`,
    `Выданы: <b>${stats.picked_up_count}</b>`,
    `Отменены: <b>${stats.cancelled_count}</b>`
  ].join("\n");
}

function renderHelpMessage() {
  return [
    "<b>Shark Mobile | помощь</b>",
    "────────────",
    "• <b>Последние заказы</b> — список свежих заказов.",
    "• Открытый заказ можно обновлять кнопками статуса.",
    "• <b>Статистика</b> — сводка по всем заказам.",
    "• <b>Меню</b> — возврат на главный экран."
  ].join("\n");
}

function renderOrderMessage(order, items) {
  const lines = [
    `<b>Shark Mobile | заказ ${escapeHtml(order.order_number)}</b>`,
    `Статус: <b>${escapeHtml(statuses[order.status] || order.status)}</b>`,
    "────────────",
    "<b>Клиент</b>",
    `Имя: ${escapeHtml(order.customer_name)}`,
    `Телефон: ${escapeHtml(order.customer_phone)}`,
    order.customer_telegram ? `Telegram: ${escapeHtml(order.customer_telegram)}` : null,
    "────────────",
    "<b>Доставка</b>",
    order.created_at ? `Оформлен: ${escapeHtml(formatOrderCreated(order.created_at))}` : null,
    `Цена: ${escapeHtml(order.price_mode === "wholesale" ? "опт" : "розница")}`,
    `Самовывоз: ${escapeHtml(formatPickup(order.pickup_date, order.pickup_time))}`,
    `Сумма: <b>${escapeHtml(formatRub(order.total_amount))}</b>`,
    "────────────",
    "<b>Позиции</b>",
    ...items.map((item) => `${item.qty} × ${escapeHtml(item.name)} — ${escapeHtml(formatRub(item.unit_price))}`)
  ];

  return lines.filter(Boolean).join("\n");
}

function renderMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "Последние заказы", callback_data: "menu:orders" },
        { text: "Статистика", callback_data: "menu:stats" }
      ],
      [{ text: "Помощь", callback_data: "menu:help" }]
    ]
  };
}

function renderBackKeyboard() {
  return {
    inline_keyboard: [[{ text: "← Меню", callback_data: "menu:home" }]]
  };
}

function renderOrdersListKeyboard(orders) {
  const rows = orders.map((order) => [
    {
      text: `${order.order_number} · ${statuses[order.status] || order.status}`,
      callback_data: `order:${order.id}`
    }
  ]);
  rows.push([{ text: "← Меню", callback_data: "menu:home" }]);
  return { inline_keyboard: rows };
}

function renderOrderKeyboard(orderId, currentStatus) {
  return {
    inline_keyboard: [
      [
        {
          text: `${currentStatus === "confirmed" ? "✓ " : ""}${statuses.confirmed}`,
          callback_data: `order:${orderId}:confirmed`
        },
        {
          text: `${currentStatus === "ready" ? "✓ " : ""}${statuses.ready}`,
          callback_data: `order:${orderId}:ready`
        }
      ],
      [
        {
          text: `${currentStatus === "picked_up" ? "✓ " : ""}${statuses.picked_up}`,
          callback_data: `order:${orderId}:picked_up`
        },
        {
          text: `${currentStatus === "cancelled" ? "✓ " : ""}${statuses.cancelled}`,
          callback_data: `order:${orderId}:cancelled`
        }
      ],
      [
        {
          text: "← К заказам",
          callback_data: "menu:orders"
        },
        {
          text: "Меню",
          callback_data: "menu:home"
        }
      ]
    ]
  };
}

async function editTelegramMessage(chatId, messageId, text, replyMarkup) {
  await telegramRequest("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: replyMarkup
  });
}

async function answerCallback(callbackId, text) {
  const payload = {
    callback_query_id: callbackId,
    show_alert: false
  };
  if (text) {
    payload.text = text;
  }
  await telegramRequest("answerCallbackQuery", payload);
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

function isBotMenuCommand(text) {
  const command = String(text || "").trim();
  return /^\/(start|menu)(@\w+)?(\s|$)/i.test(command) || /^\/старт(@\w+)?(\s|$)/i.test(command);
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

function formatOrderCreated(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatOrderCreatedShort(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isMenuCommand(text) {
  return /^\/(start|старт|menu)(@\w+)?(\s|$)/i.test(String(text || "").trim());
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
