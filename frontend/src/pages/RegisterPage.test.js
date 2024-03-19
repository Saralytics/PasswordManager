/* eslint-disable import/first */
jest.mock('axios');
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './RegisterPage'; // Adjust the path as necessary

describe('Register Component', () => {
    beforeEach(() => {
      // Reset any previous mock calls
      axios.post.mockClear();
    });
  
    it('allows a user to fill in and submit the registration form successfully', async () => {
      axios.post.mockResolvedValue({ data: { message: 'Registration successful' } });
  
      render(<Register />);
  
      userEvent.type(screen.getByLabelText('Username'), 'testUser');
      userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      userEvent.type(screen.getByLabelText('Password'), 'password123');
  
      userEvent.click(screen.getByValue('Register'));
  
      await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/register/', {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
      }));
    });
  
    it('handles registration failure', async () => {
      axios.post.mockRejectedValue(new Error('Registration failed'));
  
      render(<Register />);
  
      userEvent.type(screen.getByLabelText('Username'), 'testUser');
      userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      userEvent.type(screen.getByLabelText('Password'), 'password123');
  
      userEvent.click(screen.getByValue('Register'));
  
      // Here you'd verify your error handling logic. This might involve checking for an error message displayed.
      // For example, if your component sets an error state and displays it:
      // await waitFor(() => expect(screen.getByText('Registration failed')).toBeInTheDocument());
    });
  });
  