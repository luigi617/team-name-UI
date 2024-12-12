import { Box, Typography, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard'
import axios from 'axios';
function Home() {
  
  const [games, setGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(null); 
  const [liveStreamVideos, setLiveStreamVideos] = useState({}); 
  const [pastStreamVideos, setPastStreamVideos] = useState({}); 
  const [liveStreamVideosPage, setLiveStreamVideosPage] = useState(1); 
  const [pastStreamVideosPage, setPastStreamVideosPage] = useState(1); 

  // Generic fetch function to reduce redundancy
  const fetchVideos = async (type, page = 1, game = null) => {
    let url = type === 'past' ?
    `${process.env.REACT_APP_COMPOSITION_API}/get_past_streams` : 
    `${process.env.REACT_APP_COMPOSITION_API}/get_live_streams`;
    url += `?page=${page}`;
    if (game) {
      url += `&game=${encodeURIComponent(game)}`;
    }
    

    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        throw new Error('Failed to fetch videos');
      }
      const data = response.data;
      
      if (type === 'past') {
        setPastStreamVideos(data || []);
      } else {
        setLiveStreamVideos(data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${type} videos:`, err);
    }
  };

  const fetchAvailableGames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_COMPOSITION_API}/get_available_games`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch games');
      }
      const data = response.data;
      setGames(data["games"] || []);
      
    } catch (err) {
      console.error('Error fetching games:', err);
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
            <Box sx={{ marginBottom: '1rem' }} display="flex" justifyContent="space-between">
            <Typography variant="h5">
              Live Streams
            </Typography>
            <Box gap={3} display="flex">
              {liveStreamVideos["previous"] !== null &&
              <Typography
                  variant="h6"
                  onClick={() => { setLiveStreamVideosPage(liveStreamVideosPage-1); }}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.main', // Optional: Change the color on hover
                    }
                  }}
                >
                  Previous page
              </Typography>
              }
              {liveStreamVideos["next"] !== null &&
              <Typography
                  variant="h6"
                  onClick={() => { setLiveStreamVideosPage(liveStreamVideosPage+1); }}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.main', // Optional: Change the color on hover
                    }
                  }}
                >
                  Next page
              </Typography>
              }
            </Box>
          </Box>
        

            <Box display="flex" flexWrap="wrap" gap={3}>
              {liveStreamVideos["results"] != undefined && liveStreamVideos["results"].length > 0 ? (
                liveStreamVideos["results"].map((item, index) => (
                  <VideoCard
                  index={index}
                  title={item.title}
                  game={item.game}
                  streamer_id={item.streamer_id}
                  session_id={item.session_id}
                  isPastVideo={0}
                  ></VideoCard>
                  
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No live videos available for this game
                </Typography>
              )}
            </Box>
          </Box>
          <Box mt={4}>
          <Box sx={{ marginBottom: '1rem' }} display="flex" justifyContent="space-between">
            <Typography variant="h5">
              Past Videos
            </Typography>
            <Box gap={3} display="flex">
            {pastStreamVideos["previous"] !== null &&
              <Typography
                  variant="h6"
                  onClick={() => { setPastStreamVideosPage(pastStreamVideosPage-1); }}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.main', // Optional: Change the color on hover
                    }
                  }}
                >
                  Previous page
              </Typography>
            }
            {pastStreamVideos["next"] !== null &&
              <Typography
                  variant="h6"
                  onClick={() => { setPastStreamVideosPage(pastStreamVideosPage+1); }}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.main', // Optional: Change the color on hover
                    }
                  }}
                >
                  Next page
              </Typography>
            }
            </Box>
          </Box>

            <Box display="flex" flexWrap="wrap" gap={3}>
              {pastStreamVideos["results"] && pastStreamVideos["results"].length > 0 ? (
                pastStreamVideos["results"].map((item, index) => (
                  <VideoCard
                  index={index}
                  title={item.title}
                  game={item.game}
                  streamer_id={item.streamer_id}
                  session_id={item.session_id}
                  isPastVideo={1}
                  ></VideoCard>
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
