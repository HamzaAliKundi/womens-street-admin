import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiGrid, FiPackage, FiShoppingCart, FiBarChart, FiSettings, FiLogOut } from "react-icons/fi";

interface SideNavProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { section: "DASHBOARD", items: [
    { name: "Products", path: "/products", icon: FiPackage },
    { name: "Orders", path: "/orders", icon: FiShoppingCart },
    { name: "Analytics", path: "/analytics", icon: FiBarChart },
  ]},
  { section: "ACCOUNT", items: [
    { name: "Settings", path: "/settings", icon: FiSettings },
    { name: "Logout", path: "#logout", icon: FiLogOut },
  ]}
];

const SideNav = ({ isSidebarOpen, toggleSidebar }: SideNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`fixed z-40 top-0 left-0 h-[910px] w-[300px] bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center transition-transform duration-300 md:relative md:translate-x-0 md:z-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ minHeight: 910, minWidth: 300 }}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-white text-2xl mt-6"
          onClick={toggleSidebar}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Logo and Links Container */}
        <div
          className="flex flex-col items-center mt-14"
          style={{ width: 212, height: 333 }}
        >
          <div className="text-2xl font-bold text-white mb-2">
            Women's Street
          </div>
          <div className="text-sm text-slate-300 mb-6">Admin Dashboard</div>
          {/* Navigation */}
          <nav className="w-full flex-1 flex flex-col mt-6">
            {navItems.map((section) => (
              <div key={section.section} className="mb-6">
                <div className="text-xs text-slate-400 font-semibold px-2 mb-2 tracking-widest">
                  {section.section}
                </div>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    if (item.name === "Logout") {
                      return (
                        <li key={item.name}>
                          <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            <item.icon className="w-6 h-6" style={{ width: 24, height: 24 }} />
                            <span
                              style={{ fontFamily: 'Afacad, sans-serif', fontWeight: 500, fontSize: 16, lineHeight: '100%', letterSpacing: 0, verticalAlign: 'middle' }}
                            >
                              {item.name}
                            </span>
                          </button>
                        </li>
                      );
                    }
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.name}>
                        <NavLink
                          to={item.path}
                          className={({ isActive: navActive }) => {
                            const base = "flex items-center gap-3 rounded-lg transition-all duration-200 font-[Afacad,sans-serif] font-medium text-[16px]";
                            const active = "bg-blue-600 text-white shadow-lg";
                            const inactive = "text-slate-300 hover:text-white hover:bg-slate-700";
                            const activeStyle = navActive
                              ? `${active} px-4 py-3`
                              : `${inactive} px-2 py-3`;
                            return `${base} ${activeStyle}`;
                          }}
                          onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                        >
                          <item.icon className="w-6 h-6" style={{ width: 24, height: 24 }} />
                          <span
                            style={{ fontFamily: 'Afacad, sans-serif', fontWeight: 500, fontSize: 16, lineHeight: '100%', letterSpacing: 0, verticalAlign: 'middle' }}
                          >
                            {item.name}
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        {/* Logout Modal */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 max-w-sm w-full px-6 py-6 flex flex-col items-center animate-fade-in mx-4">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                aria-label="Close modal"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="flex flex-col items-center gap-2 mb-6 mt-1">
                <div className="bg-red-100 text-red-500 rounded-full p-2 mb-1">
                  <FiLogOut className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Logout Confirmation</h2>
                <p className="text-gray-500 text-center text-sm max-w-xs">
                  Are you sure you want to logout from your account?
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2 px-2">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 h-9 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium text-xs"
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
      </aside>
    </>
  );
};

export default SideNav;