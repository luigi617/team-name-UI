import { Box, Typography, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import RoomCard from '../components/RoomCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Room from '../pages/Room.js';  

function Home() {
  const navigate = useNavigate();
  const [streams, setStreams] = useState([])
  const [selectedStream, setSelectedStream] = useState(null)


  useEffect(() => {
    // Fetch the list of available streams
    fetch(`${process.env.REACT_APP_STREAMING_SERVICE}/streams`)
      .then(response => response.json())
      .then(data => {
        setStreams(data.streams)
      }).catch(err => {
        console.log(err)
    })
  }, [])

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRoomClick = (stream) => {
    setSelectedStream(stream);
  };

  return (
    <Box sx={{
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

      <Box flex={1} display="flex" mt={8}>

        <Box display="flex" flexDirection="column" gap={2} width={250} borderRight="1px solid #e1e1e1" bgcolor="#fafafa" p={2}>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>League of Legends</Box>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>Just Chatting</Box>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>VALORANT</Box>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>Silent Hill 2</Box>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>Diablo IV</Box>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>Genshin Impact</Box>
          <Box sx={{bgcolor: '#cccccc'}} p={1}>Apex Legends</Box>
        </Box>

        <Box flex={1} padding={2} display="flex" flexWrap="wrap" gap={3}>
          {
            selectedStream ? (
              <Room streamerId={selectedStream.streamerId} sessionId={selectedStream.sessionId} />
            ) : (
              streams.map((item, index) => (<RoomCard key={index} stream={item} onClick={() => handleRoomClick(item)} />))
            )
          }
        </Box>

      </Box>
    </Box>
  )
}

export default Home
