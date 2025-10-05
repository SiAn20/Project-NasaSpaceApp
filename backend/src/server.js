import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();


const PORT = process.env.PORT || env.port || 4000;

async function start() {
  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
