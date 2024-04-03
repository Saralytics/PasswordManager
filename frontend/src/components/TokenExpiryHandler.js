import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExpirationModal from './ExpirationModal';

const TokenExpiryHandler = () => {
    
    const { isAuthenticated, logout, showModal, hideModal , isModalOpen} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    
        if (!isAuthenticated) {
          // if not authenticated, disable polling
          return;
        };
        
        const checkTokenExpiry = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/token_expiry`, { withCredentials: true });
            const data = response.data;
            if (data.nearing_expiry) {
                // console.log("Your session is about to expire. Please log in again.");
                showModal()
                
                //auto logout timer
                let autoLogoutTimer;
                if (isModalOpen) {
                    // Set a timeout for auto-logout (e.g., 1 minute after the modal shows)
                    autoLogoutTimer = setTimeout(() => {
                    logout();
                    navigate('/login');
                    }, 30000); // 30 seconds
                }
                return () => clearTimeout(autoLogoutTimer); 
                // do a refresh after logging out
            }
          } catch (error) {
            console.error('Error:', error);
            // Handle the error appropriately
          }
        };// Poll every 10 seconds
        const intervalId = setInterval(checkTokenExpiry, 10000);
    
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, [isAuthenticated, logout, showModal, isModalOpen, navigate]);

    const handleLoginAgain = () => {
        hideModal()
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        hideModal()
        navigate('/login');
    };

    return (
        <ExpirationModal
        isOpen={isModalOpen}
        onLoginAgain={handleLoginAgain}
        onLogout={handleLogout}
        />
    );

};

export default TokenExpiryHandler;
