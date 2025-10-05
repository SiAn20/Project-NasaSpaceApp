import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || "4000",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY,
  nasaApiKey: process.env.NASA_API_KEY || "DEMO_KEY",
};
if (!env.geminiApiKey) {
  console.warn("⚠️  GEMINI_API_KEY no está configurada");
}
