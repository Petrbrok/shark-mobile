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
            (sku, slug, name, section, category, subcategory, brand, retail_price, wholesale_price, stock_qty, image_url, gallery, description, attributes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14::jsonb)
          ON CONFLICT (sku) DO UPDATE SET
            slug = EXCLUDED.slug,
            name = EXCLUDED.name,
            section = EXCLUDED.section,
            category = EXCLUDED.category,
            subcategory = EXCLUDED.subcategory,
            brand = EXCLUDED.brand,
            retail_price = EXCLUDED.retail_price,
            wholesale_price = EXCLUDED.wholesale_price,
            stock_qty = EXCLUDED.stock_qty,
            image_url = EXCLUDED.image_url,
            gallery = EXCLUDED.gallery,
            description = EXCLUDED.description,
            attributes = EXCLUDED.attributes,
            updated_at = now()
        `,
        [
          product.sku,
          product.slug || product.sku.toLowerCase(),
          product.name,
          product.section || product.category,
          product.category,
          product.subcategory || "",
          product.brand,
          product.retailPrice,
          product.wholesalePrice,
          product.stockQty,
          product.imageUrl,
          JSON.stringify(product.gallery || []),
          product.description,
          JSON.stringify(product.attributes || {})
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
