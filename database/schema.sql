-- Minimal schema for Fruits Vault backend

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mobile TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If the users table already existed from an earlier version, re-running this
-- file should still bring it up to date.
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS mobile TEXT;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash')
  THEN
    ALTER TABLE users RENAME COLUMN password TO password_hash;
  END IF;
END $$;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS fruits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT
);

CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_orders_user_created_at ON orders(user_id, created_at DESC);

-- Optional seed data
INSERT INTO fruits (id, name, price, image) VALUES
  ('apple', 'Apple', 2.00, '/images/apple.jpg'),
  ('banana', 'Banana', 1.00, '/images/banana.jpg'),
  ('orange', 'Orange', 1.50, '/images/orange.jpg'),
  ('mango', 'Mango', 3.00, '/images/mango.jpg'),
  ('pineapple', 'Pineapple', 2.50, '/images/pineapple.jpg'),
  ('grapes', 'Grapes', 2.20, '/images/grapes.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO coupons (code, discount_percent, description) VALUES
  ('FRUIT10', 10, '10% off'),
  ('FRESH15', 15, '15% off'),
  ('WELCOME5', 5, '5% off'),
  ('BASKET12', 12, 'Basket Savings — 12% off')
ON CONFLICT (code) DO NOTHING;
