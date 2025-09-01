import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Only update if coordinates changed significantly (avoid unnecessary API calls)
          setCoordinates((prev) => {
            if (!prev || prev.latitude !== latitude || prev.longitude !== longitude) {
              return { latitude, longitude };
            }
            return prev;
          });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setCurrentLocation(data.display_name || "Unknown location");
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setCurrentLocation("Unable to fetch address");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation("Location access denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 8000, // Prevents infinite loading
          maximumAge: 10000, // Uses cached location if recent
        }
      );

      // Cleanup watcher when component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        destination,
        setDestination,
        coordinates,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocationContext = () => useContext(LocationContext);
