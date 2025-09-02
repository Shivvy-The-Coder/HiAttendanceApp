import React, { useState } from 'react'
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';



const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const navigate=useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = name.length > 1 && isValidEmail(email);

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
                Almost There!
              </div>
              <div className='text-gray-400 text-lg leading-relaxed'>
                Just a few more details to complete your profile and get started
              </div>
            </div>
            
            {/* Name input section */}
            <div className='relative mb-6'>
              <div className={`relative transition-all duration-300 ${
                focusedField === 'name' ? 'transform scale-105' : ''
              }`}>
                <input 
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                    focusedField === 'name'
                      ? 'border-blue-400 shadow-lg shadow-blue-400/20 bg-gray-700/50' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  placeholder='Enter your full name'
                />
                
                {/* Input decoration */}
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                  name.length > 1 ? 'bg-green-400' : 'bg-gray-600'
                }`}></div>
              </div>
              
              {/* Helper text */}
              <div className='text-xs text-gray-500 mt-2 px-2'>
                This will be displayed on your profile
              </div>
            </div>

            {/* Email input section */}
            <div className='relative mb-8'>
              <div className={`relative transition-all duration-300 ${
                focusedField === 'email' ? 'transform scale-105' : ''
              }`}>
                <input 
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border-2 rounded-2xl px-6 py-4 text-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                    focusedField === 'email'
                      ? 'border-blue-400 shadow-lg shadow-blue-400/20 bg-gray-700/50' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder='Enter your email address'
                />
                
                {/* Input decoration */}
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                  isValidEmail(email) ? 'bg-green-400' : 'bg-gray-600'
                }`}></div>
              </div>
              
              {/* Helper text */}
              <div className='text-xs text-gray-500 mt-2 px-2'>
                We'll use this for booking confirmations and updates
              </div>
            </div>

          </div>

          {/* Bottom section - Terms and Next button */}
          <div className='flex flex-col space-y-6 pb-12 relative z-10'>
            
            {/* Privacy note */}
            <div className='text-sm text-gray-400 leading-relaxed px-2'>
              Your information is secure and will only be used to enhance your{' '}
              <span className='text-blue-400'>DayTracker</span> experience. 
              You can update these details anytime in settings.
            </div>
            
            {/* Next button */}
            <button 
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isFormValid}
              onClick={() => navigate('/home', { state: {isFormValid } })}
            >
              {isFormValid ? 'Complete Setup' : 'Fill Required Details'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupPage;