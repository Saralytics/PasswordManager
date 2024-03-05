import React from "react"
import { useAuth } from "../utils/AuthContext";

const HomePage = () => {
    const { isAuthenticated, userName } = useAuth();
  
    return (
      <div>
        {isAuthenticated ? (
          <p>Hi {userName}, you are logged in</p>
        ) : (
          <p>Welcome to Password Manager.</p>
        )}
      </div>
    );
  };

export default HomePage