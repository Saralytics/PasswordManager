import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage'; // Adjust the path based on your project structure
import { useAuth } from '../utils/AuthContext';
import { act } from 'react-dom/test-utils';


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
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        userEvent.click(loginButton);
      });
  
      // Assert that validation messages are displayed
        expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    });
});


// test('calls login with correct credentials', async () => {
//     const mockLogin = jest.fn();
//     jest.spyOn(authContext, 'useAuth').mockReturnValue({ login: mockLogin });
//     const mockNavigate = jest.fn();
//     jest.mocked(useNavigate).mockImplementation(() => mockNavigate);

//     render(
//       <MemoryRouter>
//         <LoginPage />
//       </MemoryRouter>
//     );

//     // Simulate user input
//     await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
//     await userEvent.type(screen.getByLabelText(/password/i), 'password');

//     // Simulate form submission
//     fireEvent.click(screen.getByRole('button', { name: /login/i }));

//     // Wait for the login function to be called
//     await waitFor(() => {
//       expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
//     });
//   });

//   test('navigates to new-password on successful login', async () => {
//     const mockLogin = jest.fn().mockResolvedValue(true);
//     jest.spyOn(authContext, 'useAuth').mockReturnValue({ login: mockLogin });
//     const mockNavigate = jest.fn();
//     jest.mocked(useNavigate).mockImplementation(() => mockNavigate);

//     render(
//       <MemoryRouter>
//         <LoginPage />
//       </MemoryRouter>
//     );

//     // Fill out and submit form
//     await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
//     await userEvent.type(screen.getByLabelText(/password/i), 'mypassword');
//     userEvent.click(screen.getByRole('button', { name: /login/i }));

//     // Assert navigation to new-password page
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/new-password');
//     });
//   });

//   test('displays error on login failure', async () => {
//     window.alert = jest.fn(); // Mock window.alert for testing
//     const mockLogin = jest.fn().mockRejectedValue(new Error('Login failed'));
//     jest.spyOn(authContext, 'useAuth').mockReturnValue({ login: mockLogin });

//     render(
//       <MemoryRouter>
//         <LoginPage />
//       </MemoryRouter>
//     );

//     // Simulate form submission with the login button
//     await userEvent.type(screen.getByLabelText(/username/i), 'wronguser');
//     await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
//     userEvent.click(screen.getByRole('button', { name: /login/i }));

//     // Assert alert is called
//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('Username or password is incorrect');
//     });
//   });
// });