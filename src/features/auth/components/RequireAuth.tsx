import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthProvider";

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  return user?.email ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export default RequireAuth;
