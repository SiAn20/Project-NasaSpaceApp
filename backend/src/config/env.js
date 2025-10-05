import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || "4000",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  groqApiKey: process.env.GROQ_API_KEY,
  nasaApiKey: process.env.NASA_API_KEY || "DEMO_KEY",
};
