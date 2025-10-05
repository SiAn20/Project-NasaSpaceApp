import React, { useState } from "react";
import {
  Cloud,
  Sun,
  Droplets,
  Wind,
  MapPin,
  Calendar,
  Search,
  Sparkles,
  Umbrella,
  Thermometer,
} from "lucide-react";
import Navbar from "../components/navbar";
import { World } from "../components/world";

const WeatherHome = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  const FloatingIcon = ({ icon: Icon, delay, duration, x, y }) => (
    <div
      className="absolute opacity-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <Icon size={40} className="text-blue-400" />
    </div>
  );

  return (
    <div className="min-h-scree from-blue-50 via-purple-50 to-pink-50">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        .animate-slide-down { animation: slideDown 0.5s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <Navbar />
      <World />

      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <FloatingIcon icon={Cloud} delay={0} duration={4} x={10} y={20} />
        <FloatingIcon icon={Sun} delay={1} duration={5} x={85} y={15} />
        <FloatingIcon
          icon={Droplets}
          delay={0.5}
          duration={4.5}
          x={15}
          y={70}
        />
        <FloatingIcon icon={Wind} delay={1.5} duration={4} x={80} y={65} />
        <FloatingIcon icon={Umbrella} delay={0.8} duration={5.5} x={5} y={45} />
        <FloatingIcon
          icon={Thermometer}
          delay={1.2}
          duration={4.8}
          x={90}
          y={40}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-sm font-medium">
                Powered by NASA Earth Data
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Planifica tu aventura
              <br />
              con confianza
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Descubre la probabilidad de condiciones climáticas perfectas para
              tu próxima salida al aire libre
            </p>

            <div
              className={`max-w-3xl mx-auto transition-all duration-300 ${
                searchFocused ? "scale-105" : ""
              }`}
            >
              <div
                className={`bg-white rounded-full shadow-2xl p-2 flex items-center space-x-4 ${
                  searchFocused ? "animate-pulse-glow" : ""
                }`}
              >
                <div className="flex-1 flex items-center space-x-3 pl-4">
                  <MapPin className="text-blue-500" size={24} />
                  <input
                    type="text"
                    placeholder="¿Dónde quieres ir? Ej: Cochabamba, Bolivia"
                    className="w-full outline-none text-lg"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
                <div className="flex items-center space-x-3 pr-2">
                  <div className="h-8 w-px bg-gray-300"></div>
                  <Calendar className="text-purple-500" size={24} />
                  <input
                    type="text"
                    placeholder="¿Cuándo?"
                    className="w-32 outline-none"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300">
                    <Search size={24} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                💡 O prueba: "¿Puedo hacer trekking en Tunari en julio?"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">40+</div>
              <div className="text-gray-600">Años de datos NASA</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-bold text-purple-600 mb-1">12</div>
              <div className="text-gray-600">Variables climáticas</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-pink-600 mb-1">95%</div>
              <div className="text-gray-600">Precisión histórica</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Actividades Populares
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Selecciona tu actividad y descubre el mejor momento para disfrutarla
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              icon: "🏔️",
              name: "Trekking",
              color: "from-green-400 to-emerald-600",
            },
            { icon: "🎣", name: "Pesca", color: "from-blue-400 to-cyan-600" },
            {
              icon: "🏖️",
              name: "Playa",
              color: "from-yellow-400 to-orange-600",
            },
            { icon: "⛷️", name: "Ski", color: "from-cyan-400 to-blue-600" },
            {
              icon: "🚴",
              name: "Ciclismo",
              color: "from-purple-400 to-pink-600",
            },
            {
              icon: "🏕️",
              name: "Camping",
              color: "from-orange-400 to-red-600",
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 0.1}s` }}
              className="animate-fade-in-up bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`text-5xl mb-3 group-hover:scale-125 transition-transform duration-300`}
              >
                {activity.icon}
              </div>
              <div
                className={`text-lg font-semibold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`}
              >
                {activity.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10">
              <Sun
                size={60}
                className="animate-spin"
                style={{ animationDuration: "20s" }}
              />
            </div>
            <div className="absolute bottom-10 right-10">
              <Cloud size={50} />
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para planear tu próxima aventura?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Obtén insights precisos basados en décadas de datos de la NASA
            </p>
            <button className="bg-background text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-110 transition-all duration-300 inline-flex items-center space-x-2">
              <Sparkles size={24} />
              <span>Comenzar Ahora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHome;
