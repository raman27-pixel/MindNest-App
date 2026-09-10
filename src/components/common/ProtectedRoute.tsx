import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps any route that requires the user to be logged in.
 * If not logged in, redirects to /login preserving the intended destination.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login, but remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
