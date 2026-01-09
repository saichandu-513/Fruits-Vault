const { Pool } = require("pg");

let pool = null;

function createPoolFromEnv() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const hasPgPieces = Boolean(process.env.PGHOST || process.env.PGUSER || process.env.PGDATABASE);

  if (!hasDatabaseUrl && !hasPgPieces) {
    return null;
  }

  const config = hasDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL
      }
    : {
        host: process.env.PGHOST,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
      };

  // Works for many hosted PG providers.
  if (process.env.PGSSL === "true") {
    config.ssl = { rejectUnauthorized: false };
  }

  return new Pool(config);
}

function getPool() {
  if (pool) return pool;
  pool = createPoolFromEnv();
  return pool;
}

async function checkDbConnection() {
  const p = getPool();
  if (!p) {
    return { configured: false, ok: false };
  }

  try {
    const result = await p.query("SELECT 1 as ok");
    return { configured: true, ok: result?.rows?.[0]?.ok === 1 };
  } catch (err) {
    return { configured: true, ok: false, error: err?.message || String(err) };
  }
}

async function query(text, params) {
  const p = getPool();
  if (!p) {
    const err = new Error("PostgreSQL is not configured. Set DATABASE_URL or PGHOST/PGUSER/PGDATABASE.");
    err.code = "PG_NOT_CONFIGURED";
    throw err;
  }
  return p.query(text, params);
}

async function ensureAuthSchema() {
  // Intentionally minimal (no migration framework). Safe to run multiple times.
  await query(
    "CREATE TABLE IF NOT EXISTS users (" +
      "id BIGSERIAL PRIMARY KEY," +
      "email TEXT NOT NULL UNIQUE," +
      "name TEXT NOT NULL," +
      "mobile TEXT," +
      "password_hash TEXT NOT NULL," +
      "created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()" +
    ")"
  );

  // If table existed from earlier versions, bring it up to date.
  await query("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS name TEXT");
  await query("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS mobile TEXT");

  // Migrate older schemas that used plaintext `password`.
  // If `password` exists and `password_hash` doesn't, rename it.
  await query(
    "DO $$ BEGIN " +
      "IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') " +
      "AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') " +
      "THEN ALTER TABLE users RENAME COLUMN password TO password_hash; " +
      "END IF; " +
    "END $$;"
  );

  await query("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password_hash TEXT");
  await query("ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()");
}

async function ensureOrdersSchema() {
  await query(
    "CREATE TABLE IF NOT EXISTS orders (" +
      "id BIGSERIAL PRIMARY KEY," +
      "user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE," +
      "total NUMERIC(10,2) NOT NULL," +
      "created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()" +
    ")"
  );

  await query(
    "CREATE TABLE IF NOT EXISTS order_items (" +
      "id BIGSERIAL PRIMARY KEY," +
      "order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE," +
      "name TEXT NOT NULL," +
      "price NUMERIC(10,2) NOT NULL," +
      "image TEXT," +
      "quantity INTEGER NOT NULL CHECK (quantity > 0)" +
    ")"
  );

  await query(
    "CREATE INDEX IF NOT EXISTS idx_orders_user_created_at ON orders(user_id, created_at DESC)"
  );
}

async function ensureCatalogSchema() {
  await query(
    "CREATE TABLE IF NOT EXISTS fruits (" +
      "id TEXT PRIMARY KEY," +
      "name TEXT NOT NULL," +
      "price NUMERIC(10,2) NOT NULL," +
      "image TEXT" +
    ")"
  );

  await query(
    "CREATE TABLE IF NOT EXISTS coupons (" +
      "code TEXT PRIMARY KEY," +
      "discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100)," +
      "description TEXT" +
    ")"
  );

  // Seed data (safe to run multiple times)
  await query(
    "INSERT INTO fruits (id, name, price, image) VALUES " +
      "('apple', 'Apple', 2.00, '/images/apple.jpg')," +
      "('banana', 'Banana', 1.00, '/images/banana.jpg')," +
      "('orange', 'Orange', 1.50, '/images/orange.jpg')," +
      "('mango', 'Mango', 3.00, '/images/mango.jpg')," +
      "('pineapple', 'Pineapple', 2.50, '/images/pineapple.jpg')," +
      "('grapes', 'Grapes', 2.20, '/images/grapes.jpg') " +
    "ON CONFLICT (id) DO NOTHING"
  );

  await query(
    "INSERT INTO coupons (code, discount_percent, description) VALUES " +
      "('FRUIT10', 10, '10% off')," +
      "('FRESH15', 15, '15% off')," +
      "('WELCOME5', 5, '5% off')," +
      "('BASKET12', 12, 'Basket Savings — 12% off') " +
    "ON CONFLICT (code) DO NOTHING"
  );
}

module.exports = {
  getPool,
  query,
  checkDbConnection,
  ensureAuthSchema,
  ensureOrdersSchema,
  ensureCatalogSchema
};
