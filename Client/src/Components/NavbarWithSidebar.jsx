import React, { useState } from 'react';
import { HiOutlineBars3, HiXMark, HiChevronRight, HiStar } from 'react-icons/hi2';
import { 
  HiOutlineClock,
  HiOutlineMapPin, 
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCreditCard,
  HiOutlineUserCircle,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth
} from 'react-icons/hi2';


const NavbarWithSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 const menuItems = [
  { icon: HiOutlineMapPin, title: 'Mark Attendance', subtitle: 'Verify location & log in' },
  { icon: HiOutlineClock, title: 'Attendance Log', subtitle: 'View in/out history' },
  { icon: HiOutlineCalendarDays, title: 'Leaves', subtitle: 'Apply & track leave' },
  // { icon: HiOutlineCreditCard, title: 'Payroll', subtitle: 'Salary details & slips' },
  { icon: HiOutlineClipboardDocumentCheck, title: 'Tasks', subtitle: 'Assigned work & updates' },
  { icon: HiOutlineUserCircle, title: 'Profile', subtitle: 'Employee details' },
  { icon: HiOutlineBell, title: 'Notifications', subtitle: null },
  { icon: HiOutlineShieldCheck, title: 'Security & Safety', subtitle: null },
  { icon: HiOutlineDocumentText, title: 'Reports', subtitle: 'Performance & logs' },
  { icon: HiOutlineCog6Tooth, title: 'Settings', subtitle: null },
];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg relative z-40 w-full">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Menu button */}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>

            {/* Center - Logo/Title */}
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TrackAttendance
            </div>

            {/* Right side - User */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">U</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="max-w-md mx-auto h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col">
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Menu
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
            >
              <HiXMark className="text-2xl" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">JD</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">Unidentified</h3>
                <p className="text-gray-400 text-sm mb-3">+91 98765 43210</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">My Rating</span>
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
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors">
                      <item.icon className="text-xl text-gray-300 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      {item.subtitle && (
                        <p className="text-green-400 text-sm px-2">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <HiChevronRight className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
              ))}
              <div className="h-20"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 flex-shrink-0">
            <div className="text-center text-gray-400 text-sm">
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
