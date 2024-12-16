import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import LoginButton from '../components/LoginButton';

const LoginPage = () => {
  const [message, setMessage] = useState('Not Logged In'); // Display messages

  useEffect(() => {
    const handleAuthMessage = (event) => {
      try {
        console.log('Received event data:', event);

        const data = event.data;

        if (data.access_token && data.id_token && data.user_info) {
          // Store tokens and user info in cookies
          Cookies.set('access_token', data.access_token, { sameSite: 'None', secure: true });
          Cookies.set('refresh_token', data.refresh_token, { sameSite: 'None', secure: true });
          Cookies.set('id_token', data.id_token, { sameSite: 'None', secure: true });
          Cookies.set('user_id', JSON.stringify(data.user_info.user_id), { sameSite: 'None', secure: true });
          Cookies.set('email', JSON.stringify(data.user_info.email), { sameSite: 'None', secure: true });  
          
          Cookies.set('user_info', JSON.stringify(data.user_info), { sameSite: 'None', secure: true });
          // Update message
          setMessage('You are logged in!');
        } else {
          console.error('Authentication data is incomplete:', data.access_token);
        }
      } catch (error) {
        console.error('Error processing authentication message:', error);
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const refreshCredential = async () => {
    try {
      const response = await fetch('https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/auth/getcredential', {
      // const response = await fetch('http://localhost:5001/auth/getcredential', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (response.status === 401) {
        console.warn('Unauthorized: No action taken.');
        setMessage('Unauthorized: Please log in again.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch credentials: ${response.status}`);
      }

      const data = await response.json();

      // Set credentials in cookies
      Cookies.set('access_token', data.access_token, { sameSite: 'None', secure: true });
      Cookies.set('id_token', data.id_token, { sameSite: 'None', secure: true });
      Cookies.set('refresh_token', data.refresh_token, { sameSite: 'None', secure: true });
      Cookies.set('user_info', JSON.stringify(data.user_info), { sameSite: 'None', secure: true });
      Cookies.set('user_id', JSON.stringify(data.user_info.user_id), { sameSite: 'None', secure: true });
      Cookies.set('email', JSON.stringify(data.user_info.email), { sameSite: 'None', secure: true });  
      // Update message
      setMessage('Credentials refreshed. You are logged in!');
    } catch (error) {
      console.error('Error refreshing credentials:', error);
      setMessage('Error refreshing credentials. Please try again.');
    }
  };

  const navigateToUserHome = () => {
    window.location.href = '/user'; 
  };

  return (
    <div className="container mt-5 text-center">
      <div
        style={{
          backgroundColor: '#FFF7D6',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px',
          margin: '50px auto',
        }}
      >
        <h2 style={{ color: '#6D4C41' }}>{message}</h2>
        <div>
          <p style={{ color: '#6D4C41' }}>
            Use the buttons below to log in, refresh credentials, or access your account.
          </p>
          <LoginButton />
          <button
            onClick={refreshCredential}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px',
            }}
          >
            Refresh Credential
          </button>
          <button
            onClick={navigateToUserHome}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px',
            }}
          >
            Go to User Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
