// StorePasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/GetCookie';


function StorePasswordForm() {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formError, setFormError] = useState(''); 
  const [apiError, setApiError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const csrfToken = getCookie('csrftoken');
  let navigate = useNavigate();

  const validateForm = () => {
    if (!website || !username || !password) {
      setFormError('All fields are required.');
      return false;
    }
    
    /* istanbul ignore next */
    setFormError(''); // Clear any previous error messages
    return true;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();
    try {
      // console.log('csrf token: ', csrfToken);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/vault/passwords/create/`, {
         website, username, password 
        },{
            withCredentials: true,
            headers: {
              'X-CSRFToken': csrfToken,
            }
          });
      console.log('Password stored successfully:', response.data);
      setSuccessMessage('Password stored successfully');
    } catch (error) {
      // if (error.response && error.response.status === 403) {
      //   setApiError('You must be logged in to perform this action.');
      //   // Redirect user to login page
      //   navigate('/login');
      // } else {
        // Handle other errors
        console.error('Error storing password:', error.response ? error.response.data : 'Unknown error');
        setApiError('An error occurred while storing the password.');
      }
  };

  const handleGeneratePassword = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/vault/passwords/generate/`, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      setGeneratedPassword(response.data.password); // The response has a password field
      setPassword(response.data.password); // Optionally auto-fill the password field with the generated password
    } catch (error) {
      /* istanbul ignore next */
      if (error.response && error.response.status === 403) {
        setApiError('You must be logged in to perform this action.')
        navigate('/login');
      } else {
        console.error('Error generating password:', error.response ? error.response.data : 'Unknown error');
        setApiError('An error occured while storing the password.');
      }
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      
      <div>
        <label htmlFor="website">Website URL:</label>
        <input
          id="website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
  
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleGeneratePassword}>Generate</button> {/* Generate button */}
      </div>
      {generatedPassword && ( // Display the generated password if available
        <div>
          <label htmlFor="generated-password-display">Generated Password:</label>
          <input
            name="generatedPassword"
            type="text"
            value={generatedPassword}
            readOnly
            data-testid="generated-password-display"
          />
          <button onClick={() => navigator.clipboard.writeText(generatedPassword)}>Copy</button> {/* Copy to clipboard button */}
        </div>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {formError && <div className="error">{formError}</div>}
      {apiError && <div className="error">{apiError}</div>}
      <button type="submit">Store Password</button>
    </form>
  );
}

export default StorePasswordForm;
