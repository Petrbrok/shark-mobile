import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool, withTransaction } from "./db.js";
import { seedProducts } from "./products.seed.js";

dotenv.config();

async function seed() {
  const login = process.env.ADMIN_LOGIN || "owner";
  const password = process.env.ADMIN_PASSWORD || "change_me_owner_password";
  const passwordHash = await bcrypt.hash(password, 12);

  await withTransaction(async (client) => {
    for (const product of seedProducts) {
      await client.query(
        `
          INSERT INTO products
            (sku, name, category, brand, retail_price, wholesale_price, stock_qty, image_url, description)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (sku) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            brand = EXCLUDED.brand,
            retail_price = EXCLUDED.retail_price,
            wholesale_price = EXCLUDED.wholesale_price,
            stock_qty = EXCLUDED.stock_qty,
            image_url = EXCLUDED.image_url,
            description = EXCLUDED.description,
            updated_at = now()
        `,
        [
          product.sku,
          product.name,
          product.category,
          product.brand,
          product.retailPrice,
          product.wholesalePrice,
          product.stockQty,
          product.imageUrl,
          product.description
        ]
      );
    }

    await client.query(
      `
        INSERT INTO admin_users (login, password_hash)
        VALUES ($1, $2)
        ON CONFLICT (login) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          updated_at = now()
      `,
      [login, passwordHash]
    );
  });
}

seed()
  .then(() => {
    console.log(`Seeded ${seedProducts.length} products`);
    return pool.end();
  })
  .catch((error) => {
    console.error(error);
    pool.end().finally(() => process.exit(1));
  });
