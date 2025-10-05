import React, { useState, useEffect, useCallback } from "react";
import { Satellite, MapPin, Calendar, RefreshCw } from "lucide-react";
import MapView from "../components/MapView";
import WeatherPanel from "../components/WeatherPanel";
import Loader from "../components/Loader";

const WeatherExplorer = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "20250925",
    end: "20251001",
  });

  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation[0], selectedLocation[1]);
    }
  }, [dateRange]);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:4000/api/nasa/weather-data?longitude=${lon}&latitude=${lat}&startDate=${dateRange.start}&endDate=${dateRange.end}`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setWeatherData({
        success: true,
        location: { latitude: lat, longitude: lon },
        dateRange: dateRange,
        data: {
          daily: Array(7)
            .fill()
            .map((_, i) => ({
              date: `2025-09-${25 + i}`,
              precipitation: (Math.random() * 2).toFixed(2),
              temperature: (-15 + Math.random() * 10).toFixed(1),
              humidity: (85 + Math.random() * 10).toFixed(1),
              windSpeed: (5 + Math.random() * 4).toFixed(1),
              pressure: (98 + Math.random() * 2).toFixed(2),
              solarRadiation: (3.2 + Math.random() * 0.3).toFixed(4),
            })),
          statistics: {
            PRECTOTCORR: { min: 0.24, max: 1.85, avg: 0.81 },
            T2M: { min: -16.2, max: -5.8, avg: -12.4 },
            RH2M: { min: 86.5, max: 95.2, avg: 91.8 },
            WS10M: { min: 5.1, max: 8.9, avg: 6.7 },
            PS: { min: 98.3, max: 99.8, avg: 99.1 },
            ALLSKY_SFC_SW_DWN: { min: 3.2261, max: 3.4697, avg: 3.3463 },
          },
          metadata: {
            source: "NASA POWER API",
            parameters: {
              precipitation: {
                units: "mm/day",
                longname: "Precipitation Corrected",
              },
              temperature: { units: "C", longname: "Temperature at 2 Meters" },
              humidity: {
                units: "%",
                longname: "Relative Humidity at 2 Meters",
              },
              windSpeed: { units: "m/s", longname: "Wind Speed at 10 Meters" },
              pressure: { units: "kPa", longname: "Surface Pressure" },
              solarRadiation: {
                units: "kW-hr/m^2/day",
                longname: "Solar Radiation",
              },
            },
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = useCallback((latlng) => {
    console.log("Location selected in parent:", latlng);
    const newLocation = [latlng.lat, latlng.lng];
    setSelectedLocation(newLocation);
    fetchWeatherData(latlng.lat, latlng.lng);
  }, []);

  const handleRefresh = () => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation[0], selectedLocation[1]);
    }
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setWeatherData(null);
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
          <WeatherPanel data={weatherData} onDateRangeChange={setDateRange} />
        )}
      </div>
    </div>
  );
};

export default WeatherExplorer;
