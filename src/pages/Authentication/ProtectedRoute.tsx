import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // Kiritilgan roldan foydalanuvchi kirishi mumkin
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, role } = useAuth();

  if (!token) {
    // Foydalanuvchi login qilmagan bo'lsa
    return <Navigate to="/auth/signin" />;
  }

  if (!allowedRoles.includes(role!)) {
    // Agar foydalanuvchi ruxsat etilgan rolga ega bo'lmasa
    return <Navigate to="/403" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
