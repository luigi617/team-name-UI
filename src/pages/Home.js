import { Box } from '@mui/material';
import UserHeader from '../components/UserHeader';
import RoomCard from '../components/RoomCard';
import { useEffect, useState } from 'react';

function Home() {
  const [streams, setStreams] = useState([])

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

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
    }}
    >
      <UserHeader />
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
            streams.map((item, index) => <RoomCard key={index} stream={item} />)
          }
        </Box>
      </Box>
    </Box>
  )
}

export default Home
