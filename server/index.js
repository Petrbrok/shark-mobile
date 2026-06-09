import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieSession from "cookie-session";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool, query, withTransaction } from "./db.js";
import { handleTelegramUpdate, notifyOwner } from "./telegram.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(
  cookieSession({
    name: "shark_session",
    keys: [process.env.SESSION_SECRET || "dev-session-secret-change-me"],
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/telegram/webhook", async (req, res, next) => {
  try {
    await handleTelegramUpdate(req.body);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT
        id,
        sku,
        name,
        category,
        brand,
        retail_price AS "retailPrice",
        wholesale_price AS "wholesalePrice",
        stock_qty AS "stockQty",
        image_url AS "imageUrl",
        description
      FROM products
      ORDER BY category, brand, name
    `);
    res.json({ products: rows });
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerTelegram, priceMode = "retail", items = [] } = req.body;
    if (!customerName?.trim() || !customerPhone?.trim()) {
      return res.status(400).json({ error: "Укажите имя и телефон." });
    }
    if (!["retail", "wholesale"].includes(priceMode)) {
      return res.status(400).json({ error: "Некорректный тип цены." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Корзина пуста." });
    }

    const created = await withTransaction(async (client) => {
      const productIds = items.map((item) => item.productId);
      const { rows: products } = await client.query(
        `
          SELECT id, sku, name, retail_price, wholesale_price, stock_qty
          FROM products
          WHERE id = ANY($1::uuid[])
          FOR UPDATE
        `,
        [productIds]
      );
      const productsById = new Map(products.map((product) => [product.id, product]));

      const orderItems = items.map((item) => {
        const product = productsById.get(item.productId);
        const qty = Number(item.qty);
        if (!product || !Number.isInteger(qty) || qty < 1) {
          throw httpError(400, "В корзине есть некорректная позиция.");
        }
        if (product.stock_qty < qty) {
          throw httpError(409, `${product.name}: доступно ${product.stock_qty} шт.`);
        }
        return {
          product,
          qty,
          unitPrice: priceMode === "wholesale" ? product.wholesale_price : product.retail_price
        };
      });
      const totalQty = orderItems.reduce((sum, item) => sum + item.qty, 0);
      if (priceMode === "wholesale" && totalQty < 20) {
        throw httpError(400, "Оптовая цена доступна от 20 единиц.");
      }

      const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
      const pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const orderNumber = await nextOrderNumber(client);

      const { rows } = await client.query(
        `
          INSERT INTO orders
            (order_number, customer_id, customer_name, customer_phone, customer_telegram, price_mode, pickup_date, total_amount)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `,
        [
          orderNumber,
          req.session?.customerUserId || null,
          customerName.trim(),
          customerPhone.trim(),
          customerTelegram?.trim() || null,
          priceMode,
          pickupDate,
          totalAmount
        ]
      );
      const order = rows[0];

      for (const item of orderItems) {
        await client.query(
          `
            INSERT INTO order_items (order_id, product_id, sku, name, qty, unit_price, price_mode)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [order.id, item.product.id, item.product.sku, item.product.name, item.qty, item.unitPrice, priceMode]
        );
        await client.query("UPDATE products SET stock_qty = stock_qty - $1, updated_at = now() WHERE id = $2", [
          item.qty,
          item.product.id
        ]);
      }

      return {
        order,
        items: orderItems.map((item) => ({
          sku: item.product.sku,
          name: item.product.name,
          qty: item.qty,
          unit_price: item.unitPrice
        }))
      };
    });

    notifyOwner(created.order, created.items).catch((error) => {
      console.error(error.message);
    });

    res.status(201).json({
      orderNumber: created.order.order_number,
      pickupDate: created.order.pickup_date,
      totalAmount: created.order.total_amount
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const { rows } = await query("SELECT id, login, password_hash FROM admin_users WHERE login = $1", [login]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password || "", user.password_hash))) {
      return res.status(401).json({ error: "Неверный логин или пароль." });
    }
    req.session.adminUserId = user.id;
    req.session.userRole = "admin";
    res.json({ user: { id: user.id, login: user.login } });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/logout", (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

