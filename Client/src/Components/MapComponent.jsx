import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Replace with your desired icon
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Component to recenter map when location changes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15); // Zoom in on user's location
    }
  }, [position, map]);
  return null;
}

const LeafletMap = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Geolocation permission denied or unavailable", err);
          alert("Please allow location access for better experience.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="relative z-0">
      <MapContainer
        center={position || [28.6139, 77.209]} // Fallback to default location (Delhi)
        zoom={14}
        className="h-[40vh] w-full rounded-[12px] z-0"
        scrollWheelZoom={true} // enable scroll zoom
        zoomControl={true} // enable zoom buttons
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>'
        />
        {position && (
          <Marker position={position} icon={currentLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        <RecenterMap position={position} />
      </MapContainer>

    </div>
  );
};

export default LeafletMap;
