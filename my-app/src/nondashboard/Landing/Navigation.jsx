import React, { useState, useEffect, useRef } from "react";
import { Leaf, User, ShoppingCart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from '../../utils/supabaseClient';
import { addToCart } from '../../utils/cart';

const Navigation = ({ showProfile = false, role = null, cartItemCount = 0, searchQuery = '', onSearchChange, logoRedirect = "/" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Account dropdown
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef();
  const dropdownTimeout = useRef();
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [addedToCartId, setAddedToCartId] = useState(null);
  const [cartToast, setCartToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide nav links and login button on login/signup pages
  const isAuthPage = ["/login", "/signup"].includes(location.pathname.toLowerCase());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDashboard = showProfile;

  // Fetch all products for dashboard search
  useEffect(() => {
    if (!isDashboard) return;
    const fetchProducts = async () => {
      let { data, error } = await supabase.from('products').select('*');
      if (!error) setAllProducts(data || []);
    };
    fetchProducts();
  }, [isDashboard]);

  // Filter products as user types
  useEffect(() => {
    if (!isDashboard || !searchQuery) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allProducts.filter(prod =>
      (prod.name && prod.name.toLowerCase().includes(q)) ||
      (prod.category && prod.category.toLowerCase().includes(q)) ||
      (prod.description && prod.description.toLowerCase().includes(q))
    ).slice(0, 8);
    setSearchResults(filtered);
  }, [searchQuery, allProducts, isDashboard]);

  // Close search dropdown on blur
  const handleSearchBlur = (e) => {
    setTimeout(() => setSearchDropdownOpen(false), 120);
  };

  // Scroll to product in ProductFeed (if possible)
  const handleResultClick = (prod) => {
    setSearchDropdownOpen(false);
    if (prod && prod.id) {
      // Dispatch a custom event to scroll to product in ProductFeed
      window.dispatchEvent(new CustomEvent('scroll-to-product', { detail: prod.id }));
    }
  };

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 180);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    if (onSearchChange) onSearchChange(value);
    window.dispatchEvent(new CustomEvent('dashboard-search', { detail: value }));
    setSearchDropdownOpen(!!value);
  };

  // Add to Cart handler for search dropdown
  const handleAddToCartFromDropdown = async (prod) => {
    if (!prod || !prod.id) return;
    setAddingToCartId(prod.id);
    setCartToast("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setCartToast('Please log in to add items to your cart.');
      setAddingToCartId(null);
      return;
    }
    const { error } = await addToCart(user.id, prod.id);
    if (error) {
      setCartToast('Error adding to cart.');
    } else {
      setAddedToCartId(prod.id);
      setCartToast('Added to cart!');
      window.dispatchEvent(new CustomEvent('cart-item-added', { detail: 1 }));
      setTimeout(() => setAddedToCartId(null), 1200);
    }
    setAddingToCartId(null);
  };

  // Handle logo click to redirect to homepage
  const handleLogoClick = () => {
    navigate(logoRedirect);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">AgriConnect</span>
            {role === "customer" && (
              <span className="ml-2 bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold">C</span>
            )}
          </div>

          {/* Hamburger for mobile */}
          {!isDashboard && (
            <button
              className="md:hidden flex items-center px-3 py-2 border rounded text-green-700 border-green-600 hover:bg-green-50 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Desktop Nav */}
          {!isDashboard && !isAuthPage && (
            <ul className="hidden md:flex items-center space-x-8">
              <li>
                <a href="#home" className="text-gray-700 hover:text-white transition-colors font-medium px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:bg-green-50">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-700 hover:text-white transition-colors font-medium px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:bg-green-50">About Us</a>
              </li>
              <li>
                <a href="#features" className="text-gray-700 hover:text-white transition-colors font-medium px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:bg-green-50">Services</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-700 hover:text-white transition-colors font-medium px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:bg-green-50">Contact Us</a>
              </li>
            </ul>
          )}

          {/* Dashboard Nav (unchanged) */}
          {isDashboard ? (
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <div className="relative flex items-center bg-gray-100 border border-gray-200 rounded-full px-3 py-1 mr-4 w-80">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search Product"
                  className="bg-transparent outline-none flex-1 text-sm px-2 py-1"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => { if (searchQuery) setSearchDropdownOpen(true); }}
                  onBlur={handleSearchBlur}
                  autoComplete="off"
                />
                {/* Search Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                {/* Dropdown */}
                {searchDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.map(prod => (
                      <div
                        key={prod.id}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 cursor-pointer group"
                        onMouseDown={e => e.preventDefault()}
                      >
                        <div onClick={() => handleResultClick(prod)} className="flex items-center gap-3 flex-1 min-w-0">
                          <img src={prod.image_url} alt={prod.name} className="w-10 h-10 rounded-full object-cover border" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 text-sm truncate">{prod.name}</div>
                            <div className="text-xs text-gray-500 truncate">{prod.category}</div>
                          </div>
                          <div className="text-green-700 font-bold text-sm whitespace-nowrap">₹{prod.price}</div>
                        </div>
                        <button
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${addedToCartId === prod.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'} ${addingToCartId === prod.id ? 'opacity-60 cursor-wait' : ''}`}
                          disabled={addingToCartId === prod.id}
                          onClick={() => handleAddToCartFromDropdown(prod)}
                        >
                          {addingToCartId === prod.id ? (
                            <svg className="w-4 h-4 animate-spin inline-block" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                          ) : addedToCartId === prod.id ? 'Added!' : 'Add to Cart'}
                        </button>
                      </div>
                    ))}
                    {cartToast && (
                      <div className="px-4 py-2 text-sm text-center text-green-700 bg-green-50 border-t border-green-100">{cartToast}</div>
                    )}
                  </div>
                )}
              </div>
              {/* Account and Cart */}
              <div className="flex items-center space-x-4">
                {/* Account */}
                <div
                  className="relative flex items-center cursor-pointer group"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="focus:outline-none flex items-center"
                  >
                    {role === "customer" ? (
                      <span className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-base">C</span>
                    ) : (
                      <User className="w-7 h-7 text-green-700" />
                    )}
                    <span className="ml-1 font-medium text-green-700">Account</span>
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
                {/* Divider */}
                <div className="h-6 w-px bg-gray-300 mx-2" />
                {/* Cart */}
                <Link to="/cart" className="relative flex items-center cursor-pointer group">
                  <ShoppingCart className="w-7 h-7 text-green-700" />
                  <span className="ml-1 font-medium text-green-700">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Login Button */}
              {!isDashboard && !isAuthPage && (
                <Link 
                  to="/Login" 
                  className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {!isDashboard && mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg py-4 md:hidden flex flex-col items-center z-40 animate-fade-in">
          <a href="#home" className="block w-full text-center text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2 rounded hover:bg-green-50 focus:outline-none focus:bg-green-50">Home</a>
          <a href="#about" className="block w-full text-center text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2 rounded hover:bg-green-50 focus:outline-none focus:bg-green-50">About Us</a>
          <a href="#features" className="block w-full text-center text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2 rounded hover:bg-green-50 focus:outline-none focus:bg-green-50">Services</a>
          <a href="#contact" className="block w-full text-center text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2 rounded hover:bg-green-50 focus:outline-none focus:bg-green-50">Contact Us</a>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
