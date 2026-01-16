import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { CheckCircle, XCircle } from "lucide-react";

const AttendanceApp = () => {
  const [position, setPosition] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [showInfo, setShowInfo] = useState(false);


  

// Address
// Samlong, Ranchi, 834001, Jharkhand, India

// DD (decimal degrees)
// Latitude	
// 23.3504768  23.355639517775323 <- ACM office Lats
// Longitude	
// 85.344256   85.35911217785096 <-- ACM Office Longs



  // Workplace info
  const workplaceLocation = { lat:  23.3589633, lng:85.3510857};
  const allowedRadius = 200;

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC0sh_hZ2j-y_0JmzS58NvFFqp8FXILns8",
  });

  // Track location
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) =>
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.warn("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Distance calculator
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const isWithinWorkplace =
    position &&
    calculateDistance(
      position.lat,
      position.lng,
      workplaceLocation.lat,
      workplaceLocation.lng
    ) <= allowedRadius;

  // Example: retrieve from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

const handleCheckIn = async () => {
  if (isWithinWorkplace && user) {
    try {
      const res = await fetch("http://localhost:5000/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: user.mobile, // match DB column
          name: user.name,
        }),
      });

      const data = await res.json();
      console.log("✅ Check-in:", data);

      setIsCheckedIn(true);

      // Combine date and loginTime from DB to create a Date object
      const loginDateTime = new Date(`${data.date} ${data.loginTime}`);
      setCheckInTime(loginDateTime); // display in your UI
    } catch (err) {
      console.error("❌ Check-in error:", err);
    }
  }
};

const handleCheckOut = async () => {
  if (isCheckedIn && user) {
    try {
      const res = await fetch("http://localhost:5000/attendance/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: user.mobile, // same as check-in
        }),
      });

      const data = await res.json();
      console.log("✅ Check-out:", data);

      setIsCheckedIn(false);
      setCheckInTime(null);
    } catch (err) {
      console.error("❌ Check-out error:", err);
    }
  }
};


  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-blue-100">
      <div className="px-6 py-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Status */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
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

          {/* Location Status */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
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
                    position.lat,
                    position.lng,
                    workplaceLocation.lat,
                    workplaceLocation.lng
                  )
                )}
                m from office
              </p>
            )}
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Location Map
          </h3>
          <GoogleMap
            center={position || workplaceLocation}
            zoom={15}
            mapContainerClassName="h-80 w-full rounded-lg"
          >
            {/* Workplace marker */}
            <Marker position={workplaceLocation} />

            <Circle
              center={workplaceLocation}
              radius={allowedRadius}
              options={{
                fillColor: isWithinWorkplace ? "#10B981" : "#F59E0B",
                fillOpacity: 0.2,
                strokeColor: isWithinWorkplace ? "#10B981" : "#F59E0B",
                strokeWeight: 2,
              }}
            />

            {/* User marker */}
            {position && (
              <>
                <Marker
                  position={position}
                  onClick={() => setShowInfo(true)}
                />
                {showInfo && (
                  <InfoWindow
                    position={position}
                    onCloseClick={() => setShowInfo(false)}
                  >
                    <div>
                      <strong>Your Location</strong>
                      <p className="text-sm text-gray-600">Current position</p>
                    </div>
                  </InfoWindow>
                )}
              </>
            )}
          </GoogleMap>
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
              You need to be within {allowedRadius}m of your workplace to check
              in
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceApp;
