import React from "react";
import { Navigate } from "react-router-dom";
import getCurrentUser from "./getCurrentUser";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  console.log(user);
  if (!user) {
    // Redirect to login if there's no user

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
