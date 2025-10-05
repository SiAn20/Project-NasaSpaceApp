import { useQuery } from "@tanstack/react-query";
import { nasaAPI } from "../services/api";

const useWeatherHoursProbabilities = ({
  selectedLocation,
  tarjetDate,
  tarjetHour,
  yearsBack,
  mode,
  withTime,
}) => {
  return useQuery({
    queryKey: [
      "weatherHoursProbabilities",
      selectedLocation,
      tarjetDate,
      tarjetHour,
      yearsBack,
    ],
    queryFn: async () => {
      if (!selectedLocation) return null;
      try {
        return await nasaAPI.getWeatherHoursProbabilities({
          lat: selectedLocation[0],
          lon: selectedLocation[1],
          date: tarjetDate,
          hour: tarjetHour.substring(0, 2),
          yearsBack: yearsBack || 10,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    },
    enabled: !!selectedLocation && mode !== "historical" && withTime,
    refetchOnWindowFocus: false,
  });
};

export default useWeatherHoursProbabilities;
