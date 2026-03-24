import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth(); // Assuming your AuthContext provides 'loading'

    if (loading) {
        // You can replace this with a proper Loading Spinner component
        return <div className="text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Optional: Check for roles if allowedRoles is provided
    // if (allowedRoles && !allowedRoles.includes(user.role)) {
    //   return <Navigate to="/" replace />; // Or unauthorized page
    // }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
