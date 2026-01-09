const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), override: true });

const http = require("http");
const app = require("./app");

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);

    const req = http.request(
      {
        method: "POST",
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            const json = raw ? JSON.parse(raw) : null;
            resolve({ statusCode: res.statusCode, json });
          } catch (e) {
            reject(new Error(`Non-JSON response (${res.statusCode}): ${raw}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

const server = app.listen(0, async () => {
  const { port } = server.address();
  const email = `selftest_${Date.now()}@example.com`;

  try {
    const result = await postJson(`http://localhost:${port}/api/auth/signup`, {
      name: "Self Test",
      email,
      mobile: "9999999999",
      password: "testpass1",
      confirmPassword: "testpass1"
    });

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result, null, 2));
    server.close(() => process.exit(result.statusCode === 201 ? 0 : 1));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    server.close(() => process.exit(1));
  }
});
