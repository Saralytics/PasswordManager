// LogoutButton.js
import React from 'react';
import { useAuth } from '../utils/AuthContext'; // Adjust the import path as needed

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    alert('Logout successful');
    // Additional actions upon logout, if needed, such as redirecting the user
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
