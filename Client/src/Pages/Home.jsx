import React, { useState } from "react";
import NavbarWithSidebar from "../Components/NavbarWithSidebar";
import CurrentToDestination from "../Components/CurrentToDestination";
import LeafletMap from "../Components/MapComponent";
import RideBookingSummary from "../Components/RideBookingSummary";
import { useLocationContext } from "../context/LocationContext";

const Home = () => {
  const [showSummary, setShowSummary] = useState(false);
  const { currentLocation, destination, setDestination } = useLocationContext();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Navbar fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
        <div className="max-w-md mx-auto">
          <NavbarWithSidebar />
        </div>
      </div>

      {/* Content below navbar → add padding-top equal to navbar height */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto pt-20">
        <div>
          <LeafletMap />
        </div>
        <div className="w-full max-w-md mx-auto py-4">
          {!showSummary ? (
            <CurrentToDestination
              onSearch={() => setShowSummary(true)}
              currentLocation={currentLocation}
              destination={destination}
              setDestination={setDestination}
            />
          ) : (
            <RideBookingSummary />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
