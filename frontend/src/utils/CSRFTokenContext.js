import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CSRFTokenContext = createContext();

export const CSRFTokenProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_csrf');
        setCsrfToken(response.data.csrfToken); // Set CSRF token in state/context
      } catch (error) {
        console.error('Failed to fetch CSRF token', error);
        // Handle error, for example, by setting an error state or retrying
      }
    };

    fetchCSRFToken();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <CSRFTokenContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CSRFTokenContext.Provider>
  );
};

export const useCSRFToken = () => useContext(CSRFTokenContext);
