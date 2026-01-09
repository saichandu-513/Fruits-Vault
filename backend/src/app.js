const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const db = require("./db");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);

const fruits = [
  { id: "apple", name: "Apple", price: 2, image: "/images/apple.jpg" },
  { id: "banana", name: "Banana", price: 1, image: "/images/banana.jpg" },
  { id: "orange", name: "Orange", price: 1.5, image: "/images/orange.jpg" },
  { id: "mango", name: "Mango", price: 3, image: "/images/mango.jpg" },
  { id: "pineapple", name: "Pineapple", price: 2.5, image: "/images/pineapple.jpg" },
  { id: "grapes", name: "Grapes", price: 2.2, image: "/images/grapes.jpg" }
];

const coupons = [
  { code: "FRUIT10", discountPercent: 10, description: "10% off" },
  { code: "FRESH15", discountPercent: 15, description: "15% off" },
  { code: "WELCOME5", discountPercent: 5, description: "5% off" },
  { code: "BASKET12", discountPercent: 12, description: "Basket Savings — 12% off" }
];

let cartItems = [];
let orders = [];

function calculateCartTotal(items) {
  return Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
}

app.get("/api/health", (req, res) => {
  db.checkDbConnection()
    .then((pg) => {
      res.json({ ok: true, service: "fruits-vault-backend", postgres: pg });
    })
    .catch((err) => {
      res.json({
        ok: true,
        service: "fruits-vault-backend",
        postgres: { configured: true, ok: false, error: err?.message || String(err) }
      });
    });
});

app.get("/api/fruits", async (req, res) => {
  try {
    try {
      await db.ensureCatalogSchema();
    } catch (err) {
      if (err?.code !== "PG_NOT_CONFIGURED") throw err;
    }

    const result = await db.query(
      "SELECT id, name, price::float as price, image FROM fruits ORDER BY name ASC"
    );
    return res.json(result.rows);
  } catch (err) {
    if (err?.code === "PG_NOT_CONFIGURED") {
      return res.json(fruits);
    }

    // Demo-friendly fallback if the DB exists but catalog tables/columns are missing.
    if (err?.code === "42P01" || err?.code === "42703") {
      // eslint-disable-next-line no-console
      console.error("/api/fruits falling back to in-memory data", { code: err?.code, message: err?.message });
      return res.json(fruits);
    }
    return res.status(500).json({
      error: "Failed to load fruits from PostgreSQL",
      details: err?.message || String(err)
    });
  }
});

app.get("/api/coupons", async (req, res) => {
  try {
    try {
      await db.ensureCatalogSchema();
    } catch (err) {
      if (err?.code !== "PG_NOT_CONFIGURED") throw err;
    }

    const result = await db.query(
      "SELECT code, discount_percent as \"discountPercent\", description FROM coupons ORDER BY code ASC"
    );
    return res.json(result.rows);
  } catch (err) {
    if (err?.code === "PG_NOT_CONFIGURED") {
      return res.json(coupons);
    }

    // Demo-friendly fallback if the DB exists but coupons table/columns are missing.
    if (err?.code === "42P01" || err?.code === "42703") {
      // eslint-disable-next-line no-console
      console.error("/api/coupons falling back to in-memory data", { code: err?.code, message: err?.message });
      return res.json(coupons);
    }
    return res.status(500).json({
      error: "Failed to load coupons from PostgreSQL",
      details: err?.message || String(err)
    });
  }
});

app.get("/api/cart", (req, res) => {
  res.json({ items: cartItems, total: calculateCartTotal(cartItems) });
});

app.post("/api/cart/items", (req, res) => {
  const { name, price, image, quantity } = req.body || {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }
  if (typeof price !== "number" || Number.isNaN(price)) {
    return res.status(400).json({ error: "price must be a number" });
  }

  const safeQuantity =
    typeof quantity === "number" && Number.isFinite(quantity) && quantity > 0
      ? Math.floor(quantity)
      : 1;

  const existingIndex = cartItems.findIndex((i) => i.name === name);
  if (existingIndex >= 0) {
    cartItems[existingIndex] = {
      ...cartItems[existingIndex],
      quantity: cartItems[existingIndex].quantity + safeQuantity
    };
  } else {
    cartItems.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      price,
      image: typeof image === "string" ? image : null,
      quantity: safeQuantity
    });
  }

  res.status(201).json({ items: cartItems, total: calculateCartTotal(cartItems) });
});

app.delete("/api/cart", (req, res) => {
  cartItems = [];
  res.status(204).send();
});

// Orders are handled by PostgreSQL-backed routes in ./routes/orders

module.exports = app;
