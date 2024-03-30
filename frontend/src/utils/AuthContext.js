// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve username from local storage on initial load
    const savedUsername = localStorage.getItem('username');
    if(savedUsername) {
      setUserName(savedUsername);
    }
    // Attempt to verify authentication status on app load
    verifyAuthStatus();
  }, []);

  const verifyAuthStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify`, { withCredentials: true });
      setIsAuthenticated(true);
      const { username } = response.data;
      setUserName(username);
      localStorage.setItem('username', username);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('username');
    }
  };

  const login = async (username, password) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/`, { username, password }, { withCredentials: true });
      setIsAuthenticated(true);
      setUserName(username);
      localStorage.setItem('username', username);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUserName('');
      localStorage.removeItem('username');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
