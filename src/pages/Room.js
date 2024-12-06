import { Box, Typography } from '@mui/material';
import UserHeader from '../components/UserHeader';
import CommentCard from '../components/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import invalidVideo from '../assets/videos/test.mp4'
import Hls from 'hls.js';


function Room() {
  const videoRef = useRef();
  const [comments, setComments] = useState([])
  const [videoError, setVideoError] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const streamer_id = queryParams.get('s');
  const session_id = queryParams.get('v');
  
  let commentUrl = `${process.env.REACT_APP_COMMENT_SERVICE}/get_comments?streamerId=${streamer_id}&index=-1`;

  useEffect(() => {
    getMessage()
  }, [])

  useEffect(() => {
    videoRef.current.type = 'application/x-mpegURL';
    const video = videoRef.current;
    if (streamer_id && session_id && video) {
      const hls = new Hls();

      const streamUrl = `${process.env.REACT_APP_STREAMING_SERVICE}/watch/${streamer_id}/${session_id}/stream.m3u8`;

      if (Hls.isSupported()) {
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((err) => {
            console.error('Error attempting to play:', err);
          });
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS.js error:', data);
          setVideoError(true);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari and other native HLS support
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((err) => {
            console.error('Error attempting to play:', err);
          });
        });
      } else {
        // Fallback to a non-HLS player or display an error
        console.error('This browser does not support HLS.');
        setVideoError(true);
      }
      

      // Cleanup on unmount
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [streamer_id, session_id]);

  const getMessage = () => {
    fetch(commentUrl)
      .then(res => res.json())
      .then(res => {
        setComments(res)
        commentUrl = res["links"]["next"]
      }).catch((err) => {
      console.log(err)
    })
  }

  const sendMessage = (message) => {
    fetch(`${process.env.REACT_APP_COMMENT_SERVICE}/post_comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        comment: message,
        streamerId: streamer_id,
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

  const handleVideoError = () => {
    setVideoError(true);
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
      <Box flex={1} display="flex" mt={8}>
        <Box flex={1} padding={2} display="flex" flexWrap="wrap">
          <Box flex={1}>
            <video
            ref={videoRef}
            controls
            autoPlay={true}
            muted
            playsInline
            preload="auto"
            style={{width: '100%'}}
            onError={handleVideoError}
            >
            </video>
            {videoError && (
              <Typography color="error" variant="h6" sx={{ marginTop: 2 }}>
                Video failed to load. Please check the URL or try again later.
              </Typography>
            )}
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
