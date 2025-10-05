import React, { useState, useCallback, useEffect } from "react";
import { Satellite, MapPin, Calendar, RefreshCw } from "lucide-react";
import MapView from "../components/MapView";
import WeatherPanel from "../components/WeatherPanel";
import Loader from "../components/Loader";
import useWeatherDaily from "../hooks/useWeatherDaily";
import useWeatherHours from "../hooks/useWeatherHours";

const WeatherExplorer = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: "2025-09-25",
    end: "2025-10-01",
  });

  const {
    data: weatherData,
    isFetching: loading,
    refetch,
  } = useWeatherDaily({ selectedLocation, dateRange });

  const {
    data: weatherDataHourly,
    isFetching: loadingHourly,
    refetch: refetchHourly,
  } = useWeatherHours({ selectedLocation, dateRange });

  useEffect(() => {
    if (selectedLocation) {
      refetch();
      refetchHourly();
    }
  }, [dateRange, selectedLocation, refetch, refetchHourly]);

  const handleLocationSelect = useCallback((latlng) => {
    setSelectedLocation([latlng.lat, latlng.lng]);
  }, []);

  const handleRefresh = () => {
    if (selectedLocation) refetch();
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="pt-20 flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="z-50 flex-1 relative px-6">
        <div className="absolute top-8 left-20 z-[1000] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 w-80">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <Satellite className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Explorador Climático NASA
              </h1>
              <p className="text-sm text-gray-600">
                Datos extraídos de la NASA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3 text-sm">
            <Calendar size={16} />
            <div className="flex flex-col w-full">
              <label className="text-xs text-gray-500">Fecha inicio</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="border border-gray-300 rounded-lg p-1 text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-xs text-gray-500">Fecha fin</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="border border-gray-300 rounded-lg p-1 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            {selectedLocation ? (
              <>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span>
                    {selectedLocation[0].toFixed(4)},{" "}
                    {selectedLocation[1].toFixed(4)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Actualizar datos"
                  >
                    <RefreshCw
                      size={16}
                      className={loading ? "animate-spin" : ""}
                    />
                  </button>
                  <button
                    onClick={handleClearLocation}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Limpiar ubicación"
                  >
                    <MapPin size={16} />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                Haz click en el mapa para seleccionar una ubicación
              </p>
            )}
          </div>
        </div>

        <div className="h-full z-100">
          <MapView
            onLocationSelect={handleLocationSelect}
            position={selectedLocation}
          />
        </div>
      </div>

      <div className="w-96 xl:w-[480px] bg-white rounded-l-3xl shadow-2xl border-l border-gray-200 z-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <WeatherPanel
            dataDaily={weatherData}
            dataHourly={weatherDataHourly}
            onDateRangeChange={setDateRange}
          />
        )}
      </div>
    </div>
  );
};

export default WeatherExplorer;
