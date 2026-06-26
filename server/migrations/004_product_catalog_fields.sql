ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT 'Аксессуары',
  ADD COLUMN IF NOT EXISTS subcategory TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_products_section ON products(section);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
