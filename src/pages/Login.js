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
          axios.get("https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/dev/get_live_streams", {
            withCredentials: true  // Correct option to send credentials with the request
          })
            .then((response) => {
              console.log("Data fetched successfully:", response.data);  // Log the actual data from the response
            })
            .catch((error) => {
              console.error("Error fetching live streams:", error);  // Handle any errors
            });
        }}>nihao2</button>
        <button onClick={() => {
          console.log(Cookies.get("user_info"))
          axios.get("https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/dev/get_available_games")
            .then((response) => {
              // Log the actual data from the response object
              console.log(response.data);
            })
            .catch((error) => {
              // Handle errors (network issues, server errors, etc.)
              console.error("Error fetching available games:", error);
            });
        }}>nihao1</button>
      </div>
    </div>
  );
};

export default LoginPage;
