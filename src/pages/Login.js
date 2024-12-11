import React from 'react';
import LoginButton from '../components/LoginButton'; // Import the LoginButton component

const LoginPage = () => {
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
        <p style={{ color: '#6D4C41' }}>You need to log in to access your account.</p>
        <LoginButton
          loginUrl="https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/auth/login" // Replace with your backend login URL
          buttonText="Start as Our User"
          className="btn btn-primary"
        />
      </div>
    </div>
  );
};

export default LoginPage;
