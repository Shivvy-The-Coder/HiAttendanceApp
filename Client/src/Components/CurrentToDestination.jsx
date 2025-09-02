import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

const CurrentToDestination = ({
  onSearch,
  currentLocation,
  destination,
  setDestination,
  countryCode = "IN", // restrict to your country (default: India)
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(false);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  // Fetch location suggestions from Nominatim
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (destination.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=${countryCode}&limit=5&q=${destination}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delayDebounce);
  }, [destination, countryCode]);

  const handleSelect = (place) => {
    setDestination(place.display_name);
    setSuggestions([]);
  };

  const handleCheckLocation = () => {
    // for now, just mark as matched
    setMatched(true);
    setAttendanceSubmitted(false);
  };

  const handleConfirmAttendance = () => {
    setAttendanceSubmitted(true);
    setMatched(false);
  };

  return (
    <div className="bg-white max-w-md mx-auto rounded-2xl p-6 space-y-4 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 text-center">
        Mark Your Attendance
      </h2>

      <div className="flex flex-col space-y-3">
        {/* Current Location */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
          <FaLocationArrow className="text-green-500 text-xl" />
          <input
            type="text"
            value={currentLocation || "Fetching current location..."}
            readOnly
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Destination */}
        <div className="relative">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
            <FaMapMarkerAlt className="text-red-500 text-xl" />
            <span>Location Z</span>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white shadow-lg rounded-xl mt-1 max-h-48 overflow-y-auto z-50">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Check Location Button */}
      <button
        onClick={handleCheckLocation}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md"
      >
        Check Matched Location
      </button>

      {/* Popup for matched location */}
      {matched && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-xl mt-3 text-center space-y-3">
          <p className="font-medium">✅ Location matched</p>
          <button
            onClick={handleConfirmAttendance}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Confirm Attendance
          </button>
        </div>
      )}

      {/* Attendance Submitted message */}
      {attendanceSubmitted && (
        <div className="bg-green-500 text-white px-4 py-3 rounded-xl mt-3 text-center font-semibold">
          🎉 Attendance Submitted
        </div>
      )}
    </div>
  );
};

export default CurrentToDestination;
