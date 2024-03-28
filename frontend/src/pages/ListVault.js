import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/GetCookie';


function ListVault() {
    const csrfToken = getCookie('csrftoken');

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
          console.log(response)

        } catch (error) {
            console.error('Error occured while searching password:', error.response ? error.response.data : 'Unknown error');
        };

    }; 

    return (
        <form onSubmit={handleSubmit}>
      
      <div>
        <label htmlFor="website">Website URL:</label>
      </div>
      
      <button type="submit">List</button>
    </form>
    );

}

export default ListVault;
