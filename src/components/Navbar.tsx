import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch {
      alert("Logout failed.");
    }
  };

  return (
    <nav className="bg-zinc-950 text-white px-6 py-4 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          🎯 <span className="hidden sm:inline">Job Tracker 2025</span>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links - Desktop */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          {user && <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>}
        </div>

        {/* Auth Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {user && (
            <span className="text-xs text-gray-400">Signed in as: <strong>{user.email}</strong></span>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 px-4 text-sm font-medium">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          {user && <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
