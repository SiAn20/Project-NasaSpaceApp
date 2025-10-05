import express from "express";
import aiService from "../services/ai.service.js";

const router = express.Router();

router.post("/interpret", async (req, res) => {
  try {
    const { weatherData, location } = req.body;

    if (!weatherData || !location) {
      return res.status(400).json({
        error: "Se requieren weatherData y location",
      });
    }

    const interpretation = await aiService.interpretWeatherData(
      weatherData,
      location
    );

    res.json({
      success: true,
      interpretation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error interpretando datos:", error);
    res.status(500).json({
      error: "Error al interpretar los datos climáticos",
      message: error.message,
    });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Se requiere un mensaje" });
    }

    const response = await aiService.chatWithAI(
      message,
      conversationHistory || []
    );

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en chat:", error);
    res.status(500).json({
      error: "Error al procesar el mensaje",
      message: error.message,
    });
  }
});

export default router;
