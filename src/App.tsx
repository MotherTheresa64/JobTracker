// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import JobModalRoot from "./components/JobModalRoot";
import { JobModalProvider } from "./context/JobModalProvider";

function App() {
  return (
    <JobModalProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans">
        {/* Global Navigation */}
        <Navbar />

        {/* Main Route Area */}
        <main className="p-6 max-w-7xl mx-auto">
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {/* Global Modal Mount Point */}
        <JobModalRoot />
      </div>
    </JobModalProvider>
  );
}

export default App;
