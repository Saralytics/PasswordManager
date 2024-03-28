import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; // Adjust this import path according to your project structure

const Header = () => {
  const { isAuthenticated } = useAuth(); // Use `useAuth` hook to access authentication state
  
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            // Show these links if the user is authenticated
            <>
              <li><Link to="/search-password">Search Password</Link></li>
              <li><Link to="/new-password">New Password</Link></li>
              <li><Link to="/list-vault">List Password</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </>
          ) : (
            // Show these links if the user is not authenticated
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
