import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Mantiene los clics activos
const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      console.log("Map clicked:", e.latlng);
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

// Recentrar mapa sin recrearlo
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 10);
    }
  }, [position, map]);
  return null;
};

const MapView = ({ onLocationSelect, position, className = "" }) => {
  const defaultCenter = [-17.3846428, -66.3221252];

  return (
    <div className={`w-full h-full ${className}`}>
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 10 : 4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        zoomControl={true}
        tap={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        closePopupOnClick={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & NASA'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <Marker position={position} icon={customIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Ubicación seleccionada</p>
                <p className="text-sm text-gray-600">
                  Lat: {position[0].toFixed(4)}<br />
                  Lon: {position[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        <MapEvents onLocationSelect={onLocationSelect} />
        <RecenterMap position={position} />
      </MapContainer>
    </div>
  );
};

export default MapView;
