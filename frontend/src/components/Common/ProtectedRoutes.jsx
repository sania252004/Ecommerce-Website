import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  // ✅ Fallback to localStorage on refresh before Redux rehydrates
  const storedUser = user || (() => {
    try {
      const info = localStorage.getItem("userInfo");
      return info ? JSON.parse(info).user || JSON.parse(info) : null;
    } catch {
      return null;
    }
  })();

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && storedUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoutes;