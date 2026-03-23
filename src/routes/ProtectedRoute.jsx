import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalState';

export const ProtectedRoute = ({ children }) => {
    const { user, isAuthLoading } = useGlobalContext();

    if (isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center font-medium text-gray-500">Verifying access...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { user, isAuthLoading } = useGlobalContext();
    const ADMIN_EMAIL = "qadriharis11@gmail.com"; 

    if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Verifying admin access...</div>;

    if (!user || user.email !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    return children;
};