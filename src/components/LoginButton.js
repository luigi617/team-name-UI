import React from 'react';

const LoginButton = ({
  loginUrl = 'https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/auth/login',
  buttonText = 'Log In',
  className = 'btn btn-primary',
}) => {
  const handleLogin = () => {
    // Open a popup window for login
    window.open(loginUrl, '_blank', 'width=500,height=600');
  };

  return (
    <button 
    style={{
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '10px',
    }}
    className={className} 
    onClick={handleLogin}>
      {buttonText}
    </button>
  );
};

export default LoginButton;
