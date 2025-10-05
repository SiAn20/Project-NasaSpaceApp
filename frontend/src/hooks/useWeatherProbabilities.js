import { useQuery } from "@tanstack/react-query";
import { nasaAPI } from "../services/api";

const useWeatherProbabilities = ({
  selectedLocation,
  tarjetDate,
  yearsBack,
  mode,
  withTime,
}) => {
  console.log("Con tiemopi", withTime);

  return useQuery({
    queryKey: ["weatherProbabilities", selectedLocation, tarjetDate, yearsBack],
    queryFn: async () => {
      if (!selectedLocation) return null;
      try {
        return await nasaAPI.getWeatherProbabilities({
          lat: selectedLocation[0],
          lon: selectedLocation[1],
          date: tarjetDate,
          yearsBack: yearsBack || 10,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    },
    enabled: !!selectedLocation && mode !== "historical" && !withTime,
    refetchOnWindowFocus: false,
  });
};

export default useWeatherProbabilities;
