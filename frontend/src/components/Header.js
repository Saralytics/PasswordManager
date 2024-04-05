import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; // Adjust this import path according to your project structure

const Header = () => {
  const { isAuthenticated } = useAuth(); // Use `useAuth` hook to access authentication state

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        {isAuthenticated ? (
          // Show these links if the user is authenticated
          <>
            <Link to="/search-password" style={linkStyle}>Search Password</Link>
            <Link to="/new-password" style={linkStyle}>New Password</Link>
            <Link to="/list-vault" style={linkStyle}>List Password</Link>
            <Link to="/logout" style={linkStyle}>Logout</Link>
          </>
        ) : (
          // Show these links if the user is not authenticated
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#005f73', // Example color, adjust as needed
  color: 'white',
  padding: '10px 0',
  textAlign: 'center'
};

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const linkStyle = {
  margin: '0 10px',
  color: 'white',
  textDecoration: 'none', // Removes underline from links
  // Add any additional styling here
};

export default Header;
