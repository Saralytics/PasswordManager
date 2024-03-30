import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/GetCookie';

// Custom hook for fetching passwords
const usePasswords = (url) => {
  const [data, setData] = useState({ passwords: [], isLoading: true, error: '' });

  useEffect(() => {
    const fetchPasswords = async () => {
      setData({ ...data, isLoading: true });
      try {
        const response = await axios.get(url, {
          withCredentials: true,
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
        });
        setData({ passwords: response.data.vault, isLoading: false, error: '' });
      } catch (error) {
        setData({
          passwords: [],
          isLoading: false,
          error: error.response ? error.response.data : 'Unknown error',
        });
      }
    };

    fetchPasswords();
  }, [url]);

  return data;
};

export default usePasswords;