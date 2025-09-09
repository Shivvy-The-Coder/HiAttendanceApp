import React, { useState } from "react";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const backendURL = "http://localhost:5000"; // later move to .env

  const handleLogin = async () => {
    if (phoneNumber.length !== 10 || !password) {
      setMessage("Enter valid 10-digit phone number and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${backendURL}/login`, {
        mobile: phoneNumber,
        password,
      });

      setMessage(res.data.message);

      if (res.data.success) {
        // ✅ store token + user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // redirect to home/dashboard
        navigate("/home");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-65 from-blue-800/70 to-yellow-400/70 backdrop-blur-3xl max-w-md mx-auto min-h-screen text-shadow-2xs">
      <div className="flex flex-col justify-between w-[90%] max-w-md mx-auto text-white h-screen relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
        </div>

        {/* Top section */}
        <div className="flex flex-col justify-start pt-12 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center px-2 mb-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent text-shadow-xs">
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
              Welcome Back!
            </div>
            <div className="text-white-100 text-lg leading-relaxed">
              Login with your phone number and password
            </div>
          </div>

          {/* Phone input */}
          <div className="relative mb-6">
            <input
              className={`w-full bg-gray-900/10 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 transition-all duration-300 focus:outline-none ${
                isFocused
                  ? "border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800/50"
                  : "border-white hover:border-yellow-300"
              }`}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
          </div>

          {/* Password input */}
          <div className="relative mb-6">
            <input
              className="w-full bg-gray-900/10 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 bg-gray-800/50"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* Backend message */}
          {message && (
            <div className="text-sm text-center text-red-400 mt-2">{message}</div>
          )}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col space-y-6 pb-12 relative z-10">
          <div className="text-sm text-white-100 leading-relaxed px-2">
            By continuing, you agree to our{" "}
            <span className="text-white-300 underline cursor-pointer hover:text-white-200">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-white-300 underline cursor-pointer hover:text-white-200">
              Privacy Policy
            </span>
            .
          </div>

          {/* Login button */}
          <button
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
              phoneNumber.length === 10 && password
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-500/40 hover:scale-105 text-white"
                : "bg-blue-400/70 text-white cursor-not-allowed"
            }`}
            disabled={phoneNumber.length !== 10 || !password || loading}
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
