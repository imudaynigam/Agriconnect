import { useState, useEffect } from "react";
import { Leaf, LayoutDashboard, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const InvestorNavbar = ({ investorName, isProfileMenuOpen, setProfileMenuOpen, hideProfileMenu, handleLogout, minimal, onSidebarToggle, hideSidebarToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.toLowerCase().includes('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
    >
      {!minimal && !hideSidebarToggle && isDashboard && (
        <button
          onClick={onSidebarToggle}
          className="p-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none absolute left-4 top-1/2 -translate-y-1/2 z-50"
          aria-label="Open sidebar"
          style={{ marginTop: 0 }}
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-gray-900 rounded"></div>
            <div className="w-full h-0.5 bg-gray-900 rounded"></div>
            <div className="w-full h-0.5 bg-gray-900 rounded"></div>
          </div>
        </button>
      )}
      <div className="bg-white w-full">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 pl-12">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">AgriConnect</span>
            </div>

            {!minimal && (
              <div className="hidden lg:block">
                <span className="font-bold text-lg italic text-green-600 tracking-wider">Grow Your Wealth by Growing the Future of Farming.</span>
              </div>
            )}

            {!minimal && (
              <div className="flex items-center">
                { !hideProfileMenu && <span className="text-green-800 font-medium mr-3 text-lg">{investorName}</span> }
                { !hideProfileMenu && <div className="relative">
                  <div>
                    <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} type="button" className="max-w-xs bg-green-600 rounded-full flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white h-10 w-10 text-white font-bold" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      I
                    </button>
                  </div>
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                      <Link to="/Investor/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-2">
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                        Dashboard
                      </Link>
                      <Link to="/Investor/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-0">
                        <User className="mr-3 h-5 w-5 text-gray-500" />
                        Profile
                      </Link>
                      <a href="#" onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-3">
                        <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                        Logout
                      </a>
                    </div>
                  )}
                </div> }
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InvestorNavbar; 