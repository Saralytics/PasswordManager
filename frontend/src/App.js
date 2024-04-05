import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import StorePasswordForm from "./pages/PasswordForm";
import LogoutButton from "./components/LogoutButton";
import ProtectedRoute from './components/ProtectedRoute';
import SearchPassword from "./pages/SearchPassword";
import ListVault from "./pages/ListVault";
import TokenExpiryHandler from "./components/TokenExpiryHandler";
import "./App.css";


function App() {

  return (
    <div className="app">
        <Router>
          <Header />
          <TokenExpiryHandler/>
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

