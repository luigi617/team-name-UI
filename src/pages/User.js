import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginButton from '../components/LoginButton.js'; // Import the LoginButton component

const UserHome = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // State for login popup
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    fetch('https://ck9gfyuz0d.execute-api.us-east-2.amazonaws.com/user'
    // fetch('http://localhost:5001/userHome'
    )
      .then((response) => {
        if (response.status === 401) {
          // Show login prompt if unauthorized
          setShowLoginPrompt(true);
          throw new Error('User not authenticated');
        } else if (response.redirected) {
          // Handle redirects
          window.location.href = response.url;
          throw new Error('Redirecting to login...');
        } else if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          return response.json();
        }
      })
      .then((data) => setUserData(data))
      .catch((err) => {
        if (err.message !== 'Redirecting to login...') {
          setError(err.message);
        }
      });
  }, [navigate]);

  if (showLoginPrompt) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4>Not Logged In</h4>
          <p>You need to log in to access your account.</p>
          <LoginButton /> {/* Use the LoginButton with default props */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Welcome, {userData.preferred_name || 'User'}!</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              {userData.photo_url ? (
                <img
                  src={userData.photo_url}
                  alt="User Profile"
                  className="img-fluid rounded-circle"
                />
              ) : (
                <div
                  className="bg-secondary text-white text-center rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px' }}
                >
                  <span style={{ fontSize: '2rem' }}>
                    {userData.preferred_name
                      ? userData.preferred_name.charAt(0).toUpperCase()
                      : 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="col-md-8">
              <h5>Email:</h5>
              <p>{userData.email}</p>
              <h5>User ID:</h5>
              <p>{userData.user_id}</p>
            </div>
          </div>
          <a href="http://localhost:5001/logout" className="btn btn-danger">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
