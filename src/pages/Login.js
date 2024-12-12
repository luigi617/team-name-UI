import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import LoginButton from '../components/LoginButton';

const LoginPage = () => {
  useEffect(() => {
    const handleAuthMessage = (event) => {
      try {
        // Log raw event data for debugging
        console.log('Received event data:', event);
  
        // Filter messages by source (popup window) or origin (backend server)
        const expectedOrigin = 'https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com'; 
        // const expectedOrigin = 'http://localhost:5001'; 
        if (event.origin !== expectedOrigin) {
          console.warn('Ignored message from unexpected origin:', event.origin);
          return;
        }
  
        const data = event.data; // Use event.data directly as it's already an object
  
        // Ensure required keys exist
        if (data.access_token && data.id_token && data.user_info) {
          // Store tokens and user info in cookies
          Cookies.set('access_token', data.access_token);
          Cookies.set('refresh_token', data.refresh_token);
          Cookies.set('id_token', data.id_token);
          Cookies.set('user_info', JSON.stringify(data.user_info)); // Store user_info as JSON string
  
          // Redirect to the target page
          if (data.redirect_after_login) {
            window.location.href = data.redirect_after_login;
          } else {
            console.error('No redirect_after_login provided.');
          }
        } else {
          console.error('Authentication data is incomplete:', data);
        }
      } catch (error) {
        console.error('Error processing authentication message:', error);
      }
    };
  
    // Add event listener for messages
    window.addEventListener('message', handleAuthMessage);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);
  

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
        <h2 style={{ color: '#6D4C41' }}>Not Logged In</h2>
        <p style={{ color: '#6D4C41' }}>Please log in to access your account.</p>
        <LoginButton/>
      </div>
    </div>
  );
};

export default LoginPage;
