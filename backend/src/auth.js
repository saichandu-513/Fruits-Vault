const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return process.env.JWT_SECRET || "dev_secret_change_me";
}

function signToken(payload) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing Authorization Bearer token" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.auth = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  signToken,
  requireAuth
};
