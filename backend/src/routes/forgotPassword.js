const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

// You need to set up nodemailer or similar for sending emails
const sendResetEmail = async (email, token) => {
  // TODO: Implement email sending logic here
  // Example: send email with link: `${process.env.FRONTEND_URL}/reset-password/${token}`
  console.log(`Send reset link to ${email}: /reset-password/${token}`);
};

router.post('/forgot-password', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Find user
  const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userRes.rows.length === 0) {
    // Don't reveal if email exists
    return res.json({ success: true });
  }
  const userId = userRes.rows[0].id;

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  // Save token in DB (add a password_resets table if needed)
  await db.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, token, expires]);

  // Send email
  await sendResetEmail(email, token);

  res.json({ success: true });
});

module.exports = router;
