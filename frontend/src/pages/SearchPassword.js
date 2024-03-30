import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/GetCookie';


function SearchPassword() {
  const [website, setWebsite] = useState('');
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [returnedPassword, setReturnedPassword] = useState('');
  const [formError, setFormError] = useState(''); 
  const [apiError, setApiError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const csrfToken = getCookie('csrftoken');
  // let navigate = useNavigate();

  const validateForm = () => {
    if (!website) {
      setFormError('The website url is required.');
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
      const response = await axios.post('http://localhost:8000/vault/passwords/search', {
         website
        },{
            withCredentials: true,
            headers: {
              'X-CSRFToken': csrfToken,
            }
          });
      console.log('Search successful', response.data);
      setReturnedPassword(response.data['password'])
      setSuccessMessage('Password returned successfully');
    } catch (error) {
      
        console.error('Error occured while searching password:', error.response ? error.response.data : 'Unknown error');
        setApiError('An error occurred while storing the password.');
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
      
      {returnedPassword && ( // Display the generated password if available
        <div>
          <label htmlFor="generated-password-display">Your saved password for this website is: </label>
          <input
            name="generatedPassword"
            type="text"
            value={returnedPassword}
            readOnly
            data-testid="generated-password-display"
          />
          <button onClick={() => navigator.clipboard.writeText(returnedPassword)}>Copy</button> {/* Copy to clipboard button */}
        </div>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {formError && <div className="error">{formError}</div>}
      {apiError && <div className="error">{apiError}</div>}
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchPassword;