app.post("/api/admin/telegram-login", async (req, res, next) => {
  try {
    const telegramId = String(req.body.telegramId || "");
    const login = req.body.login || process.env.ADMIN_LOGIN || "owner";
    const allowed = (process.env.OWNER_TELEGRAM_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (!telegramId || !allowed.includes(telegramId)) {
      return res.status(403).json({ error: "Telegram ID не разрешен." });
    }

    const { rows } = await query(
      `
        UPDATE admin_users
        SET telegram_id = $1, updated_at = now()
        WHERE login = $2
        RETURNING id, login
      `,
      [telegramId, login]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Владелец не найден." });
    }

    req.session.adminUserId = rows[0].id;
    req.session.userRole = "admin";
    res.json({ user: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.get("/api/customer/me", async (req, res, next) => {
  try {
    if (!req.session?.customerUserId) {
      return res.json({ customer: null });
    }

    const { rows } = await query(
      `
        SELECT id, login, name, phone, telegram
        FROM customers
        WHERE id = $1
      `,
      [req.session.customerUserId]
    );
    res.json({ customer: rows[0] || null });
  } catch (error) {
    next(error);
  }
});

app.post("/api/customer/register", async (req, res, next) => {
  try {
    const login = normalizeLogin(req.body.login);
    const password = String(req.body.password || "");
    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const telegram = String(req.body.telegram || "").trim() || null;

    if (login.length < 3 || password.length < 6) {
      return res.status(400).json({ error: "Логин от 3 символов, пароль от 6 символов." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      `
        INSERT INTO customers (login, password_hash, name, phone, telegram)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, login, name, phone, telegram
      `,
      [login, passwordHash, name, phone, telegram]
    );

    req.session.customerUserId = rows[0].id;
    req.session.userRole = "customer";
    res.status(201).json({ customer: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Такой логин уже занят." });
    }
    next(error);
  }
});

app.post("/api/customer/login", async (req, res, next) => {
  try {
    const login = normalizeLogin(req.body.login);
    const { rows } = await query(
      `
        SELECT id, login, password_hash, name, phone, telegram
        FROM customers
        WHERE login = $1
      `,
      [login]
    );
    const customer = rows[0];
    if (!customer || !(await bcrypt.compare(String(req.body.password || ""), customer.password_hash))) {
      return res.status(401).json({ error: "Неверный логин или пароль." });
    }

    req.session.customerUserId = customer.id;
    req.session.userRole = "customer";
    delete customer.password_hash;
    res.json({ customer });
  } catch (error) {
    next(error);
  }
});

app.post("/api/customer/logout", (req, res) => {
  delete req.session.customerUserId;
  if (req.session.userRole === "customer") {
    delete req.session.userRole;
  }
  res.json({ ok: true });
});

app.patch("/api/customer/profile", requireCustomer, async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const telegram = String(req.body.telegram || "").trim() || null;
    const { rows } = await query(
      `
        UPDATE customers
        SET name = $1, phone = $2, telegram = $3, updated_at = now()
        WHERE id = $4
        RETURNING id, login, name, phone, telegram
      `,
      [name, phone, telegram, req.session.customerUserId]
    );
    res.json({ customer: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.get("/api/customer/orders", requireCustomer, async (req, res, next) => {
  try {
    const { rows: orders } = await query(
      `
        SELECT
          id,
          order_number AS "orderNumber",
          price_mode AS "priceMode",
          status,
          pickup_date AS "pickupDate",
          total_amount AS "totalAmount",
          created_at AS "createdAt"
        FROM orders
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 50
      `,
      [req.session.customerUserId]
    );
    const ids = orders.map((order) => order.id);
    const { rows: items } = ids.length
      ? await query(
          `
            SELECT order_id AS "orderId", sku, name, qty, unit_price AS "unitPrice"
            FROM order_items
            WHERE order_id = ANY($1::uuid[])
            ORDER BY name
          `,
          [ids]
        )
      : { rows: [] };

    res.json({
      orders: orders.map((order) => ({
        ...order,
        items: items.filter((item) => item.orderId === order.id)
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/customer/favorites", requireCustomer, async (req, res, next) => {
  try {
    const { rows } = await query(
      `
        SELECT product_id AS "productId"
        FROM customer_favorites
        WHERE customer_id = $1
        ORDER BY created_at DESC
      `,
      [req.session.customerUserId]
    );
    res.json({ favorites: rows.map((row) => row.productId) });
  } catch (error) {
    next(error);
  }
});

app.put("/api/customer/favorites/:productId", requireCustomer, async (req, res, next) => {
  try {
    await query(
      `
        INSERT INTO customer_favorites (customer_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `,
      [req.session.customerUserId, req.params.productId]
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/customer/favorites/:productId", requireCustomer, async (req, res, next) => {
  try {
    await query("DELETE FROM customer_favorites WHERE customer_id = $1 AND product_id = $2", [
      req.session.customerUserId,
      req.params.productId
    ]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/orders", requireAdmin, async (_req, res, next) => {
  try {
    const { rows: orders } = await query(`
      SELECT
        id,
        order_number AS "orderNumber",
        customer_name AS "customerName",
        customer_phone AS "customerPhone",
        customer_telegram AS "customerTelegram",
        customer_id AS "customerId",
        price_mode AS "priceMode",
        status,
        pickup_date AS "pickupDate",
        total_amount AS "totalAmount",
        created_at AS "createdAt"
      FROM orders
      ORDER BY created_at DESC
      LIMIT 100
    `);

    const { rows: items } = await query(`
      SELECT order_id AS "orderId", sku, name, qty, unit_price AS "unitPrice"
      FROM order_items
      ORDER BY name
    `);

    res.json({
      orders: orders.map((order) => ({
        ...order,
        items: items.filter((item) => item.orderId === order.id)
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "confirmed", "ready", "picked_up", "cancelled"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: "Некорректный статус." });
    }

    const { rows } = await query(
      `
        UPDATE orders
        SET status = $1, updated_at = now()
        WHERE id = $2
        RETURNING id, status
      `,
      [req.body.status, req.params.id]
    );
    res.json({ order: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const stockQty = Number(req.body.stockQty);
    if (!Number.isInteger(stockQty) || stockQty < 0) {
      return res.status(400).json({ error: "Остаток должен быть целым числом от 0." });
    }
    const { rows } = await query(
      `
        UPDATE products
        SET stock_qty = $1, updated_at = now()
        WHERE id = $2
        RETURNING id, stock_qty AS "stockQty"
      `,
      [stockQty, req.params.id]
    );
    res.json({ product: rows[0] });
  } catch (error) {
    next(error);
  }
});

if (!process.env.VERCEL) {
  app.use(express.static(distDir));
  app.use((_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.publicMessage || "Ошибка сервера." });
});

function requireAdmin(req, res, next) {
  if (!req.session?.adminUserId || req.session.userRole !== "admin") {
    return res.status(401).json({ error: "Нужен вход администратора." });
  }
  next();
}

function requireCustomer(req, res, next) {
  if (!req.session?.customerUserId || req.session.userRole !== "customer") {
    return res.status(401).json({ error: "Нужен вход в кабинет покупателя." });
  }
  next();
}

function normalizeLogin(value) {
  return String(value || "").trim().toLowerCase();
}

async function nextOrderNumber(client) {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const { rows } = await client.query("SELECT count(*)::int AS count FROM orders WHERE order_number LIKE $1", [
    `SM-${date}-%`
  ]);
  return `SM-${date}-${String(rows[0].count + 1).padStart(4, "0")}`;
}

function httpError(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  error.publicMessage = publicMessage;
  return error;
}

if (!process.env.VERCEL) {
  process.on("SIGTERM", async () => {
    await pool.end();
    process.exit(0);
  });

  app.listen(port, () => {
    console.log(`Shark Mobile API listening on ${port}`);
  });
}

export default app;
