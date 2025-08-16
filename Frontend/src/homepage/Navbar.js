import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const {
    isLoggedIn,
    username,
    handleLogout,
    setIsLoginOpen
  } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout and redirect to home
  const logoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center shadow-md">

      {/* app logo / home link */}
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        🏠 HDB Resale Compare
      </h1>

      {/* navigation links */}
      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-gray-200 transition font-bold">Home</Link>
        <Link to="/map-selection" className="hover:text-gray-200 transition">Compare Prices</Link>
        <Link to="/selection-mode" className="hover:text-gray-200 transition">Interactive Map</Link>
        <Link to="/insights" className="hover:text-gray-200 transition">Insights & Trends</Link>

        {/* user dropdown or login button */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white text-red-600 px-4 py-2 rounded-lg flex items-center"
            >
              {username} ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-red-600 shadow-md rounded-lg">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button
                  onClick={logoutAndRedirect}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-white text-red-600 px-4 py-2 rounded-lg"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}