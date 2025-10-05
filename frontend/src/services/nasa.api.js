import { api } from "./api";

export const nasaAPI = {
  getWeatherDaily: async (data) => {
    const { lat, lon, dateRange } = data;
    const response = await api.get(
      `http://127.0.0.1:4000/api/nasa/weather-data?longitude=${lon}&latitude=${lat}&startDate=${dateRange.start.replaceAll(
        "-",
        ""
      )}&endDate=${dateRange.end.replaceAll("-", "")}`
    );
    return response.data;
  },

  getWeatherHours: async (data) => {
    const { lat, lon, dateRange } = data;
    const response = await api.get(
      `http://127.0.0.1:4000/api/nasa/weather-data/hourly?longitude=${lon}&latitude=${lat}&startDate=${dateRange.start.replaceAll(
        "-",
        ""
      )}&endDate=${dateRange.end.replaceAll("-", "")}`
    );
    return response.data;
  },
};
