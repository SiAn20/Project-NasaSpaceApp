import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  Sun,
  MapPin,
  Sparkles,
  Mountain,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

const WeatherHome = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <Sun className="h-10 w-10 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
                <Cloud className="h-5 w-5 text-blue-400 absolute -bottom-1 -right-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  onClick={() => navigate("/")}
                >
                  ChocoSpace
                </h1>
                <p className="text-xs text-gray-600">NASA Space Apps 2025</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => navigate("/explorar")}
                className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1 group"
              >
                <MapPin
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Explorar</span>
              </a>
              <a
                href="#activities"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-1 group"
              >
                <Mountain
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Actividades</span>
              </a>
              <a
                href="#trends"
                className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center space-x-1 group"
              >
                <TrendingUp
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Tendencias</span>
              </a>
              <button
                onClick={() => navigate("/explorar")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <Sparkles size={18} />
                <span>Comenzar</span>
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg animate-slide-down">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#explore"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
              >
                🗺️ Explorar
              </a>
              <a
                href="#activities"
                className="block text-gray-700 hover:text-purple-600 transition-colors font-medium py-2"
              >
                ⛰️ Actividades
              </a>
              <a
                href="#trends"
                className="block text-gray-700 hover:text-pink-600 transition-colors font-medium py-2"
              >
                📈 Tendencias
              </a>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all">
                ✨ Comenzar
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default WeatherHome;
