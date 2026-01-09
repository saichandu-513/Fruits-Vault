const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), override: true });

const app = require("./app");

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
});
