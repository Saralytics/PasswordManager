// LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();
  let navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "Username is required";
    tempErrors.password = password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validate()) return;

    try {
      await login(username, password);
      navigate('/new-password'); // Redirect to a protected page or dashboard
      // console.log('Login successful');
    } catch (error) {
      setLoginError('Username or password is incorrect'); // Set login error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p>{errors.username}</p>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      {loginError && <p>{loginError}</p>}
      <button type="submit">Login</button>
    </form>
  );

};

export default LoginPage;