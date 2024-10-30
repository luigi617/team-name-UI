import { Box, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import CommentCard from '../components/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';


const socket = io(`${process.env.REACT_APP_STREAMING_SERVICE}/stream`);
// Define the user ID (you can retrieve this from a login system)
const userId = 1;  // Replace with dynamic user ID

// Generate a unique stream ID
const streamId = parseInt(Date.now());

let mediaRecorder;

function Recording() {
  const videoRef = useRef();

  const [comments, setComments] = useState([])

  useEffect(() => {
    getMessage()
  }, [])

  const startStream = () => {
    socket.emit('start_stream', {
      user_id: userId,
      stream_id: streamId
    });
    Stream()
  }

  const stopStreaming = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      socket.emit('stop_stream', {
        user_id: userId,
        stream_id: streamId
      });
    }
  }

  const Stream = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        // Display the live preview
        videoRef.current.srcObject = stream;

        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm; codecs=vp8, opus'
        });

        // Handle data availability
        mediaRecorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) {
            // Convert Blob to ArrayBuffer
            event.data.arrayBuffer().then(buffer => {
              // Send the data along with the user ID and stream ID
              socket.emit('video_data', {
                user_id: userId,
                stream_id: streamId,
                data: buffer
              });
            });
          }
        };


        // Start recording with 100ms intervals
        mediaRecorder.start(1000);
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  }

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
            <Box display="flex" gap={1} justifyContent="center" mt={2}>
              <Button variant="contained" onClick={startStream}>Start Stream</Button>
              <Button variant="contained" onClick={stopStreaming}>Stop Stream</Button>
            </Box>
          </Box>
          <Box sx={{width: 250}} borderLeft="1px solid #e1e1e1">
            <CommentCard comments={comments} sendMessage={sendMessage} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Recording
