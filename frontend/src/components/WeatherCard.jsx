import React from "react";

const WeatherCard = ({ label, value }) => (
  <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-xl font-semibold text-blue-600">{value}</p>
  </div>
);

export default WeatherCard;
