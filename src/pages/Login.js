import React from 'react';
import LoginButton from '../components/LoginButton'; // Import the LoginButton component
import Cookies from 'js-cookie';
import axios from 'axios';

const LoginPage = () => {
  Cookies.set("test", 1324)
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
        <button onClick={() => {
          console.log(Cookies.get("user_info"))
          axios.get("https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/dev/get_live_streams",
            {
              credentials: 'include'
            }
          ).then((data) => {console.log(123)})
        }}>nihao2</button>
        <button onClick={() => {
          console.log(Cookies.get("user_info"))
          axios.get("http://18.118.170.174:5001/test",
            {
              withCredentials: true
            }
          ).then((data) => {console.log(data.data)})
        }}>nihao1</button>
      </div>
    </div>
  );
};

export default LoginPage;
