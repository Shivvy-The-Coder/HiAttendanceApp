// import React, { useState } from "react";
import NavbarWithSidebar from "../Components/NavbarWithSidebar";
import LeafletMap from "../Components/MapComponent";
const Home = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Navbar fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto bg-black shadow-md">
        <div className="max-w-md mx-auto">
          <NavbarWithSidebar />
        </div>
      </div>

      {/* Content below navbar → add padding-top equal to navbar height */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto pt-20">
        <div>
          <LeafletMap />
        </div>
      </div>
    </div>
  );
};

export default Home;
