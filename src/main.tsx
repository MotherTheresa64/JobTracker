// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import JobProvider from "./context/JobProvider";
import { JobModalProvider } from "./context/JobModalProvider"; // ✅ Import it
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <JobModalProvider> {/* ✅ Add this wrapper */}
            <App />
          </JobModalProvider>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
