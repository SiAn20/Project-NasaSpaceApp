import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import nasaRoutes from "./routes/nasa.routes.js";
import aiRoutes from "./routes/ai.routes.js";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/nasa", nasaRoutes);
  app.use("/api/ai", aiRoutes);

  return app;
};
