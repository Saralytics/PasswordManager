import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { AuthContext } from '../utils/AuthContext';

test('renders welcome message for unauthenticated users', () => {
  render(
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      <HomePage />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/Welcome to Password Manager./i)).toBeInTheDocument();
});

test('renders personalized greeting for authenticated users', () => {
  render(
    <AuthContext.Provider value={{ isAuthenticated: true, userName: 'John Doe' }}>
      <HomePage />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/Hi John Doe, you are logged in/i)).toBeInTheDocument();
});
