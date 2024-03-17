import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage'; // Adjust the path based on your project structure
import { useAuth } from '../utils/AuthContext';


// Mocking useNavigate and useAuth
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
    useNavigate: jest.fn(),
  }));
  
jest.mock('../utils/AuthContext', () => ({
useAuth: () => ({
    login: jest.fn(),
}),
}));
  
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('LoginPage Tests', () => {
    test('displays error messages for empty inputs', async () => {
      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );
  
      const loginButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(loginButton);
  
      // Assert that validation messages are displayed
      await waitFor(() => {
        expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
      
    });
});