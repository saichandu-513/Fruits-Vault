const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), override: true });

const app = require("./app");

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
