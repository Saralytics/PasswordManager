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

  test('validates inputs correctly', async () => {
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
  

});