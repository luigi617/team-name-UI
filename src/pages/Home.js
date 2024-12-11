import { Box, Typography, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_RECOMMENDATION_SERVICE}/videos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        return response.json();
      })
      .then((data) => {
        setVideos(data.results || []); // Handle cases where results might be undefined
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos.');
        setLoading(false);
      });
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <UserHeader />

      <Box flex={1} padding={2} display="flex" flexDirection="column">
        <Typography variant="h5" style={{ width: '100%', marginTop: '2rem' }}>
          Recordings
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {videos.map((item, index) => (
            <Box
              key={`video-${index}`}
              sx={{
                padding: 2,
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              <Link
                to={`/room?s=${item.streamer_id}&v=${item.session_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body1">Game: {item.game}</Typography>
                <Typography variant="body2">Streamer: {item.streamer_id}</Typography>
                <Typography variant="body2">Start Time: {item.start_time}</Typography>
                <Typography variant="body2">End Time: {item.end_time}</Typography>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
