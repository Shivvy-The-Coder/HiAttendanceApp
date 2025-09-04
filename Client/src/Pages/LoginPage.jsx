import React, { useState } from 'react'
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-linear-65 from-blue-800/70 to-yellow-400/70 backdrop-blur-3xl max-w-md mx-auto min-h-screen text-shadow-2xs'>
        <div className='flex flex-col justify-between w-[90%] max-w-md mx-auto text-white h-screen relative'>
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
          </div>
          
          {/* Top section of the login page */}
          <div className='flex flex-col justify-start pt-12 relative z-10'>

            {/* Header with logo and help */}
            <div className='flex justify-between items-center px-2 mb-16'>
              <div className='text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-400 text-shadow-xs bg-clip-text text-transparent'>
                DayTracker
              </div>
              
              <div className='flex items-center space-x-2 text-white hover:text-white transition-colors cursor-pointer group'>
                <HiMiniQuestionMarkCircle className='text-xl group-hover:scale-110 transition-transform' />
                <div className='text-sm font-medium'>Help</div>
              </div>
            </div>

            {/* Welcome section */}
            <div className='flex flex-col space-y-4 mb-12'>
              <div className='text-3xl font-bold leading-tight text-white'>
                What's Your Number?
              </div>
              <div className='text-white-100 text-lg leading-relaxed'>
                Enter your phone number to get started and join thousands of users
              </div>
            </div>
            
            {/* Phone input section */}
            <div className='relative mb-8'>
              <div className={`relative transition-all duration-300 ${
                isFocused ? 'transform scale-105' : ''
              }`}>
                <input 
                  className={`w-full bg-gray-900/10 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-yellow-200/70 transition-all duration-300 focus:outline-none ${
                    isFocused 
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800/50' 
                      : 'border-white hover:border-yellow-300'
                  }`}
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder='+91 Enter phone number'
                />
                
                {/* Input decoration */}
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                  phoneNumber ? 'bg-green-400' : 'bg-yellow-200/40'
                }`}></div>
              </div>
              
              {/* Helper text */}
              <div className='text-xs text-white-200 mt-2 px-2'>
                We'll send you a verification code
              </div>
            </div>

          </div>

          {/* Bottom section - Terms and Next button */}
          <div className='flex flex-col space-y-6 pb-12 relative z-10'>
            
            {/* Terms text */}
            <div className='text-sm text-white-100 leading-relaxed px-2'>
              By continuing, you agree to our{' '}
              <span className='text-white-300 underline cursor-pointer hover:text-white-200'>
                Terms of Service
              </span>{' '}
              and{' '}
              <span className='text-white-300 underline cursor-pointer hover:text-white-200'>
                Privacy Policy
              </span>
              . We're committed to protecting your data.
            </div>
            
            {/* Next button */}
            <button 
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                phoneNumber.length > 9
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-500/40 hover:scale-105 text-white'
                  : 'bg-blue-400/70 text-white cursor-not-allowed'
              }`}
              disabled={phoneNumber.length <= 9}
              onClick={() => navigate('/verify', { state: { phoneNumber } })}
            >
              {phoneNumber.length > 9 ? 'Continue' : 'Enter Phone Number'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage;
