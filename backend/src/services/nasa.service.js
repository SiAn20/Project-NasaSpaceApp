import axios from "axios";

class NasaService {
  constructor() {
    this.baseUrl = "https://power.larc.nasa.gov/api/temporal/daily/point";
    this.hourlyBaseUrl =
      "https://power.larc.nasa.gov/api/temporal/hourly/point";
    this.parameters = [
      "PRECTOTCORR",
      "T2M",
      "RH2M",
      "WS10M",
      "PS",
      "CLOUD_AMT_DAY",
      "ALLSKY_SFC_UV_INDEX",
      "ALLSKY_SFC_SW_DWN",
    ];
    this.hourlyParameters = [
      "PRECTOTCORR",
      "T2M",
      "RH2M",
      "WS10M",
      "PS",
      "ALLSKY_SFC_SW_DWN",
    ];
    this.community = "RE"; // Renewable Energy
  }

  async getWeatherData({ longitude, latitude, startDate, endDate }) {
    try {
      if (parseInt(endDate) < parseInt(startDate)) {
        throw new Error("INVALID_DATE_RANGE");
      }

      const url = this.buildUrl({
        longitude,
        latitude,
        startDate,
        endDate,
      });

      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.data || !response.data.properties) {
        throw new Error("DATA_NOT_AVAILABLE");
      }

      const formattedData = this.formatWeatherData(response.data);

      return {
        success: true,
        location: {
          longitude,
          latitude,
        },
        dateRange: {
          start: startDate,
          end: endDate,
        },
        data: formattedData,
      };
    } catch (error) {
      console.error("Error in NasaService.getWeatherData:", error);

      if (
        error.message === "INVALID_DATE_RANGE" ||
        error.message === "DATA_NOT_AVAILABLE"
      ) {
        throw error;
      }

      if (error.response) {
        console.error(
          "NASA API Error:",
          error.response.status,
          error.response.data
        );
        throw new Error("NASA_API_ERROR");
      }

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("NASA_API_ERROR");
      }

