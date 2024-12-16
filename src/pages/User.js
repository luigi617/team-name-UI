import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cookies available in the browser:", document.cookie);
    // Fetch user data from the backend
    fetch(`${process.env.REACT_APP_AUTH_API}/userHome`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 401) {
          navigate('/login');
          throw new Error('User not authenticated');
        } else if (response.redirected) {
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

  if (error) {
    return (
      <div style={{ margin: '20px', textAlign: 'center', color: 'red' }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ margin: '20px', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '4px solid #ddd', borderTop: '4px solid #4caf50', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
      <h3 style={{ color: '#4caf50' }}>Welcome, {userData.preferred_name || 'User'}!</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
        {userData.photo_url ? (
          <img
            src={userData.photo_url}
            alt="User Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        ) : (
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#ccc',
              color: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            {userData.preferred_name
              ? userData.preferred_name.charAt(0).toUpperCase()
              : 'U'}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <h5>Email:</h5>
        <p>{userData.email}</p>
        <h5>User ID:</h5>
        <p>{userData.user_id}</p>
      </div>
      <a
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#5bc0de', 
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        Enter Streaming App ~
      </a>
      <a
        href={`${process.env.REACT_APP_AUTH_API}/logout`}
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#d9534f',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        Logout
      </a>
    </div>
  );
};

export default User;
