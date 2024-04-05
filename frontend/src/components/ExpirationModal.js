import React from 'react';


function ExpirationModal({ isOpen, onLoginAgain, onLogout }) {
  if (!isOpen) return null;
  // Basic styling for the modal
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '20px',
    zIndex: 1000,
  };

  return (
    <div style={modalStyle}>
      <p>Your session is about to expire. Do you want to log in again?</p>
      <button onClick={onLoginAgain}>Login Again</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ExpirationModal;
