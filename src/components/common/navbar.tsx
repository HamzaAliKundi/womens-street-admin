import React, { useState } from "react";
import { FiMenu, FiBell, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-slate-800">Women's Street Admin</h1>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-slate-900">Admin User</div>
                <div className="text-xs text-slate-500">admin@womensstreet.com</div>
              </div>
              
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-sm w-full px-6 py-6 flex flex-col items-center animate-fade-in mx-4">
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 rounded-full p-1 transition-colors"
              aria-label="Close modal"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex flex-col items-center gap-2 mb-6 mt-1">
              <div className="bg-red-100 text-red-500 rounded-full p-2 mb-1">
                <FiLogOut className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Logout Confirmation</h2>
              <p className="text-slate-500 text-center text-sm max-w-xs">
                Are you sure you want to logout from your account?
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2 px-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 h-9 rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium text-xs"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-9 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-xs min-w-[80px]"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center justify-center gap-1">
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging out...</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
