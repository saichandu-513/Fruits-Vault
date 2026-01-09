function normalizeBaseUrl(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withoutTrailing = trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;

  // CRA env vars are strings; it's easy to accidentally set "localhost:5000".
  // Treat that as "http://localhost:5000".
  if (!/^https?:\/\//i.test(withoutTrailing) && /^[\w.-]+:\d+/.test(withoutTrailing)) {
    return `http://${withoutTrailing}`;
  }

  return withoutTrailing;
}

export const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);

export function apiUrl(pathname) {
  const path = typeof pathname === "string" ? pathname : "";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${withSlash}` : withSlash;
}
