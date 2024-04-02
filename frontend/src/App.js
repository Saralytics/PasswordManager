import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import StorePasswordForm from "./pages/PasswordForm";
import LogoutButton from "./components/LogoutButton";
import ProtectedRoute from './components/ProtectedRoute';
import SearchPassword from "./pages/SearchPassword";
import ListVault from "./pages/ListVault";
import axios from 'axios';
import { useAuth } from './utils/AuthContext'; 


// import axios from "axios";
// import { useState } from "react";
import "./App.css";

function App() {

  const { isAuthenticated, setIsAuthenticated, logout } = useAuth();

  useEffect(() => {

    console.log(isAuthenticated);

    if (!isAuthenticated) {
      // if not authenticated, disable polling
      console.log('is not loged in.')
      return;
    };
    console.log('is logged in, will do polling.')
    const checkTokenExpiry = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/token_expiry`, { withCredentials: true });
        const data = response.data;
        console.log(data)
        if (data.nearing_expiry) {
          console.log("Your session is about to expire. Please log in again.");
          logout();
          // setIsAuthenticated(false);
          // For a more React-friendly navigation, consider using useNavigate hook from react-router-dom
          // This example uses window.location.href for simplicity
          // window.location.href = '/login'; // Redirect to login page
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle the error appropriately
      }
    };

    // Poll every 5 minutes
    const intervalId = setInterval(checkTokenExpiry, 10000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isAuthenticated, setIsAuthenticated, logout]);

  return (
    <div className="app">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search-password" element={
              <ProtectedRoute>
                <SearchPassword />
              </ProtectedRoute>
            } />
            <Route path="/new-password" element={
              <ProtectedRoute>
                <StorePasswordForm />
              </ProtectedRoute>
            } />
            <Route path="/list-vault" element={
              <ProtectedRoute>
                <ListVault />
              </ProtectedRoute>
            } />
            <Route path="/logout" element={
              <ProtectedRoute>
                <LogoutButton />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
    </div>
    
  );
}

export default App;

