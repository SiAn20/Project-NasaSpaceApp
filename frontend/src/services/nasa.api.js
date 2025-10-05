import { api } from "./api";

export const nasaAPI = {
  getWeatherDaily: async (data) => {
    const { lat, lon, dateRange } = data;
    const response = await api.get(
      `weather-data?longitude=${lon}&latitude=${lat}&startDate=${dateRange.start.replaceAll(
        "-",
        ""
      )}&endDate=${dateRange.end.replaceAll("-", "")}`
    );
    return response.data;
  },

  getWeatherHours: async (data) => {
    const { lat, lon, dateRange } = data;
    const response = await api.get(
      `weather-data/hourly?longitude=${lon}&latitude=${lat}&startDate=${dateRange.start.replaceAll(
        "-",
        ""
      )}&endDate=${dateRange.end.replaceAll("-", "")}`
    );
    return response.data;
  },

  getWeatherProbabilities: async (data) => {
    const { lat, lon, date, yearsBack } = data;

    const response = await api.get(
      `weather-probabilities?longitude=${lon}&latitude=${lat}&targetDate=${date.replaceAll(
        "-",
        ""
      )}&yearsBack=${yearsBack}`
    );
    return response.data;
  },

  getWeatherHoursProbabilities: async (data) => {
    const { lat, lon, date, hour, yearsBack } = data;

    console.log("API HOUR", hour);

    const response = await api.get(
      `weather-probabilities?longitude=${lon}&latitude=${lat}&targetDate=${date.replaceAll(
        "-",
        ""
      )}&targetHour=${hour}&yearsBack=${yearsBack}`
    );
    return response.data;
  },
};
