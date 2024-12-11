import { Box, Typography, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(null); 
  const [liveStreamVideos, setLiveStreamVideos] = useState([]); 
  const [pastStreamVideos, setPastStreamVideos] = useState([]); 
  const [liveStreamVideosPage, setLiveStreamVideosPage] = useState(1); 
  const [pastStreamVideosPage, setPastStreamVideosPage] = useState(1); 

  // Generic fetch function to reduce redundancy
  const fetchVideos = async (type, page = 1, game = null) => {
    setLoading(true);
    setError(null);
    let url = type === 'past' ? process.env.REACT_APP_GET_PAST_STREAM : process.env.REACT_APP_GET_LIVE_STREAM;
    url += `?page=${page}`;
    if (game) {
      url += `&game=${encodeURIComponent(game)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      if (type === 'past') {
        setPastStreamVideos(data.results || []);
      } else {
        setLiveStreamVideos(data.results || []);
      }
    } catch (err) {
      console.error(`Error fetching ${type} videos:`, err);
      setError(`Failed to load ${type} videos.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableGames = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_GET_AVAILABLE_GAME_TAGS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data["games"] || []);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to load games.');
    }
  };

  useEffect(() => {
    fetchAvailableGames();
  }, []);

  // Fetch live videos when page or selectedGame changes
  useEffect(() => {
    fetchVideos('live', liveStreamVideosPage, selectedGame);
  }, [liveStreamVideosPage, selectedGame]);

  // Fetch past videos when page or selectedGame changes
  useEffect(() => {
    fetchVideos('past', pastStreamVideosPage, selectedGame);
  }, [pastStreamVideosPage, selectedGame]);

  const changeSelectedGame = (game) => {
    setSelectedGame(game);
    setLiveStreamVideosPage(1);
    setPastStreamVideosPage(1);
  };

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

      <Box flex={1} display="flex" mt={8}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          width={250}
          borderRight="1px solid #e1e1e1"
          bgcolor="#fafafa"
          p={2}
        >
          <Box
            key={-1}
            sx={{
              bgcolor: '#cccccc', 
              padding: 1,
              cursor: 'pointer',
            }}
            onClick={() => changeSelectedGame(null)} 
          >
            All Videos
          </Box>
          {games.map((game, index) => (
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
                onClick={() => changeSelectedGame(game)} 
              >
                {game}
              </Box>
            ))
          }
        </Box>

        <Box flex={1} padding={2} display="flex" flexDirection="column">
          <Box>
            <Typography variant="h5" style={{ marginBottom: '1rem' }}>
              Live Streams
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={3}>
              {liveStreamVideos.length > 0 ? (
                liveStreamVideos.map((item, index) => (
                  <Box
                    key={`live-video-${index}`}
                    sx={{
                      padding: 3,
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      minWidth: "200px"
                    }}
                  >
                    <Link
                      to={`/room?s=${item.streamer_id}&v=${item.session_id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body1">Game: {item.game}</Typography>
                      <Typography variant="body2">Streamer: {item.streamer_id}</Typography>
                    </Link>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No live videos available for this game
                </Typography>
              )}
            </Box>
          </Box>
          <Box mt={4}>
            <Typography variant="h5" style={{ marginBottom: '1rem' }}>
              Past Streams
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={3}>
              {pastStreamVideos.length > 0 ? (
                pastStreamVideos.map((item, index) => (
                  <Box
                    key={`past-video-${index}`}
                    sx={{
                      padding: 3,
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      minWidth: "200px"
                    }}
                  >
                    <Link
                      to={`/room?s=${item.streamer_id}&v=${item.session_id}`}
                      style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                    >
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body1">Game: {item.game}</Typography>
                      <Typography variant="body2">Streamer: {item.streamer_id}</Typography>
                    </Link>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No past videos available for this game
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
