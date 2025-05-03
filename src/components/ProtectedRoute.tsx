import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState, loading } = useAuth();

  // Bypass authentication for design purposes
  const bypassAuth = true;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy-900">
        <div className="w-12 h-12 border-4 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Allow access even if not authenticated when bypass is enabled
  if (!authState.isAuthenticated && !bypassAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;