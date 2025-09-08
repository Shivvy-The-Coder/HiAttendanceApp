import React, { useState, useRef, useEffect } from "react";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = location.state?.phoneNumber || ""; // phone number from login
  const backendURL = "http://localhost:5000"; // backend URL

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

const verifyOtp = async () => {
  if (!isOtpComplete) return;
  setLoading(true);
  setMessage("");

  try {
    const res = await axios.post(`${backendURL}/register/verify-otp`, {
      mobile,
      otp: otp.join(""),
    });

    setMessage(res.data.message);

    if (res.data.success) {
      // ✅ Store JWT token
      localStorage.setItem("token", res.data.token);

      // ✅ Store user details (id, name, mobile) returned by backend
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // 🔹 Navigate to signup page to complete registration
      navigate("/signup", { state: { phoneNumber: mobile } });
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "Error verifying OTP");
  } finally {
    setLoading(false);
  }
};



  const resendOtp = async () => {
    try {
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setMessage("");
      setLoading(true);
      const res = await axios.post(`${backendURL}/register/send-otp`, { mobile });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resending OTP");
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
          <div className="flex justify-between items-center px-2 mb-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent text-shadow-xs">
              DayTracker
            </div>
            <div className="flex items-center space-x-2 text-white hover:text-white transition-colors cursor-pointer group">
              <HiMiniQuestionMarkCircle className="text-xl group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">Help</div>
            </div>
          </div>

          {/* OTP Instructions */}
          <div className="flex flex-col space-y-4 mb-12">
            <div className="text-3xl font-bold leading-tight">Verify Your Number</div>
            <div className="text-white text-lg leading-relaxed">
              We've sent a 6-digit code to your phone number. Enter it below to continue
            </div>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-between space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`w-12 h-14 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-center text-xl font-semibold text-white transition-all duration-300 focus:outline-none ${
                  focusedIndex === index
                    ? "border-blue-400 shadow-lg shadow-blue-400/20 bg-gray-700/50 transform scale-110"
                    : digit
                    ? "border-green-400 bg-gray-700/30"
                    : "border-white hover:border-yellow-500"
                }`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {/* Messages */}
          {message && <div className="text-center text-red-400 mb-4">{message}</div>}

          {/* Resend */}
          <div className="text-center mt-2">
            <span className="text-white text-sm">Didn't receive the code? </span>
            <button
              onClick={resendOtp}
              className="text-blue-500 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Resend Code
            </button>
          </div>
        </div>

        {/* Verify button */}
        <div className="flex flex-col space-y-6 pb-12 relative z-10">
          <button
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
              isOtpComplete
                ? "bg-yellow-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white text-shadow-2xs cursor-not-allowed"
            }`}
            disabled={!isOtpComplete || loading}
            onClick={verifyOtp}
          >
            {loading ? "Verifying..." : isOtpComplete ? "Verify & Continue" : "Enter 6-Digit Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
