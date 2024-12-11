import { Box, Typography, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
// import RoomCard from '../components/RoomCard';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(null); 
  const [filteredVideos, setFilteredVideos] = useState([]); 

  useEffect(() => {
    // const url = `${process.env.REACT_APP_GET_PAST_STREAM}/get_past_streams`;
    // console.log('Fetching data from URL:', url); // Log the URL to the console
  
    fetch(`${process.env.REACT_APP_GET_PAST_STREAM}/get_past_streams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        return response.json();
      })
      .then((data) => {
        setVideos(data.results || []); 
        setFilteredVideos(data.results || []); 
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos.');
        setLoading(false);
    });

    fetch(`${process.env.REACT_APP_GET_AVAILABLE_GAME_TAGS}/get_available_games`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      return response.json();
    })
    .then((data) => {
      setGames(data || []);
    })
    .catch((err) => {
      console.error('Error fetching games:', err);
    });
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleGameClick = (game) => {
    setSelectedGame(selectedGame === game ? null : game);
    if (game) {
      const filtered = videos.filter((video) => video.game === game.game);
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos); 
    }
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

      <Box flex={1} display="flex" mt={2}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          width={250}
          borderRight="1px solid #e1e1e1"
          bgcolor="#fafafa"
          p={2}
        >
          {games.length > 0 ? (
            games.map((game, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: selectedGame === game ? '#a2c2e0' : '#cccccc', 
                  padding: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: selectedGame !== game ? '#d3d3d3' : '#a2c2e0', 
                  },
                }}
                onClick={() => handleGameClick(game)} 
              >
                {game.game}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No available games
            </Typography>
          )}
        </Box>

  
        <Box flex={1} padding={2} display="flex" flexDirection="column">
          <Typography variant="h5" style={{ marginBottom: '1rem' }}>
            Ongoing Streams
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={3}>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((item, index) => (
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
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No videos available for this game
              </Typography>
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default Home;