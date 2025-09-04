import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Clock, MapPin, Bell, CheckCircle, XCircle, Navigation } from "lucide-react";

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const currentLocationIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzQjgyRjYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const workplaceIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRUY0NDQ0Ii8+Cjwvc3ZnPg==",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Component to recenter map
function RecenterMap({ position, workplace }) {
  const map = useMap();
  useEffect(() => {
    if (position && workplace) {
      const bounds = L.latLngBounds([position, workplace]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (position) {
      map.setView(position, 16);
    }
  }, [position, workplace, map]);
  return null;
}

const AttendanceApp = () => {
  const [position, setPosition] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [ setCurrentTime] = useState(new Date());

  // Workplace info
  const workplaceLocation = [23.355639517775323, 85.35911217785096];
  const workplaceName = "Artificial Computing Machines, STPI, Ranchi";
  const allowedRadius = 200;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const isWithinWorkplace =
    position &&
    calculateDistance(
      position[0],
      position[1],
      workplaceLocation[0],
      workplaceLocation[1]
    ) <= allowedRadius;

  const handleCheckIn = () => {
    if (isWithinWorkplace) {
      setIsCheckedIn(true);
      setCheckInTime(new Date());
    }
  };

  const handleCheckOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-blue-100">
      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Status */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Status
                </h3>
                <p
                  className={`text-sm font-medium ${
                    isCheckedIn ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isCheckedIn ? "Checked In" : "Not Checked In"}
                </p>
                {isCheckedIn && checkInTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Since {formatTime(checkInTime)}
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-full ${
                  isCheckedIn ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {isCheckedIn ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Location Status */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Location Status
                </h3>
                <p
                  className={`text-sm font-medium ${
                    isWithinWorkplace ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {position
                    ? isWithinWorkplace
                      ? "At Workplace"
                      : "Outside Workplace"
                    : "Locating..."}
                </p>
                {position && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(
                      calculateDistance(
                        position[0],
                        position[1],
                        workplaceLocation[0],
                        workplaceLocation[1]
                      )
                    )}
                    m from office
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-full ${
                  isWithinWorkplace ? "bg-green-100" : "bg-orange-100"
                }`}
              >
                <Navigation
                  className={`w-6 h-6 ${
                    isWithinWorkplace ? "text-green-600" : "text-orange-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Location Map
          </h3>
          <div className="relative">
            <MapContainer
              center={position || workplaceLocation}
              zoom={15}
              className="h-80 w-full rounded-lg"
              scrollWheelZoom
              zoomControl
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={workplaceLocation} icon={workplaceIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>{workplaceName}</strong>
                    <p className="text-sm text-gray-600">
                      Your assigned workplace
                    </p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={workplaceLocation}
                radius={allowedRadius}
                pathOptions={{
                  fillColor: isWithinWorkplace ? "#10B981" : "#F59E0B",
                  fillOpacity: 0.1,
                  color: isWithinWorkplace ? "#10B981" : "#F59E0B",
                  weight: 2,
                }}
              />
              {position && (
                <Marker position={position} icon={currentLocationIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>Your Location</strong>
                      <p className="text-sm text-gray-600">Current position</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              <RecenterMap
                position={position}
                workplace={workplaceLocation}
              />
            </MapContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCheckIn}
              disabled={!isWithinWorkplace || isCheckedIn}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                !isWithinWorkplace || isCheckedIn
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Mark Attendance In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!isCheckedIn}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                !isCheckedIn
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <XCircle className="w-5 h-5 inline mr-2" />
              Mark Attendance Out
            </button>
          </div>
          {!isWithinWorkplace && position && (
            <p className="text-sm text-orange-600 mt-4 text-center">
              You need to be within {allowedRadius}m of your workplace to check in
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceApp;
