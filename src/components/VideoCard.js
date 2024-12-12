




import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import placeholderImage from '../assets/images/placeholder.jpg'

export default function VideoCard({ index, title, game, streamer_id, session_id, isPastVideo, width="250px" }) {
    // const coverUrl = `${process.env.REACT_APP_COMPOSITION_API}/get_video_cover?streamer_id=${streamer_id}&session_id=${session_id}`;
    const coverUrl = `${process.env.REACT_APP_STREAMING_SERVICE}/cover/${streamer_id}/${session_id}/x`;
  return (
    <Box
        key={`${streamer_id}-${session_id}-${index}`}
        sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': {
            backgroundColor: '#f0f0f0',
            },
            width: width
        }}
        >
        <Link
            to={`/room?s=${streamer_id}&v=${session_id}&x=${isPastVideo}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <img 
            src={coverUrl}
            style={{minWidth: '100%', maxHeight: '150px', objectFit: "cover"}}
            alt="Cover" 
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
              }}
            />
            <Typography sx={{px: "5px"}} variant="h6">{title}</Typography>
            <Typography sx={{px: "5px"}} variant="body1">Game: {game}</Typography>
            <Typography sx={{px: "5px"}} variant="body2">Streamer: {streamer_id}</Typography>
        </Link>
    </Box>
  );
}
