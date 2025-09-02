import React, { useState, useRef, useEffect } from 'react'
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);
  const navigate=useNavigate();

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
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
    // this iwill be handling the backspaces 
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    //fr Handling arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const resendOtp = () => {
    // Reset OTP
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    // Add your resend logic here
  };

  return (
    <>
      <div className='bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen'>
        <div className='flex flex-col justify-between w-[90%] max-w-md mx-auto text-white h-screen relative'>
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
          </div>
          
          {/* Top section of the page */}
          <div className='flex flex-col justify-start pt-12 relative z-10'>

            {/* Header with logo and help */}
            <div className='flex justify-between items-center px-2 mb-16'>
              <div className='text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent'>
                DayTracker
              </div>
              
              <div className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer group'>
                <HiMiniQuestionMarkCircle className='text-xl group-hover:scale-110 transition-transform' />
                <div className='text-sm font-medium'>Help</div>
              </div>
            </div>

            {/* Welcome section */}
            <div className='flex flex-col space-y-4 mb-12'>
              <div className='text-3xl font-bold leading-tight'>
                Verify Your Number
              </div>
              <div className='text-gray-400 text-lg leading-relaxed'>
                We've sent a 6-digit code to your phone number. Enter it below to continue
              </div>
            </div>
            
            {/* OTP input section */}
            <div className='relative mb-8'>
              <div className='flex justify-between space-x-3 mb-6'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={`w-12 h-14 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-center text-xl font-semibold text-white transition-all duration-300 focus:outline-none ${
                      focusedIndex === index
                        ? 'border-blue-400 shadow-lg shadow-blue-400/20 bg-gray-700/50 transform scale-110'
                        : digit
                        ? 'border-green-400 bg-gray-700/30'
                        : 'border-gray-600 hover:border-gray-500'
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
              
              {/* Helper text */}
              <div className='text-xs text-gray-500 px-2 text-center'>
                Enter the 6-digit verification code
              </div>
              
              {/* Resend section */}
              <div className='text-center mt-6'>
                <div className='text-sm text-gray-400 mb-2'>
                  Didn't receive the code?
                </div>
                <button 
                  onClick={resendOtp}
                  className='text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors underline'
                >
                  Resend Code
                </button>
              </div>
            </div>

          </div>

          {/* Bottom section - Terms and Verify button */}
          <div className='flex flex-col space-y-6 pb-12 relative z-10'>
            
            {/* Security note */}
            <div className='text-sm text-gray-400 leading-relaxed px-2 text-center'>
              This helps us keep your account secure. The code will expire in 5 minutes.
            </div>
            
            {/* Verify button */}
            <button 
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                isOtpComplete
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isOtpComplete}
              onClick={() => navigate('/signup')}
            >
              {isOtpComplete ? 'Verify & Continue' : 'Enter 6-Digit Code'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OTPVerificationPage;