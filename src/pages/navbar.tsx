import { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Navbar({ isSidebarOpen, toggleSidebar }: NavbarProps) {
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
      <nav className="bg-white border-b border-gray-100 py-4 h-[80px] w-full flex items-center z-30 px-6 md:px-8 justify-between relative">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="DragSpace Logo" className="h-10" />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Logout Button - Hide on mobile and when sidebar is open */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="text-[15px]">Logout</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-gray-600 hover:text-blue-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-50"
          >
            {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 ease-in-out">
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 rounded-full p-1.5 transition-colors"
            >
              <IoMdClose size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Logout Confirmation
              </h2>
              <p className="text-gray-500">
                Are you sure you want to logout from your account?
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging Out...
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
}