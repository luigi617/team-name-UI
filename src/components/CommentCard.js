import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function CommentCard({ comments, sendMessage, canSendMessage=true }) {
  const [message, setMessage] = useState("")

  const navigate = useNavigate();

  return (
    <Box height="100%" display="flex" flexDirection="column" justifyContent="space-between" padding={2} boxSizing="border-box">
      <Box display="flex" flexDirection="column" gap={1}>
        {
          comments.map(comment => (
            <Box key={comment.id} textAlign="left">
              <span style={{fontWeight: 'bold'}}>User {comment.userId}</span>
              <span style={{fontSize: 14}}>:  {comment.Comment}</span>
            </Box>
          ))
        }
      </Box>
      {canSendMessage && 
      <Box display="flex" alignItems="center">
        <TextField id="comment" label="Send a message" variant="outlined" size="small" value={message} onChange={e => setMessage(e.target.value)} />
        <Box sx={{bgcolor: '#367fe8', padding: "6px", borderRadius: 1, color: 'white'}} onClick={() => {
          if (message) {
            console.log("Deteceted message in console sendding it", message)
            sendMessage(message)
            setMessage('')
          }
        }}>
          <SendIcon />
        </Box>
      </Box>
      }
    </Box>
  );
}
