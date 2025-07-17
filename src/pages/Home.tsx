// src/pages/Home.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  // 🚨 Redirect unauthenticated users to /auth
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4">
        Welcome to <span className="text-purple-400">TrackForge</span>
      </h1>
      <p className="text-gray-400 text-center max-w-xl mb-10 text-sm sm:text-base">
        Organize, monitor, and streamline your job applications — all in one place.
      </p>

      <div className="flex flex-col items-center gap-2 text-sm text-gray-300">
        <p>
          Signed in as <span className="text-white font-medium">{user?.email}</span>
        </p>
        <button
          onClick={logout}
          className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
