ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_orders_archived_at ON orders(archived_at);

CREATE TABLE IF NOT EXISTS product_overrides (
  product_id TEXT PRIMARY KEY,
  retail_price INTEGER CHECK (retail_price IS NULL OR retail_price >= 0),
  wholesale_price INTEGER CHECK (wholesale_price IS NULL OR wholesale_price >= 0),
  stock_qty INTEGER CHECK (stock_qty IS NULL OR stock_qty >= 0),
  name TEXT,
  description TEXT,
  image_url TEXT,
  hidden BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
