const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../db");
const { signToken, requireAuth } = require("../auth");

const router = express.Router();

function normalizeEmail(email) {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  // Simple validation: enough for basic signup/login UX.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/signup", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const mobile = typeof req.body?.mobile === "string" ? req.body.mobile.trim() : "";
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  const confirmPassword = req.body?.confirmPassword;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email" });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  if (typeof confirmPassword === "string" && confirmPassword !== password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  if (mobile && !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Mobile number must be 10 digits" });
  }

  try {
    await db.ensureAuthSchema();
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, email, mobile, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, mobile, created_at as \"createdAt\"",
      [name, email, mobile || null, passwordHash]
    );

    return res.status(201).json({
      message: "Signup successful",
      user: result.rows[0]
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/signup failed", {
      code: err?.code,
      message: err?.message,
      detail: err?.detail
    });

    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

    if (err?.code === "42P01" || err?.code === "42703") {
      return res.status(500).json({
        error: "Database schema is not updated. Apply database/schema.sql and try again."
      });
    }

    return res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  if (!isValidEmail(email) || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  try {
    const result = await db.query(
      "SELECT id, name, email, mobile, password_hash, created_at as \"createdAt\" FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken({ sub: String(user.id), email: user.email });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/login failed", {
      code: err?.code,
      message: err?.message,
      detail: err?.detail
    });
    return res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = Number(req.auth?.sub);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const result = await db.query(
      "SELECT id, name, email, mobile, created_at as \"createdAt\" FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const mobile = typeof req.body?.mobile === "string" ? req.body.mobile.trim() : "";

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (mobile && !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Mobile number must be 10 digits" });
  }

  try {
    const userId = Number(req.auth?.sub);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Invalid token" });
    }

    await db.ensureAuthSchema();
    const result = await db.query(
      "UPDATE users SET name = $1, mobile = $2 WHERE id = $3 RETURNING id, name, email, mobile, created_at as \"createdAt\"",
      [name, mobile || null, userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/me PATCH failed", { code: err?.code, message: err?.message, detail: err?.detail });
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
