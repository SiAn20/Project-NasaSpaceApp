import express from "express";
import NasaController from "../controller/nasa.controller.js";

const router = express.Router();
const nasaController = new NasaController();

router.get("/weather-data", (req, res) =>
  nasaController.getWeatherData(req, res)
);

export default router;