      throw error;
    }
  }

  buildUrl({ longitude, latitude, startDate, endDate }) {
    const params = new URLSearchParams({
      parameters: this.parameters.join(","),
      community: this.community,
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: startDate,
      end: endDate,
      format: "JSON",
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  formatWeatherData(rawData) {
    const { properties } = rawData;
    const { parameter } = properties;

    const parameterMapping = {
      PRECTOTCORR: "precipitation",
      T2M: "temperature",
      RH2M: "humidity",
      WS10M: "windSpeed",
      PS: "pressure",
      CLOUD_AMT_DAY: "cloudAmount",
      ALLSKY_SFC_UV_INDEX: "uvIndex",
      ALLSKY_SFC_SW_DWN: "solarRadiation",
    };

    const parameterUnits = {};
    if (rawData.parameters) {
      for (const [key, value] of Object.entries(rawData.parameters)) {
        const friendlyName = parameterMapping[key] || key;
        parameterUnits[friendlyName] = {
          units: value.units,
          longname: value.longname,
        };
      }
    }

    const dates = Object.keys(parameter.PRECTOTCORR || {});

    const dailyData = dates.map((date) => ({
      date: this.formatDate(date),
      precipitation: parameter.PRECTOTCORR?.[date] ?? null,
      temperature: parameter.T2M?.[date] ?? null,
      humidity: parameter.RH2M?.[date] ?? null,
      windSpeed: parameter.WS10M?.[date] ?? null,
      pressure: parameter.PS?.[date] ?? null,
      cloudAmount: parameter.CLOUD_AMT_DAY?.[date] ?? null,
      uvIndex: parameter.ALLSKY_SFC_UV_INDEX?.[date] ?? null,
      solarRadiation: parameter.ALLSKY_SFC_SW_DWN?.[date] ?? null,
    }));

    const statistics = this.calculateStatistics(parameter);

    return {
      daily: dailyData,
      statistics,
      metadata: {
        totalDays: dailyData.length,
        source: "NASA POWER API",
        parameters: parameterUnits,
      },
    };
  }

  formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  calculateStatistics(parameter) {
    const stats = {};

    for (const [key, values] of Object.entries(parameter)) {
      const validValues = Object.values(values).filter(
        (v) => v !== null && v !== -999
      );

      if (validValues.length > 0) {
        stats[key] = {
          min: Math.min(...validValues),
          max: Math.max(...validValues),
          avg: validValues.reduce((a, b) => a + b, 0) / validValues.length,
        };
      }
    }

    return stats;
  }

  async getHourlyWeatherData({ longitude, latitude, startDate, endDate }) {
    try {
      if (parseInt(endDate) < parseInt(startDate)) {
        throw new Error("INVALID_DATE_RANGE");
      }

      const start = new Date(
        startDate.substring(0, 4),
        parseInt(startDate.substring(4, 6)) - 1,
        startDate.substring(6, 8)
      );
      const end = new Date(
        endDate.substring(0, 4),
        parseInt(endDate.substring(4, 6)) - 1,
        endDate.substring(6, 8)
      );
      const daysDiff = (end - start) / (1000 * 60 * 60 * 24);

      if (daysDiff > 366) {
        throw new Error("DATE_RANGE_TOO_LARGE");
      }

      const url = this.buildHourlyUrl({
        longitude,
        latitude,
        startDate,
        endDate,
      });

      const response = await axios.get(url, {
        timeout: 60000,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.data || !response.data.properties) {
        throw new Error("DATA_NOT_AVAILABLE");
      }

      const formattedData = this.formatHourlyWeatherData(response.data);

      return {
        success: true,
        location: {
          longitude,
          latitude,
        },
        dateRange: {
          start: startDate,
          end: endDate,
        },
        data: formattedData,
      };
    } catch (error) {
      console.error("Error in NasaService.getHourlyWeatherData:", error);

      if (
        error.message === "INVALID_DATE_RANGE" ||
        error.message === "DATA_NOT_AVAILABLE" ||
        error.message === "DATE_RANGE_TOO_LARGE"
      ) {
        throw error;
      }

      if (error.response) {
        console.error(
          "NASA API Error:",
          error.response.status,
          error.response.data
        );
        throw new Error("NASA_API_ERROR");
      }

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("NASA_API_ERROR");
      }

      throw error;
    }
  }

  buildHourlyUrl({ longitude, latitude, startDate, endDate }) {
    const params = new URLSearchParams({
      parameters: this.hourlyParameters.join(","),
      community: this.community,
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: startDate,
      end: endDate,
      format: "JSON",
    });

    return `${this.hourlyBaseUrl}?${params.toString()}`;
  }

  formatHourlyWeatherData(rawData) {
    const { properties } = rawData;
    const { parameter } = properties;

    const parameterMapping = {
      PRECTOTCORR: "precipitation",
      T2M: "temperature",
      RH2M: "humidity",
      WS10M: "windSpeed",
      PS: "pressure",
      ALLSKY_SFC_SW_DWN: "solarRadiation",
    };

    const parameterUnits = {};
    if (rawData.parameters) {
      for (const [key, value] of Object.entries(rawData.parameters)) {
        const friendlyName = parameterMapping[key] || key;
        parameterUnits[friendlyName] = {
          units: value.units,
          longname: value.longname,
        };
      }
    }

    const dateTimeKeys = Object.keys(parameter.T2M || {});

    const hourlyData = dateTimeKeys.map((dateTimeKey) => {
      const year = dateTimeKey.substring(0, 4);
      const month = dateTimeKey.substring(4, 6);
      const day = dateTimeKey.substring(6, 8);
      const hour = dateTimeKey.substring(8, 10);

      return {
        dateTime: `${year}-${month}-${day} ${hour}:00`,
        date: `${year}-${month}-${day}`,
        hour: parseInt(hour),
        precipitation: parameter.PRECTOTCORR?.[dateTimeKey] ?? null,
        temperature: parameter.T2M?.[dateTimeKey] ?? null,
        humidity: parameter.RH2M?.[dateTimeKey] ?? null,
        windSpeed: parameter.WS10M?.[dateTimeKey] ?? null,
        pressure: parameter.PS?.[dateTimeKey] ?? null,
        solarRadiation: parameter.ALLSKY_SFC_SW_DWN?.[dateTimeKey] ?? null,
      };
    });

    const statistics = this.calculateStatistics(parameter);

    return {
      hourly: hourlyData,
      statistics,
      metadata: {
        totalHours: hourlyData.length,
        totalDays: Math.ceil(hourlyData.length / 24),
        source: "NASA POWER API",
        dataType: "hourly",
        parameters: parameterUnits,
      },
    };
  }
}

export default NasaService;
