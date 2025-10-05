import { createApp } from "./app.js";
import { env } from "./config/env.js";

const PORT = env.port;
const app = createApp();

async function start() {
  app.listen(PORT, () => {
    console.log(`API listening on http://127.0.0.1:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
