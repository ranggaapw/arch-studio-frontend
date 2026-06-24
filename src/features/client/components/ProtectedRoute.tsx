import { Navigate } from 'react-router-dom';
import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Pastikan key-nya SAMA PERSIS dengan yang digunakan di localStorage.setItem
  const isAuthenticated = !!localStorage.getItem('auth_token');
  
  console.log("Cek Token di ProtectedRoute:", localStorage.getItem('auth_token'));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}