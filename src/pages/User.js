import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserHome = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    fetch('http://localhost:5001/userHome', {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    })
      .then((response) => {
        if (response.redirected) {
          // If the backend redirects, navigate to the login page
          window.location.href = response.url; // Redirect the browser to the login page
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
