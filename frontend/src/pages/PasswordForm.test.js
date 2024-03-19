/* eslint-disable import/first */
// input form validation:
// - submit with all empty fields
// - submit with 1 empty fields
// - submit with fields correctly

// Form submission:
// - Displays success message if the submision is a success (200 response)
// - Displays error message
// - Displays unauthorized message

// Generate password function

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and spread the actual library's exports
  useNavigate: () => jest.fn(), // Mock useNavigate with a jest function
}));
import axios from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StorePasswordForm from './PasswordForm';
import { BrowserRouter as Router } from 'react-router-dom';


describe('StorePasswordForm', () => {
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('when input fields are empty', async () => {
      render(
        <Router>
          <StorePasswordForm />
        </Router>);
      fireEvent.click(screen.getByText('Store Password'));
      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
      // add more detailed validation, fill in each field one by one and check for validation:
      // userEvent.type(screen.getByLabelText('Website URL:'), 'https://example.com');
      // fireEvent.click(screen.getByText('Store Password'));
    });
  
    it('generate password success', async () => {
      axios.get.mockResolvedValue({
        data: { password: 'autoGeneratedPassword' },
        status: 200,
      });
      
      render(<StorePasswordForm />);
      userEvent.click(screen.getByText('Generate'));
      // const passwordInput = screen.getByTestId('password-input');
      // expect(passwordInput.value).toBe('autoGeneratedPassword');
      const generatedPasswordDisplay = await screen.findByTestId('generated-password-display');
      expect(generatedPasswordDisplay).toHaveValue('autoGeneratedPassword');

    });
  
    it('generate password fails with error', async () => {
      axios.get.mockRejectedValue(new Error('Network error or any generic error message'));
      render(<StorePasswordForm />);
      userEvent.click(screen.getByText('Generate'));
      await screen.findByText('An error occured while storing the password.');
    });
  
    it('submits the form successfully', async () => {
      axios.post.mockResolvedValue({ data: { message: 'Password stored successfully' } });
      render(
      <Router>
        <StorePasswordForm />
      </Router>);
      userEvent.type(screen.getByLabelText('Website URL:'), 'https://example.com');
      userEvent.type(screen.getByLabelText('Username:'), 'user123');
      userEvent.type(screen.getByLabelText('Password:'), 'Password123!');
      fireEvent.click(screen.getByText('Store Password'));
      await screen.findByText('Password stored successfully');
    });
  
    // it('form submission fails with server error', async () => {
    //   mockAxios.onPost('http://localhost:8000/vault/passwords/create/').reply(500);
    //   render(<StorePasswordForm />);
    //   userEvent.type(screen.getByLabelText('Website URL:'), 'https://example.com');
    //   userEvent.type(screen.getByLabelText('Username:'), 'user123');
    //   userEvent.type(screen.getByLabelText('Password:'), 'Password123!');
    //   fireEvent.click(screen.getByText('Store Password'));
    //   await screen.findByText('An error occurred while storing the password.');
    // });
  
    // it('form submission unauthorized', async () => {
    //   mockAxios.onPost('http://localhost:8000/vault/passwords/create/').reply(403);
    //   render(<StorePasswordForm />);
    //   userEvent.type(screen.getByLabelText('Website URL:'), 'https://example.com');
    //   userEvent.type(screen.getByLabelText('Username:'), 'user123');
    //   userEvent.type(screen.getByLabelText('Password:'), 'Password123!');
    //   fireEvent.click(screen.getByText('Store Password'));
    //   await screen.findByText('You must be logged in to perform this action.');
    // });
  });
  