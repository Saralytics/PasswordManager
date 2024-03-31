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
  const [password_len, setPasswordLen] = useState(12); // Example default length
  const [has_upper_case, setHasUpperCase] = useState(true);
  const [has_lower_case, setHasLowerCase] = useState(true);
  const [has_digits, setHasDigits] = useState(true);
  const [has_symbols, setHasSymbols] = useState(true);


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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/vault/passwords/generate/`,{
        params: {
          password_len,
          has_upper_case,
          has_lower_case,
          has_digits,
          has_symbols
        },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button type="button" onClick={handleGeneratePassword}>Generate</button>
      <label>
        Len:
        <input
          type="number"
          value={password_len}
          onChange={(e) => setPasswordLen(e.target.value)}
          min="1" // Example minimum length
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={has_upper_case}
          onChange={(e) => setHasUpperCase(e.target.checked)}
        />
        Upper Case
      </label>
      <label>
        <input
          type="checkbox"
          checked={has_lower_case}
          onChange={(e) => setHasLowerCase(e.target.checked)}
        />
        Lower Case
      </label>
      <label>
        <input
          type="checkbox"
          checked={has_digits}
          onChange={(e) => setHasDigits(e.target.checked)}
        />
        Digits
      </label>
      <label>
        <input
          type="checkbox"
          checked={has_symbols}
          onChange={(e) => setHasSymbols(e.target.checked)}
        />
        Symbols
      </label>
    </div>
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
