export async function notifyOwner(order, items) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = [
    process.env.TELEGRAM_OWNER_CHAT_ID,
    ...(process.env.OWNER_TELEGRAM_IDS || "").split(",")
  ]
    .map((value) => value?.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    return { skipped: true };
  }

  const lines = [
    `Новый заказ ${order.order_number}`,
    `Клиент: ${order.customer_name}`,
    `Телефон: ${order.customer_phone}`,
    order.customer_telegram ? `Telegram: ${order.customer_telegram}` : null,
    `Тип цены: ${order.price_mode === "wholesale" ? "опт" : "розница"}`,
    `Самовывоз: ${order.pickup_date}`,
    `Сумма: ${formatRub(order.total_amount)}`,
    "",
    ...items.map((item) => `${item.qty} x ${item.name} - ${formatRub(item.unit_price)}`)
  ].filter(Boolean);

  const results = [];

  for (const chatId of chatIds) {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Telegram notification failed for ${chatId}: ${text}`);
    }

    results.push(await response.json());
  }

  return results;
}

function formatRub(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}
