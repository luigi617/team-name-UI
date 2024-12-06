import { Box, Typography, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import RoomCard from '../components/RoomCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  // const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_RECOMMENDATION_SERVICE}/streams`)
      .then(response => response.json())
      .then(data => {
        setStreams(data.results); 
      })
      .catch(err => {
        console.error('Error fetching streams:', err);
      });

    // fetch(`${process.env.REACT_APP_RECOMMENDATION_SERVICE}/videos`)
    //   .then(response => response.json())
    //   .then(data => {
    //     setVideos(data.results);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching videos:', err);
    //   });
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleStreamClick = (stream) => {
    navigate(`/room/${stream.streamerId}/${stream.sessionId}`);
  };

  // const handleRecordingClick = (recording) => {
  //   navigate(`/recording/${recording.recordingId}`);
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      <UserHeader />
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h4">Available Streams</Typography>
        <Button variant="contained" color="primary" onClick={handleLoginClick}>
          Login as Streamer
        </Button>
      </Box>

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
          <Box sx={{ bgcolor: '#cccccc' }} p={1}>
            League of Legends
          </Box>
          <Box sx={{ bgcolor: '#cccccc' }} p={1}>
            Just Chatting
          </Box>
          <Box sx={{ bgcolor: '#cccccc' }} p={1}>
            VALORANT
          </Box>
        </Box>

  
        <Box flex={1} padding={2} display="flex" flexDirection="column">
          <Typography variant="h5" style={{ marginBottom: '1rem' }}>
            Ongoing Streams
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={3}>
            {streams.map((item, index) => (
              <RoomCard
                key={`stream-${index}`}
                stream={item}
                onClick={() => handleStreamClick(item)} 
              />
            ))}
          </Box>

          {/* <Typography variant="h5" style={{ width: '100%', marginTop: '2rem' }}>
            Recordings
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {videos.map((item, index) => (
              <RoomCard
                key={`video-${index}`}
                stream={item}
                onClick={() => handleRecordingClick(item)} 
            ))}
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
