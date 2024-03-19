import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as AuthContext from '../utils/AuthContext';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../utils/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  test('when login credentials are empty', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Attempt to submit without filling out the form
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('handles login success', async () => {
    mockLogin.mockResolvedValueOnce(); // Mock login as successful

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Fill out the form and submit
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
    // expect(mockNavigate).toHaveBeenCalledWith('/new-password'); // Check if navigated correctly
  });

  test('displays an error message upon login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Username or password is incorrect'));
  
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Login'));
  
    expect(await screen.findByText('Username or password is incorrect')).toBeInTheDocument();
  });
  
  test('input fields update the component state', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    // Simulate user typing in the username and password fields
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpass' } });
  
    // Assert that the inputs' values have been updated
    expect(screen.getByLabelText('Username:').value).toBe('testuser');
    expect(screen.getByLabelText('Password:').value).toBe('testpass');
  });

  // Since `validate` is an internal function of the component, we indirectly test it through the UI effects it triggers.

  test('form validation displays error messages for empty fields', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Attempt to submit the form without filling in details
    fireEvent.click(screen.getByText('Login'));

    // Check for validation messages
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('form validation passes with correct input and removes error messages', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Fill out the form correctly
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'validpass' } });
    fireEvent.click(screen.getByText('Login'));

    // Assert that error messages are not present
    let errorMessages = screen.queryByText('Username is required') || screen.queryByText('Password is required');
    expect(errorMessages).not.toBeInTheDocument();
  });

});