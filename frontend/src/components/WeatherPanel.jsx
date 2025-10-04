import React from "react";
import WeatherCard from "./WeatherCard";

const WeatherPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Selecciona una ubicación en el mapa para ver los datos.
      </div>
    );
  }

  const { location, data: weatherData } = data;
  const stats = weatherData.statistics;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h2 className="text-2xl font-bold text-blue-600">
          Coordenadas seleccionadas
        </h2>
        <p className="text-gray-600">
          Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <WeatherCard
          label="Temperatura Promedio"
          value={`${stats.T2M.avg.toFixed(1)} °C`}
        />
        <WeatherCard
          label="Humedad Promedio"
          value={`${stats.RH2M.avg.toFixed(1)} %`}
        />
        <WeatherCard
          label="Viento Promedio"
          value={`${stats.WS10M.avg.toFixed(1)} m/s`}
        />
        <WeatherCard
          label="Precipitación Promedio"
          value={`${stats.PRECTOTCORR.avg.toFixed(2)} mm/día`}
        />
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Fuente de datos
        </h3>
        <p className="text-sm text-gray-500">
          {weatherData.metadata.source}  
        </p>
      </div>
    </div>
  );
};

export default WeatherPanel;
