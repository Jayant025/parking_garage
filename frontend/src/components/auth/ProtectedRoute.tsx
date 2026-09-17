import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="w-full max-w-lg px-4">
          <LoadingSkeleton count={3} height="h-16" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedUserRole = (user.role || '').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      // If customer attempts operator page, redirect to customer portal
      if (normalizedUserRole === 'customer' || normalizedUserRole === 'user') {
        return <Navigate to="/customer" replace />;
      }
      // If operator attempts customer page, redirect to operator dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
