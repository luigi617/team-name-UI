import { Box } from '@mui/material';
import UserHeader from '../components/UserHeader';
import CommentCard from '../components/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';


function Room() {
  const videoRef = useRef();
  const [comments, setComments] = useState([])

  const { streamPath } = useParams();

  useEffect(() => {
    getMessage()
  }, [])

  useEffect(() => {
    if (streamPath && videoRef.current) {
      videoRef.current.src = `${process.env.REACT_APP_STREAMING_SERVICE}/watch/${streamPath.split("/")[0]}/${streamPath.split("/")[1]}/stream.m3u8`;
      videoRef.current.type = 'application/x-mpegURL';
    }
  }, [streamPath, videoRef])

  const getMessage = () => {
    fetch(`${process.env.REACT_APP_COMMENT_SERVICE}/comments/request/1`)
      .then(res => res.json())
      .then(res => {
        setComments(res)
      }).catch((err) => {
      console.log(err)
    })
  }

  const sendMessage = (message) => {
    fetch(`${process.env.REACT_APP_COMMENT_SERVICE}/comments/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        comment: message,
        userId: 1,
        targetId: 2,
      },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(res => {
        getMessage()
      }).catch((err) => {
      console.log(err)
    })
  }


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
            <video ref={videoRef} autoPlay playsInline style={{width: '100%'}} />
          </Box>
          <Box sx={{width: 250}} borderLeft="1px solid #e1e1e1">
            <CommentCard comments={comments} sendMessage={sendMessage} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Room
