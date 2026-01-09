const express = require("express");

const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();

function asUserId(req) {
  const id = Number(req.auth?.sub);
  return Number.isFinite(id) ? id : null;
}

router.get("/", requireAuth, async (req, res) => {
  const userId = asUserId(req);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  try {
    await db.ensureOrdersSchema();

    const result = await db.query(
      "SELECT " +
        "o.id, " +
        "o.total::float as total, " +
        "o.created_at as \"createdAt\", " +
        "COALESCE(" +
          "json_agg(" +
            "json_build_object(" +
              "'name', i.name, " +
              "'price', (i.price::float), " +
              "'image', i.image, " +
              "'quantity', i.quantity" +
            ") ORDER BY i.id" +
          ") FILTER (WHERE i.id IS NOT NULL), " +
          "'[]'::json" +
        ") as items " +
      "FROM orders o " +
      "LEFT JOIN order_items i ON i.order_id = o.id " +
      "WHERE o.user_id = $1 " +
      "GROUP BY o.id " +
      "ORDER BY o.created_at DESC",
      [userId]
    );

    return res.json({ orders: result.rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/orders GET failed", { code: err?.code, message: err?.message, detail: err?.detail });
    return res.status(500).json({ error: "Failed to load orders" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const userId = asUserId(req);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const normalized = items
    .map((it) => ({
      name: typeof it?.name === "string" ? it.name.trim() : "",
      price: Number(it?.price),
      image: typeof it?.image === "string" ? it.image : null,
      quantity: Number.isFinite(Number(it?.quantity)) ? Math.floor(Number(it.quantity)) : 1
    }))
    .filter((it) => it.name && Number.isFinite(it.price) && it.quantity > 0);

  if (normalized.length === 0) {
    return res.status(400).json({ error: "Invalid cart items" });
  }

  const total = Number(
    normalized.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2)
  );

  const pool = db.getPool();
  if (!pool) {
    return res.status(500).json({ error: "PostgreSQL is not configured" });
  }

  const client = await pool.connect();
  try {
    await db.ensureOrdersSchema();
    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, total::float as total, created_at as \"createdAt\"",
      [userId, total]
    );
    const order = orderResult.rows[0];

    for (const it of normalized) {
      await client.query(
        "INSERT INTO order_items (order_id, name, price, image, quantity) VALUES ($1, $2, $3, $4, $5)",
        [order.id, it.name, it.price, it.image, it.quantity]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ order });
  } catch (err) {
    await client.query("ROLLBACK");
    // eslint-disable-next-line no-console
    console.error("/api/orders POST failed", { code: err?.code, message: err?.message, detail: err?.detail });
    return res.status(500).json({ error: "Failed to place order" });
  } finally {
    client.release();
  }
});

module.exports = router;
