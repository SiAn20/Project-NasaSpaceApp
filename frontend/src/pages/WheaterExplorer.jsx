import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import MapView from "../components/mapView";
import WeatherPanel from "../components/weatherPanel";

const WeatherExplorer = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:4000/api/nasa/weather-data?longitude=${lon}&latitude=${lat}&startDate=20250925&endDate=20251001`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation([latlng.lat, latlng.lng]);
    fetchWeatherData(latlng.lat, latlng.lng);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-2/3 p-6">
        <MapView
          onLocationSelect={handleLocationSelect}
          position={selectedLocation}
        />
      </div>

      <div className="w-1/3 bg-white rounded-l-3xl shadow-2xl">
        {loading ? <Loader /> : <WeatherPanel data={weatherData} />}
      </div>
    </div>
  );
};

export default WeatherExplorer;
