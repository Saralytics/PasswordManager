import React, { useState } from 'react';

const PasswordItem = ({ item }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <li>
      <div>Website: {item.website}</div>
      <div>Username: {item.username}</div>
      <div>Password: {isVisible ? item.password : '••••••••'} <button onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'Hide' : 'Show'}</button></div>
      <div>Created At: {new Date(item.created_at).toLocaleString()}</div>
      <div>Updated At: {new Date(item.updated_at).toLocaleString()}</div>
    </li>
  );
};

export default PasswordItem;
