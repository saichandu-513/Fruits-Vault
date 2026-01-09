const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), override: true });

const http = require("http");
const app = require("./app");

function requestJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve({ statusCode: res.statusCode, json });
          } catch (e) {
            reject(new Error(`Non-JSON response (${res.statusCode}): ${data}`));
          }
        });
      })
      .on("error", reject);
  });
}

const server = app.listen(0, async () => {
  const { port } = server.address();

  try {
    const result = await requestJson(`http://localhost:${port}/api/health`);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result, null, 2));
    server.close(() => process.exit(0));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    server.close(() => process.exit(1));
  }
});
