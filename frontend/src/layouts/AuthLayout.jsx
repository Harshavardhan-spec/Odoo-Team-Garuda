import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  // If already authenticated, bypass login screen
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

