import NasaService from "../services/nasa.service.js";
import { z } from "zod";

const WeatherDataSchema = z.object({
  longitude: z
    .string()
    .regex(/^-?\d+\.?\d*$/)
    .transform(Number),
  latitude: z
    .string()
    .regex(/^-?\d+\.?\d*$/)
    .transform(Number),
  startDate: z.string().regex(/^\d{8}$/), // Formato: YYYYMMDD
  endDate: z.string().regex(/^\d{8}$/), // Formato: YYYYMMDD
});

class NasaController {
  constructor() {
    this.nasaService = new NasaService();
  }

  async getWeatherData(req, res) {
    try {
      const parsed = WeatherDataSchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid query parameters",
          details: parsed.error.issues,
          example: {
            longitude: "-68.1193",
            latitude: "-16.4897",
            startDate: "20250101",
            endDate: "20251004",
          },
        });
      }

      const result = await this.nasaService.getWeatherData(parsed.data);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getWeatherData:", error);

      switch (error.message) {
        case "NASA_API_ERROR":
          return res.status(502).json({
            error: "Error connecting to NASA POWER API",
          });
        case "INVALID_DATE_RANGE":
          return res.status(400).json({
            error: "Invalid date range. End date must be after start date",
          });
        case "DATA_NOT_AVAILABLE":
          return res.status(404).json({
            error: "Weather data not available for the specified parameters",
          });
        default:
          return res.status(500).json({
            error: "Internal server error",
          });
      }
    }
  }

  async getHourlyWeatherData(req, res) {
    try {
      const parsed = WeatherDataSchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid query parameters",
          details: parsed.error.issues,
          example: {
            longitude: "-68.1193",
            latitude: "-16.4897",
            startDate: "20250101",
            endDate: "20250131",
          },
        });
      }

      const result = await this.nasaService.getHourlyWeatherData(parsed.data);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getHourlyWeatherData:", error);

      switch (error.message) {
        case "NASA_API_ERROR":
          return res.status(502).json({
            error: "Error connecting to NASA POWER API",
          });
        case "INVALID_DATE_RANGE":
          return res.status(400).json({
            error: "Invalid date range. End date must be after start date",
          });
        case "DATE_RANGE_TOO_LARGE":
          return res.status(400).json({
            error:
              "Date range too large. For hourly data, maximum range is 1 year",
          });
        case "DATA_NOT_AVAILABLE":
          return res.status(404).json({
            error: "Weather data not available for the specified parameters",
          });
        default:
          return res.status(500).json({
            error: "Internal server error",
          });
      }
    }
  }
}

export default NasaController;
