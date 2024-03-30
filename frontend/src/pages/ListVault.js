import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/GetCookie';


function ListVault() {
    const csrfToken = getCookie('csrftoken');
    const [vault, setVault] = useState([]);
    const [apiError, setApiError ] = useState('');

    // function calls api
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(''); // clear previous error messages
        try {
            const response = await axios.get('http://localhost:8000/vault/passwords/list',{
            withCredentials: true,
            headers: {
              'X-CSRFToken': csrfToken,
            }
          });
          setVault(response.data['vault']);

        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'Unknown error';
            setApiError(errorMessage);
        };

    }; 

    const renderErrorMessage = () => (
        <div style={{ color: 'red' }}>
          {apiError}
        </div>
      );

    return (
        <form onSubmit={handleSubmit}>
          <div>
            <h1>Vault</h1>
            {vault.length > 0 ? (
              <ul>
                {vault.map((item) => (
                  <li key={item.id}>
                    <div>Website: {item.website}</div>
                    <div>Username: {item.username}</div>
                    {/* Consider obscuring sensitive information */}
                    <div>Password: {item.password}</div>
                    <div>Created At: {new Date(item.created_at).toLocaleString()}</div>
                    <div>Updated At: {new Date(item.updated_at).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Today is a good day</p>
            )}
          </div>
          <button type="submit">List Passwords</button>
          {apiError && renderErrorMessage()}
        </form>
      );

}

export default ListVault;
