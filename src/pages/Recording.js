import { Box } from '@mui/material';
import UserHeader from '../components/UserHeader';
import TestVideo from '../assets/videos/test.mp4';
import CommentCard from '../components/CommentCard';

function Recording() {
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
        <Box flex={1} padding={2} display="flex" flexWrap="wrap">
          <Box flex={1}>
            <video src={TestVideo} style={{width: '100%'}} />
          </Box>
          <Box sx={{width: 250}}>
            <CommentCard />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Recording
