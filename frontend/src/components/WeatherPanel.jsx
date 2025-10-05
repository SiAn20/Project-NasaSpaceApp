import React, { useState } from "react";
import { 
  MapPin, 
  Calendar, 
  Cloud, 
  TrendingUp,
  Download,
  Share2
} from "lucide-react";
import WeatherCard from "./WeatherCard";

const WeatherPanel = ({ data, onDateRangeChange }) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl mb-4">
          <MapPin size={48} className="text-blue-400 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Explora el Clima</h3>
        <p className="text-gray-600 max-w-sm">
          Selecciona una ubicación en el mapa para ver los datos meteorológicos detallados de la NASA
        </p>
      </div>
    );
  }

  const { location, dateRange, data: weatherData } = data;
  const { statistics, daily, metadata } = weatherData;

  // Función para formatear valores
  const formatValue = (value, units) => {
    if (value === -999 || value === '-999') return 'No disponible';
    return `${value} ${units}`;
  };

  // Calcular tendencias (simulado - en una app real vendría de la API)
  const calculateTrend = (current, previous) => {
    if (previous === 0 || current === -999 || previous === -999) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Datos Climáticos</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <MapPin size={16} />
              <span>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Share2 size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Download size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          {["overview", "daily", "stats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedTab === tab
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab === "overview" && "Resumen"}
              {tab === "daily" && "Diario"}
              {tab === "stats" && "Estadísticas"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* Cards principales */}
            <div className="grid grid-cols-2 gap-4">
              <WeatherCard
                label="Temperatura"
                value={formatValue(statistics.T2M.avg.toFixed(1), "°C")}
                type="temperature"
                trend={calculateTrend(statistics.T2M.avg, statistics.T2M.avg - 1)}
                subtitle={`Min: ${statistics.T2M.min}°C · Max: ${statistics.T2M.max}°C`}
              />
              <WeatherCard
                label="Humedad"
                value={formatValue(statistics.RH2M.avg.toFixed(1), "%")}
                type="humidity"
                trend={calculateTrend(statistics.RH2M.avg, statistics.RH2M.avg - 2)}
                subtitle={`Min: ${statistics.RH2M.min}% · Max: ${statistics.RH2M.max}%`}
              />
              <WeatherCard
                label="Viento"
                value={formatValue(statistics.WS10M.avg.toFixed(1), "m/s")}
                type="windSpeed"
                trend={calculateTrend(statistics.WS10M.avg, statistics.WS10M.avg - 0.5)}
                subtitle={`Min: ${statistics.WS10M.min} m/s · Max: ${statistics.WS10M.max} m/s`}
              />
              <WeatherCard
                label="Precipitación"
                value={formatValue(statistics.PRECTOTCORR.avg.toFixed(2), "mm/día")}
                type="precipitation"
                trend={calculateTrend(statistics.PRECTOTCORR.avg, statistics.PRECTOTCORR.avg - 0.1)}
                subtitle={`Min: ${statistics.PRECTOTCORR.min} mm · Max: ${statistics.PRECTOTCORR.max} mm`}
              />
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Cloud className="text-blue-500" size={20} />
                <div>
                  <p className="font-semibold text-blue-800">Fuente de datos</p>
                  <p className="text-sm text-blue-600">{metadata.source}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "daily" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Datos Diarios</h3>
            {daily.map((day, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-gray-800">{day.date}</p>
                  <span className="text-sm text-gray-500">
                    {formatValue(day.temperature, "°C")}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-600">Precip.</p>
                    <p className="font-semibold">{formatValue(day.precipitation, "mm")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Humedad</p>
                    <p className="font-semibold">{formatValue(day.humidity, "%")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Viento</p>
                    <p className="font-semibold">{formatValue(day.windSpeed, "m/s")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Radiación</p>
                    <p className="font-semibold">{formatValue(day.solarRadiation, "kW-hr")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === "stats" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Estadísticas Detalladas</h3>
            {Object.entries(statistics).map(([key, stats]) => {
              const paramName = key === 'PRECTOTCORR' ? 'Precipitación' :
                              key === 'T2M' ? 'Temperatura' :
                              key === 'RH2M' ? 'Humedad' :
                              key === 'WS10M' ? 'Velocidad del Viento' :
                              key === 'PS' ? 'Presión' : 'Radiación Solar';
              
              return (
                <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-800 mb-3">{paramName}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Mínimo</p>
                      <p className="font-semibold text-blue-600">{stats.min}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Promedio</p>
                      <p className="font-semibold text-green-600">{stats.avg.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Máximo</p>
                      <p className="font-semibold text-red-600">{stats.max}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPanel;