import React from "react";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  Navigation,
} from "lucide-react";

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  windSpeed: Wind,
  pressure: Gauge,
  precipitation: CloudRain,
  solarRadiation: Sun,
  default: Navigation,
};

const colorMap = {
  temperature: "text-red-500 bg-red-50",
  humidity: "text-blue-500 bg-blue-50",
  windSpeed: "text-green-500 bg-green-50",
  pressure: "text-purple-500 bg-purple-50",
  precipitation: "text-cyan-500 bg-cyan-50",
  solarRadiation: "text-yellow-500 bg-yellow-50",
  default: "text-gray-500 bg-gray-50",
};

const WeatherCard = ({ label, value, type = "default", trend, subtitle }) => {
  const IconComponent = iconMap[type] || iconMap.default;
  const colorClass = colorMap[type] || colorMap.default;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}
        >
          <IconComponent size={24} />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend > 0
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
        )}
      </div>

        {/* <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity ${
          type === 'temperature' ? 'from-red-400 to-orange-400' :
          type === 'humidity' ? 'from-blue-400 to-cyan-400' :
          type === 'windSpeed' ? 'from-green-400 to-emerald-400' :
          'from-gray-400 to-blue-400'
        }`}></div> */}
    </div>
  );
};

export default WeatherCard;
