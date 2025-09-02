import React from 'react'
import LoginPage from './Pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarWithSidebar from './Components/NavbarWithSidebar';
import Home from './Pages/Home';
import SignupPage from './Pages/SignupPage';
import OTPVerificationPage from './Pages/OTPVerificationPage';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/verify" element={<OTPVerificationPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/home" element={<Home/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
