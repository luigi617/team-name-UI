import React from 'react';

const LoginButton = ({
  loginUrl = 'https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/auth/login',
  // loginUrl = 'http://localhost:5001/login',
  buttonText = 'Log In',
  className = 'btn btn-primary',
}) => {
  const handleLogin = () => {
    // Open a popup window for login
    window.open(loginUrl, '_blank', 'width=500,height=600');
  };

  return (
    <button className={className} onClick={handleLogin}>
      {buttonText}
    </button>
  );
};

export default LoginButton;
