import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    if (!username) {
      setFormError("username must not be empty");
      return false;
    } else if (!email.includes("@")) {
      setFormError("The email format is invalid");
      return false;
    } else if (password.length < 8){
      setFormError("Password length must be greater than or equal to 8");
      return false;
    } 
    setFormError('');
    return true;
     
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    isFormValid();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register/`, {
                  username,
                  email,
                  password,
                });
      console.log(response.data);
      setSuccessMessage("You have been registered successfully. Please log in.");
      
    } catch (error) {
      console.error(error);
      setErrorMessage("An error has occured")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {formError}
        <input type="submit" value="Register" disabled={isSubmitting}/>
        {errorMessage && successMessage}
      </form>
    </div>
  );
}

export default Register;
