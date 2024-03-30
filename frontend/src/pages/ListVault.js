import React, { useState } from 'react';
import usePasswords from '../hooks/usePasswords';
import PasswordItem from '../components/PasswordItem';

function ListVault() {
    const { passwords, isLoading, error } = usePasswords(`${process.env.REACT_APP_API_URL}/vault/passwords/list`);

    if (isLoading) {
        return <p>Loading passwords...</p>;
      }
  
    return (
      <div>
        <h1>Vault</h1>
        <button onClick={() => {}}>List Passwords</button> {/* This can be adapted based on actual use */}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {passwords.map((item) => (
            <PasswordItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    );
  }
  
  export default ListVault;
  