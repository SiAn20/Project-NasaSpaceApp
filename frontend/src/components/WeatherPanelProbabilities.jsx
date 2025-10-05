import React, { useState } from "react";
import { MapPin, Cloud, Download, Share2 } from "lucide-react";
import WeatherCard from "./WeatherCard";

const WeatherPanelProbabilities = ({ dataProbabilities }) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  if (!dataProbabilities) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl mb-4">
          <MapPin size={48} className="text-blue-400 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Explora Probabilidades Climáticas
        </h3>
        <p className="text-gray-600 max-w-sm">
          Selecciona una ubicación en el mapa para ver las probabilidades
          meteorológicas detalladas
        </p>
      </div>
    );
  }

  const { location, targetDate, analysis } = dataProbabilities;
  const {
    probabilities,
    expectedValues,
    discomfortAnalysis,
    historicalSample,
  } = analysis;

  const friendlyLabels = {
    veryHot: "Muy caluroso",
    veryCold: "Muy frío",
    veryWindy: "Muy ventoso",
    veryHumid: "Muy húmedo",
    veryUncomfortable: "Muy incómodo",
  };

  const formatValue = (value, unit) =>
    value !== undefined ? `${value}${unit ? " " + unit : ""}` : "No disponible";

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Probabilidades Climáticas
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <MapPin size={16} />
              <span>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Fecha objetivo: {targetDate}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          {["overview", "hourly"].map((tab) => (
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
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {selectedTab === "overview" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Probabilidades de condiciones
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(probabilities).map(([key, prob]) => {
                return (
                  <WeatherCard
                    key={key}
                    label={friendlyLabels[key]}
                    value={`${prob.probability}%`}
                    subtitle={`${prob.description}`}
                    type="probability"
                  />
                );
              })}
            </div>

            <h3 className="font-semibold text-gray-800 mt-6 mb-4">
              Valores esperados
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(expectedValues).map(([key, val]) => (
                <WeatherCard
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formatValue(val.average, val.unit)}
                  subtitle={`Min: ${val.min} · Max: ${val.max}`}
                  type="expected"
                />
              ))}
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mt-6">
              <div className="flex items-center space-x-3">
                <Cloud className="text-blue-500" size={20} />
                <div>
                  <p className="font-semibold text-blue-800">
                    Análisis de comodidad
                  </p>
                  <p className="text-sm text-blue-600">
                    {discomfortAnalysis.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mt-6">
              <p className="text-sm text-blue-600">
                Muestra histórica: {historicalSample.yearRange}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPanelProbabilities;
