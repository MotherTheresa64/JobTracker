import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";


const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return user ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
