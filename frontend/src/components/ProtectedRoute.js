import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; // Adjust the import path according to your project structure

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Assuming useAuth provides `isAuthenticated`

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
