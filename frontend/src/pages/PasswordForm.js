// StorePasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function StorePasswordForm() {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/vault/passwords/create/', {
         website, username, password 
        },{
            withCredentials: true
          });
      console.log('Password stored successfully:', response.data);
      alert('Password stored successfully');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Inform the user they need to log in
        alert('You must be logged in to perform this action.');
        // Redirect user to login page
        navigate('/login');
      } else {
        // Handle other errors
        console.error('Error storing password:', error.response ? error.response.data : 'Unknown error');
        alert('An error occurred while storing the password.');
      }
    }
  };


  const handleGeneratePassword = async () => {
    try {
      const response = await axios.get('http://localhost:8000/vault/passwords/generate/', {
        withCredentials: true
      });
      setGeneratedPassword(response.data.password); // The response has a password field
      setPassword(response.data.password); // Optionally auto-fill the password field with the generated password
    } catch (error) {
      console.error('Error generating password:', error.response ? error.response.data : 'Unknown error');
      alert('Failed to generate password. Please ensure you are logged in.');
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
      {/* <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div> */}
      {/* <button type="submit">Store Password</button> */}
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
          <label>Generated Password:</label>
          <input
            type="text"
            value={generatedPassword}
            readOnly
          />
          <button onClick={() => navigator.clipboard.writeText(generatedPassword)}>Copy</button> {/* Copy to clipboard button */}
        </div>
      )}
      <button type="submit">Store Password</button>
    </form>
  );
}

export default StorePasswordForm;
