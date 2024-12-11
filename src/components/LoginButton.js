import React from 'react';

const LoginButton = ({ 
  loginUrl = 'https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/auth/login', 
//   loginUrl = 'http://localhost:5001/login', 
  buttonText = 'Start as Our User', 
  className = 'btn btn-primary' 
}) => {
  const handleLogin = () => {
    window.open(loginUrl, '_blank', 'width=500,height=600');
  };

  return (
    <button className={className} onClick={handleLogin}>
      {buttonText}
    </button>
  );
};

export default LoginButton;
