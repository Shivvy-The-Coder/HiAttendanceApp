import React, { useState } from "react";
import { FaMapMarkerAlt, FaLocationArrow, FaMoneyBillWave, FaWallet, FaCreditCard } from "react-icons/fa";
import { SiPhonepe } from "react-icons/si"; // UPI icon
import { useLocationContext } from "../context/LocationContext"; // adjust path if needed

const RideBookingSummary = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const { currentLocation, destination } = useLocationContext(); 

  return (
    <div className="bg-white max-w-md mx-auto rounded-2xl shadow-xl p-6 space-y-5">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 text-center">
        Confirm Your Ride
      </h2>

      {/* Pre-filled Locations */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
          <FaLocationArrow className="text-green-500 text-xl" />
          <input
            type="text"
            value={currentLocation || "Fetching your location..."}
            readOnly
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
          <FaMapMarkerAlt className="text-red-500 text-xl" />
          <input
            type="text"
            value={destination || "No destination selected"}
            readOnly
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Payment Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${
              paymentMethod === "Cash" ? "bg-green-100 border-green-500" : "bg-gray-50 border-gray-300"
            }`}
            onClick={() => setPaymentMethod("Cash")}
          >
            <FaMoneyBillWave className="text-green-600" />
            Cash
          </button>

          <button
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${
              paymentMethod === "UPI" ? "bg-purple-100 border-purple-500" : "bg-gray-50 border-gray-300"
            }`}
            onClick={() => setPaymentMethod("UPI")}
          >
            <SiPhonepe className="text-purple-600" />
            UPI
          </button>

          <button
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${
              paymentMethod === "Card" ? "bg-blue-100 border-blue-500" : "bg-gray-50 border-gray-300"
            }`}
            onClick={() => setPaymentMethod("Card")}
          >
            <FaCreditCard className="text-blue-600" />
            Card
          </button>

          <button
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${
              paymentMethod === "Wallet" ? "bg-yellow-100 border-yellow-500" : "bg-gray-50 border-gray-300"
            }`}
            onClick={() => setPaymentMethod("Wallet")}
          >
            <FaWallet className="text-yellow-600" />
            Wallet
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md">
        Confirm Booking
      </button>
    </div>
  );
};

export default RideBookingSummary;
