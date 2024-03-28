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
        try {
            const response = await axios.get('http://localhost:8000/vault/passwords/list',{
            withCredentials: true,
            headers: {
              'X-CSRFToken': csrfToken,
            }
          });
          console.log(response.data['vault']);
          setVault(response.data['vault']);

        } catch (error) {
            console.error('Error occured while searching password:', error.response ? error.response.data : 'Unknown error');
            setApiError(error.response.data);
        };

    }; 

    return (
        <form onSubmit={handleSubmit}>
      
        <div>
            <label htmlFor="website">Website URL:</label>
            <h1>Vault</h1>
            <ul>
                {vault.map((item) => (
                <li key={item.id}>
                    <div>Website: {item.website}</div>
                    <div>Username: {item.username}</div>
                    <div>Password: {item.password}</div>
                    <div>Created At: {item.created_at}</div>
                    <div>Updated At: {item.updated_at}</div>
                </li>
                ))}
            </ul>
        </div>
      
        <button type="submit">List</button>
        {apiError}
    </form>
    
    );

}

export default ListVault;
