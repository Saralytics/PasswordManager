// Mock the AuthContext: Since LogoutButton relies on the useAuth hook, create a mock of this hook that mimics its functionality, especially the logout method.

// Test the Logout Behavior: Verify that clicking the button calls the logout method and triggers any expected UI changes or alerts.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { useAuth } from '../utils/AuthContext';

// Mock the useAuth hook
jest.mock('../utils/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('LogoutButton Component', () => {
  it('calls logout on button click', async () => {
    // Setup mock logout function
    const mockLogout = jest.fn();
    useAuth.mockImplementation(() => ({
      logout: mockLogout
    }));

    // Render the LogoutButton with the mocked context
    render(<LogoutButton />);

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    // Expect the mockLogout to have been called
    expect(mockLogout).toHaveBeenCalled();

    // Optionally check for alert or UI changes, though testing alert is not directly supported by RTL
  });
});
