import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Play,
  BarChart3,
  Satellite,
} from "lucide-react";
import SplineScene from "../components/SplineScene";

const WeatherHome = () => {
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const FloatingIcon = ({ icon: Icon, delay, duration, x, y, size = 40 }) => (
    <div
      className="absolute opacity-15 hover:opacity-30 transition-opacity duration-300 cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <Icon size={size} className="text-blue-400" />
    </div>
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      navigate("/explorar", { 
        state: { 
          location: location.trim(),
          date: date.trim()
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-15px) rotate(2deg) scale(1.05); }
          66% { transform: translateY(-8px) rotate(-1deg) scale(1.02); }
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
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
                       0 0 40px rgba(147, 51, 234, 0.2); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5),
                       0 0 60px rgba(147, 51, 234, 0.3); 
          }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-slide-down { animation: slideDown 0.5s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      <FloatingIcon icon={Cloud} delay={0} duration={6} x={8} y={15} size={48} />
      <FloatingIcon icon={Sun} delay={2} duration={7} x={88} y={12} size={52} />
      <FloatingIcon icon={Droplets} delay={1} duration={5.5} x={12} y={75} size={44} />
      <FloatingIcon icon={Wind} delay={1.8} duration={6.2} x={75} y={73} size={42} />
      <FloatingIcon icon={Umbrella} delay={0.7} duration={5.8} x={5} y={50} size={46} />
      <FloatingIcon icon={Thermometer} delay={1.4} duration={6.5} x={92} y={45} size={44} />
      <FloatingIcon icon={Satellite} delay={2.2} duration={7} x={15} y={25} size={38} />
      <FloatingIcon icon={BarChart3} delay={0.9} duration={6.8} x={85} y={80} size={40} />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5 animate-gradient-shift" />

      <div className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="ml-20 animate-fade-in-up text-center lg:text-left space-y-8">
              <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-6 py-3 rounded-full mb-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-base font-semibold">
                  Powered by NASA Earth Data & Satellite Analytics
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
                    Planifica tu aventura
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    con confianza
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-normal">
                  Planifica tu evento al aire libre con 
                  <span className="font-semibold text-blue-600"> datos climáticos históricos </span>
                  de la NASA. Evita sorpresas y disfruta con confianza.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Precisión 95%</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">40+ Años de datos</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Cobertura global</span>
                </div>
              </div>
            </div>

            <div className="relative ml-16">
              <div className="relative z-20">
                <SplineScene />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16">
            <form onSubmit={handleSearch}>
              <div
                className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-3 flex items-center space-x-4 border border-gray-200/60 transition-all duration-500 ${
                  searchFocused ? "scale-[1.02] animate-pulse-glow" : "hover:scale-[1.01]"
                }`}
              >
                <div className="flex-1 flex items-center space-x-4 pl-6">
                  <MapPin className="text-blue-500 flex-shrink-0" size={28} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="¿Dónde es tu evento? Ej: Parque Central, Ciudad..."
                    className="w-full outline-none text-lg bg-transparent placeholder-gray-400 py-4"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
                
                <div className="flex items-center space-x-4 pr-2">
                  <div className="h-12 w-px bg-gray-300/60"></div>
                  <Calendar className="text-purple-500 flex-shrink-0" size={28} />
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Fecha del evento"
                    className="w-40 outline-none bg-transparent placeholder-gray-400 py-4"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center space-x-2 font-semibold"
                  >
                    <Search size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:block">Analizar Clima</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <p className="text-sm text-gray-500 flex items-center space-x-2">
                <span>💡</span>
                <span>Prueba: "¿Lloverá en el desfile del 25 de Mayo en Cochabamba - Bolivia?"</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { icon: "🌍", value: "40+", label: "Años de datos NASA", color: "blue" },
              { icon: "📊", value: "12", label: "Variables climáticas", color: "purple" },
              { icon: "⚡", value: "95%", label: "Precisión histórica", color: "pink" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer group border border-gray-200/50"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className={`text-4xl font-black text-${stat.color}-600 mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-0 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Eventos y Actividades
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Descubre el clima perfecto para cualquier ocasión al aire libre
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 z-0">
          {[
            { icon: "🎉", name: "Desfiles", color: "from-purple-400 to-pink-600" },
            { icon: "💒", name: "Bodas", color: "from-pink-400 to-rose-600" },
            { icon: "🏔️", name: "Trekking", color: "from-green-400 to-emerald-600" },
            { icon: "🎣", name: "Pesca", color: "from-blue-400 to-cyan-600" },
            { icon: "🏖️", name: "Playa", color: "from-yellow-400 to-orange-600" },
            { icon: "🚴", name: "Ciclismo", color: "from-orange-400 to-red-600" },
          ].map((activity, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 0.1}s` }}
              className="animate-fade-in-up bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 cursor-pointer group border border-gray-200/50"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                {activity.icon}
              </div>
              <div className={`text-lg font-black bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`}>
                {activity.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4">
              <Sun size={80} className="animate-spin" style={{ animationDuration: "25s" }} />
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <Cloud size={70} className="animate-float" style={{ animationDuration: "8s" }} />
            </div>
            <div className="absolute top-1/3 right-1/3">
              <Droplets size={60} className="animate-float" style={{ animationDuration: "6s", animationDelay: "1s" }} />
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl font-black mb-4 leading-tight">
              ¿Planificando tu próximo<br />
              <span className="text-yellow-300">evento importante?</span>
            </h2>
            
            <p className="text-2xl mb-8 opacity-95 font-medium max-w-2xl mx-auto leading-relaxed">
              No dejes que el clima arruine tus planes. Obtén predicciones 
              basadas en décadas de datos científicos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/explorar")}
                className="bg-white text-purple-600 px-10 py-5 rounded-2xl text-xl font-black hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center space-x-3 group"
              >
                <Sparkles size={28} className="group-hover:scale-110 transition-transform" />
                <span>Comenzar Ahora</span>
                <Play size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHome;