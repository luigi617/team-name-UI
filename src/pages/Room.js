import { Box, Typography } from '@mui/material';
import UserHeader from '../components/UserHeader';
import CommentCard from '../components/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hls from 'hls.js';
import VideoCard from '../components/VideoCard';
import axios from 'axios';

function Room() {
  const videoRef = useRef();
  const [comments, setComments] = useState([])
  const [videoError, setVideoError] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user_id = "current tmp user id"
  const streamer_id = queryParams.get('s');
  const session_id = queryParams.get('v');

  const isPastVideo = queryParams.get('x');
  const [recommendationVideo, setRecommendationVideo] = useState([])
  
  // let commentUrl = `${process.env.REACT_APP_COMMENT_SERVICE}/get_comments?streamerId=${streamer_id}&index=-1`;
  // const sendMessageUrl = 'http://18.219.53.163:5000/post_comment'
  const sendMessageUrl = `${process.env.REACT_APP_COMPOSITION_API}/post_comment`; // Replace with your actual endpoint URL
  
  const [comemntUrl, setCommentUrl] = useState(`${process.env.REACT_APP_COMPOSITION_API_MAJOR}/get_comments?streamerId=${session_id}&index=0&limit=3`);
  const commentRef = useRef([]);
  const commentUrlRef = useRef(comemntUrl);
  useEffect(() => {
    console.log("Actual URL replacement got called for rerender");
    commentUrlRef.current = comemntUrl;
    setComments((comments) => [...comments, ...commentRef.current]);
  },[comemntUrl]);
  useEffect(() => {
    getMessage()
    getRecommendation()
  }, []);

  const getRecommendation = async () => {
    
    if (isPastVideo == 1){
      try {
        const response = await axios.get(`${process.env.REACT_APP_COMPOSITION_API}/get_user_video_recommendations?user=${'luigi'}`);
        if (response.status != 200) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.data;
        setRecommendationVideo(data["data"])
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    }
  }

  function replaceUrl(url) {
    // Parsing the original URL
    const parsedUrl = new URL(url);

    // Setting the new hostname, protocol, and removing the port
    parsedUrl.protocol = 'https';
    parsedUrl.hostname = 'ck9gfyuz0d.execute-api.us-east-2.amazonaws.com';
    parsedUrl.port = ''; // Removing the port

    // Adjusting the index query parameter
    const index = parsedUrl.searchParams.get('index');
    if (index === '1') {
        parsedUrl.searchParams.set('index', '0');
    }

    // Returning the modified URL as a string
    return parsedUrl.toString();
}

  const getMessage = async () => {

    console.log("Here is the url", comemntUrl)
    const intervalId = setInterval(() => {
      fetch(commentUrlRef.current)
        .then(res => res.json())
        .then(res => {
          console.log("Before replace url", res.links.next)
          const newUrl = replaceUrl(res.links.next);
          console.log(newUrl,"New Url Here");
          console.log("New Url",newUrl);
          console.log("commentUrlRef.current",commentUrlRef.current);
          console.log("comemntUrl", comemntUrl);
          console.log("comments",comments);
          if (commentUrlRef.current !== newUrl && commentUrlRef.current === comemntUrl) { 
            console.log("Updating, with comments", res.comments);
            // setCommentUrl(newUrl);
            setCommentUrl(newUrl);
            commentRef.current = res.comments;
            console.log("Break point 1", commentUrlRef.current);
            // setComments((comments) => [...comments, res.comments]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 10000);
    return () => clearInterval(intervalId);
  };


  useEffect(() => {
    videoRef.current.type = 'application/x-mpegURL';
    const video = videoRef.current;
    if (streamer_id && session_id && video) {
      var hls;
      
      if (isPastVideo === 1) {
        hls = new Hls();
      } else {
        hls = new Hls({
          liveSyncDuration: 3, // Aim to be within 3 seconds of the live edge
          liveMaxLatencyDuration: 6, // Maximum latency of 6 seconds
          maxBufferLength: 6, // Buffer up to 6 seconds
          maxMaxBufferLength: 12, // Absolute max buffer length
        });
      }

      const streamUrl = `${process.env.REACT_APP_STREAMING_SERVICE}/watch/${streamer_id}/${session_id}/stream.m3u8`;
      console.log(streamUrl);
      
      if (Hls.isSupported()) {
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((err) => {
            console.error('Error attempting to play:', err);
          });
        });
        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Seek to live edge when a new fragment is loaded
          const liveSyncPosition = hls.liveSyncPosition;
          
          if (isPastVideo == 0 && liveSyncPosition && Math.abs(video.currentTime - liveSyncPosition) > 1) {
            video.currentTime = liveSyncPosition;
            console.log(`Seeking to live edge at ${liveSyncPosition} seconds`);
          }
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error encountered, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error encountered, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                setVideoError(true);
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((err) => {
            console.error('Error attempting to play:', err);
          });
        });
      } else {
        console.error('This browser does not support HLS.');
        setVideoError(true);
      }
      
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [streamer_id, session_id]);

  // const getMessage = () => {
  //   axios.get(commentUrl)
  //     .then(res => res.json())
  //     .then(res => {
  //       setComments(res)
  //       commentUrl = res["links"]["next"]
  //     }).catch((err) => {
  //     console.log(err)
  //   })
  // }

  // const sendMessage = (message) => {
  //   axios.post(`${process.env.REACT_APP_COMMENT_SERVICE}/post_comment`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       comment: message,
  //       streamerId: streamer_id,
  //     },
  //     body: JSON.stringify({})
  //   })
  //     .then(res => res.json())
  //     .then(res => {
  //       getMessage()
  //     }).catch((err) => {
  //     console.log(err)
  //   })
  // }

  async function sendMessage(comment) {
    console.log("Message sending now, with url",sendMessageUrl, session_id, comment)
    const data = { session_id: session_id, comment: comment, user_id: user_id};
  
    try {
      const response = await fetch(sendMessageUrl, {
        method: 'POST',
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      console.log(result); // Handle the response as needed
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
            style={{
              height: '100%',
              width: '100%',
              maxHeight: "calc(100vh - 100px)"
            }}
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
            {isPastVideo == 0 ?
            <CommentCard comments={comments} sendMessage={sendMessage} />
            :
              recommendationVideo.map((item, index) => (
                <Box m={2}>
                <VideoCard
                index={index}
                title={item.title}
                game={item.game}
                streamer_id={item.streamer_id}
                session_id={item.session_id}
                isPastVideo={1}
                width='100%'
                ></VideoCard>
                </Box>
                ))
          }
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Room
