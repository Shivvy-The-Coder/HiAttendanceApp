import React, { useState } from "react";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.phoneNumber || ""; // prefilled mobile

  const backendURL = "http://localhost:5000";

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = name.length > 1 && isValidEmail(email) && password.length >= 6;

 const completeRegistration = async () => {
  if (!isFormValid) return;
  setLoading(true);
  setMessage("");
  try {
    const res = await axios.post(`${backendURL}/register/complete`, {
      mobile,
      name,
      email,
      password,
    });
    setMessage(res.data.message);

    if (res.data.success) {
      // ✅ Save updated user details (name included) to localStorage
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Navigate to home/dashboard
      navigate("/home");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "Error completing registration");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-linear-65 from-blue-800/70 to-yellow-400/70 backdrop-blur-3xl max-w-md mx-auto min-h-screen text-shadow-2xs">
      <div className="flex flex-col justify-between w-[90%] max-w-md mx-auto text-white h-screen relative">

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
        </div>

        {/* Top section */}
        <div className="flex flex-col justify-start pt-12 relative z-10">

          {/* Header */}
          <div className="flex justify-between items-center px-2 mb-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-400 text-shadow-xs bg-clip-text text-transparent">
              DayTracker
            </div>
            <div className="flex items-center space-x-2 text-white hover:text-white transition-colors cursor-pointer group">
              <HiMiniQuestionMarkCircle className="text-xl group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">Help</div>
            </div>
          </div>

          {/* Welcome text */}
          <div className="flex flex-col space-y-4 mb-12">
            <div className="text-3xl font-bold leading-tight text-white">
              Complete Your Profile
            </div>
            <div className="text-white-100 text-lg leading-relaxed">
              Enter your details below to finish registration
            </div>
          </div>

          {/* Mobile (readonly) */}
          <div className="relative mb-6">
            <input
              type="tel"
              value={mobile}
              readOnly
              className="w-full bg-gray-900/10 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 focus:outline-none border-white"
              placeholder="+91 Enter phone number"
            />
            <div className="text-xs text-white-200 mt-2 px-2">Your verified number</div>
          </div>

          {/* Name */}
          <div className="relative mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
              placeholder="Enter full name"
              className={`w-full bg-gray-900/10 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 transition-all duration-300 focus:outline-none ${
                focusedField === "name" ? "border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800/50" : "border-white hover:border-yellow-300"
              }`}
            />
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              placeholder="Enter email address"
              className={`w-full bg-gray-900/10 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 transition-all duration-300 focus:outline-none ${
                focusedField === "email" ? "border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800/50" : "border-white hover:border-yellow-300"
              }`}
            />
          </div>

          {/* Password */}
          <div className="relative mb-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              placeholder="Enter password"
              className={`w-full bg-gray-900/10 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 transition-all duration-300 focus:outline-none ${
                focusedField === "password" ? "border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800/50" : "border-white hover:border-yellow-300"
              }`}
            />
          </div>

        </div>

        {/* Bottom section */}
        <div className="flex flex-col space-y-6 pb-12 relative z-10">
          {message && <div className="text-center text-red-400">{message}</div>}

          <button
            disabled={!isFormValid || loading}
            onClick={completeRegistration}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
              isFormValid
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-500/40 hover:scale-105 text-white"
                : "bg-blue-400/70 text-white cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
