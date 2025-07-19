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
    <nav className="bg-zinc-950 text-white px-4 py-3 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight flex items-center gap-2"
        >
          🔨 <span className="text-white">TrackForge</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-purple-400 hover:underline underline-offset-4 transition">
            Home
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-purple-400 hover:underline underline-offset-4 transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Right - Auth Info + Logout */}
        {user && (
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-300">
            <span className="text-xs">
              Signed in as{" "}
              <span className="text-white font-medium">{user.email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs transition"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 px-4 flex flex-col gap-3 text-sm font-medium">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          {user && <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>}
          {user ? (
            <button
              onClick={handleLogout}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
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
