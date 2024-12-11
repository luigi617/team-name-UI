




import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import placeholderImage from '../assets/images/placeholder.jpg'

export default function VideoCard({ index, title, game, streamer_id, session_id, isPastVideo }) {
    const coverUrl = `${process.env.REACT_APP_STREAMING_SERVICE}/cover/${streamer_id}/${session_id}/x`;
    
  return (
    <Box
        key={`${streamer_id}-${session_id}-${index}`}
        sx={{
            padding: 3,
            border: '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': {
            backgroundColor: '#f0f0f0',
            },
            minWidth: "200px"
        }}
        >
        <Link
            to={`/room?s=${streamer_id}&v=${session_id}&x=${isPastVideo}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <img 
            src={coverUrl}
            style={{maxWidth: '150px', maxHeight: '150px'}}
            alt="Cover" 
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
              }}
            />
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1">Game: {game}</Typography>
            <Typography variant="body2">Streamer: {streamer_id}</Typography>
        </Link>
    </Box>
  );
}
