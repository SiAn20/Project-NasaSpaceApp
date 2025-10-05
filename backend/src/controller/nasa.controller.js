import NasaService from "../services/nasa.service.js";
import WeatherProbabilityService from "../services/weather-probability.service.js";
import HourlyProbabilityService from "../services/hourly-probability.service.js";
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
  startDate: z.string().regex(/^\d{8}$/),
  endDate: z.string().regex(/^\d{8}$/),
});

const ProbabilitySchema = z.object({
  longitude: z
    .string()
    .regex(/^-?\d+\.?\d*$/)
    .transform(Number),
  latitude: z
    .string()
    .regex(/^-?\d+\.?\d*$/)
    .transform(Number),
  targetDate: z.string().regex(/^\d{8}$/),
  yearsBack: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional()
    .default("10"),
});

const HourlyProbabilitySchema = z.object({
  longitude: z
    .string()
    .regex(/^-?\d+\.?\d*$/)
    .transform(Number),
  latitude: z
    .string()
    .regex(/^-?\d+\.?\d*$/)
    .transform(Number),
  targetDate: z.string().regex(/^\d{8}$/),
  targetHour: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((h) => h >= 0 && h <= 23, {
      message: "Hour must be between 0 and 23",
    }),
  yearsBack: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional()
    .default("5"),
});

class NasaController {
  constructor() {
    this.nasaService = new NasaService();
    this.probabilityService = new WeatherProbabilityService();
    this.hourlyProbabilityService = new HourlyProbabilityService();
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

  /**
   * Endpoint: Calcula probabilidades de condiciones extremas para un DÍA completo
   */
  async getWeatherProbabilities(req, res) {
    try {
      const parsed = ProbabilitySchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid query parameters",
          details: parsed.error.issues,
          example: {
            longitude: "-68.1193",
            latitude: "-16.4897",
            targetDate: "20260715",
            yearsBack: "10",
          },
          description:
            "Calcula probabilidades de condiciones extremas basándose en datos históricos",
        });
      }

      const targetYear = parseInt(parsed.data.targetDate.substring(0, 4));
      const currentYear = new Date().getFullYear();

      if (targetYear < currentYear - 1) {
        return res.status(400).json({
          error: "Target date should be in the future or recent past",
          hint: "Use this endpoint to predict conditions for upcoming events",
        });
      }

      const result = await this.probabilityService.calculateProbabilities(
        parsed.data
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getWeatherProbabilities:", error);

      switch (error.message) {
        case "NASA_API_ERROR":
          return res.status(502).json({
            error: "Error connecting to NASA POWER API",
          });
        case "NO_HISTORICAL_DATA":
          return res.status(404).json({
            error:
              "No historical data available for the specified location and date",
            hint: "Try a different location or date",
          });
        case "INVALID_DATE_RANGE":
          return res.status(400).json({
            error: "Invalid date parameters",
          });
        default:
          return res.status(500).json({
            error: "Internal server error",
            message: error.message,
          });
      }
    }
  }

  /**
   * Endpoint NUEVO: Calcula probabilidades de condiciones extremas para una HORA específica
   */
  async getHourlyWeatherProbabilities(req, res) {
    try {
      const parsed = HourlyProbabilitySchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid query parameters",
          details: parsed.error.issues,
          example: {
            longitude: "-68.1193",
            latitude: "-16.4897",
            targetDate: "20260715",
            targetHour: "14",
            yearsBack: "5",
          },
          description:
            "Calcula probabilidades de condiciones extremas para una hora específica del día",
        });
      }

      const targetYear = parseInt(parsed.data.targetDate.substring(0, 4));
      const currentYear = new Date().getFullYear();

      if (targetYear < currentYear - 1) {
        return res.status(400).json({
          error: "Target date should be in the future or recent past",
          hint: "Use this endpoint to predict conditions for upcoming events",
        });
      }

      const result =
        await this.hourlyProbabilityService.calculateHourlyProbabilities(
          parsed.data
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getHourlyWeatherProbabilities:", error);

      switch (error.message) {
        case "NASA_API_ERROR":
          return res.status(502).json({
            error: "Error connecting to NASA POWER API",
          });
        case "NO_HISTORICAL_DATA":
          return res.status(404).json({
            error:
              "No historical hourly data available for the specified location, date, and hour",
            hint: "Hourly data is available from 2001 onwards. Try a different location or date",
          });
        case "INVALID_DATE_RANGE":
          return res.status(400).json({
            error: "Invalid date parameters",
          });
        case "INVALID_HOUR":
          return res.status(400).json({
            error: "Invalid hour. Must be between 0 and 23",
          });
        default:
          return res.status(500).json({
            error: "Internal server error",
            message: error.message,
          });
      }
    }
  }
}

export default NasaController;
