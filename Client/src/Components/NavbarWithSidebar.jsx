import React, { useState } from 'react';
import { 
  HiOutlineBars3, 
  HiXMark, 
  HiChevronRight, 
  HiStar, 
  HiOutlineClock, 
  HiOutlineMapPin, 
  HiOutlineCalendarDays, 
  HiOutlineShieldCheck, 
  HiOutlineDocumentText, 
  HiOutlineCog6Tooth, 
  HiOutlineBell
} from 'react-icons/hi2';

const NavbarWithSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { icon: HiOutlineMapPin, title: 'Mark Attendance', subtitle: 'Verify location & log in' },
    { icon: HiOutlineShieldCheck, title: 'Security & Safety', subtitle: null },
    { icon: HiOutlineDocumentText, title: 'Reports', subtitle: 'Performance & logs' },
    { icon: HiOutlineCog6Tooth, title: 'Settings', subtitle: null },
  ];

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Top Navbar (now Attendance Header) */}
      <nav className="bg-gradient-to-br from-yellow-400 via-cyan-900 to-green-500 shadow-lg relative z-40 w-full">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left - Menu Button & Title */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleSidebar}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <HiOutlineBars3 className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Attendance</h1>
              <p className="text-sm text-blue-200">Track your work hours</p>
            </div>
          </div>

          {/* Right - Clock + Bell */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {formatTime(currentTime)}
              </p>
              <p className="text-xs text-blue-200">
                {currentTime.toDateString()}
              </p>
            </div>
            <div className="relative p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition">
              <HiOutlineBell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="max-w-md mx-auto h-full bg-gradient-to-br from-blue-950 via-cyan-900 to-green-800 flex flex-col shadow-2xl">
          
          {/* Sidebar Header (close button only) */}
          <div className="flex justify-end p-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <HiXMark className="text-2xl" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-cyan-700 flex-shrink-0">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">JD</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Unidentified</h3>
                <p className="text-cyan-300 text-sm mb-3">+91 98765 43210</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-cyan-200">My Rating</span>
                  <div className="flex items-center space-x-1">
                    <HiStar className="text-yellow-400 text-lg" />
                    <span className="text-white font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Menu */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-5 rounded-2xl bg-white/10 shadow hover:bg-white/20 cursor-pointer transition">
                  <HiOutlineClock className="text-2xl text-cyan-300 mb-2" />
                  <span className="text-white font-medium">Attendance Log</span>
                </div>
                <div className="flex flex-col items-center p-5 rounded-2xl bg-white/10 shadow hover:bg-white/20 cursor-pointer transition">
                  <HiOutlineCalendarDays className="text-2xl text-green-300 mb-2" />
                  <span className="text-white font-medium">Leaves</span>
                </div>
              </div>

              {/* Main Menu Items */}
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/10 shadow hover:bg-white/20 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <item.icon className="text-xl text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      {item.subtitle && (
                        <p className="text-cyan-300 text-sm">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <HiChevronRight className="text-cyan-400 group-hover:text-white transition-colors" />
                </div>
              ))}

              <div className="h-20"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-cyan-700 flex-shrink-0 bg-gradient-to-r from-blue-900 to-cyan-800">
            <div className="text-center text-cyan-300 text-sm">
              <p>Version 0.0.1</p>
              <p className="mt-1">© 2025 Artificial Computing Machines</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarWithSidebar;
