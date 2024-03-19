import React, { createContext, useContext, useState } from 'react';

const CSRFTokenContext = createContext();

export const CSRFTokenProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState('');

  return (
    <CSRFTokenContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CSRFTokenContext.Provider>
  );
};

export const useCSRFToken = () => useContext(CSRFTokenContext);
