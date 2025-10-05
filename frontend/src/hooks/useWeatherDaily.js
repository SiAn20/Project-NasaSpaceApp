import React from "react";
import { useQuery } from "@tanstack/react-query";
import { nasaAPI } from "../services/api";

const useWeatherDaily = ({ selectedLocation, dateRange, mode }) => {
  return useQuery({
    queryKey: ["weatherData", selectedLocation, dateRange],
    queryFn: async () => {
      if (!selectedLocation) return null;
      try {
        return await nasaAPI.getWeatherDaily({
          lat: selectedLocation[0],
          lon: selectedLocation[1],
          dateRange,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    },
    enabled: !!selectedLocation && mode === "historical",
    refetchOnWindowFocus: false,
  });
};

export default useWeatherDaily;
