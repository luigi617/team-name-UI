import { Box, Button } from '@mui/material';
import UserHeader from '../components/UserHeader';
import CommentCard from '../components/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

function getAccessToken() {
  return localStorage.getItem('access_token');
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}



function Recording() {
  const socket = io(`${process.env.REACT_APP_STREAMING_SERVICE}/stream`, {
    query: {
        access_token: getAccessToken(),
        refresh_token: getRefreshToken(),
    },
  });
  let mediaRecorder;
  const videoRef = useRef();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const userId = queryParams.get('s');
  const streamId = queryParams.get('v');

  const [comments, setComments] = useState([])

  useEffect(() => {
    getMessage()
    startStream()
  }, [])

  const startStream = () => {
    socket.emit('start_stream', {
      user_id: userId,
      stream_id: streamId
    });
    Stream()
  }

  const stopStreaming = async () => {
    try {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        socket.emit('stop_stream');
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());  // Stop all tracks
        videoRef.current.srcObject = null;  // Clear the video source
      }
    } catch (error) {
      console.error("Error stopping the stream: ", error);
    }


    const data = {
      streamer_id: userId,
      session_id: streamId,
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_COMPOSITION_API}/end_stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // specify the content type
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }
      const result = await res.json();
    } catch (err) {
      console.error('Error:', err);
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
        mediaRecorder.start(1000);
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  }

  const getMessage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_COMMENT_SERVICE}/comments/request/1`);
      
      // Check for a successful response
      if (response.status !== 200) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = response.data;  // Axios already parses the response to JSON
      
      setComments(data)
    } catch (err) {
      console.log(err)
    }
  }

  const sendMessage = async (message) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_COMMENT_SERVICE}/comments/upload`);
      
      // Check for a successful response
      if (response.status !== 200) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = response.data;  // Axios already parses the response to JSON
      
      getMessage()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    >
      <UserHeader />
      <Box flex={1} padding={2} display="flex" flexWrap="wrap" mt={8} height="100%">
          <Box flex={1}>
            <video ref={videoRef} autoPlay playsInline style={{height: '100%'}} />
          </Box>
          <Box sx={{width: 250}} borderLeft="1px solid #e1e1e1">
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" onClick={stopStreaming}>Stop Stream</Button>
            </Box>
            <CommentCard comments={comments} sendMessage={sendMessage} canSendMessage={false}/>
          </Box>
      </Box>
    </Box>
  )
}

export default Recording


