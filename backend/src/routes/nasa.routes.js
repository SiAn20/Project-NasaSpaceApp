import express from "express";
import NasaController from "../controller/nasa.controller.js";

const router = express.Router();
const nasaController = new NasaController();

router.get("/weather-data", (req, res) =>
  nasaController.getWeatherData(req, res)
);

router.get("/weather-data/hourly", (req, res) =>
  nasaController.getHourlyWeatherData(req, res)
);

router.get("/weather-probabilities", (req, res) =>
  nasaController.getWeatherProbabilities(req, res)
);

router.get("/weather-probabilities/hourly", (req, res) =>
  nasaController.getHourlyWeatherProbabilities(req, res)
);

export default router;
