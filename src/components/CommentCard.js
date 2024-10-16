import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

export default function CommentCard() {

  const navigate = useNavigate();

  return (
    <Box height="100%" display="flex" flexDirection="column" justifyContent="space-between" padding={2} boxSizing="border-box">
      <Box display="flex" flexDirection="column" gap={1}>
        <Box textAlign="left">
          <span style={{fontWeight: 'bold'}}>User1</span>
          <span style={{fontSize: 14}}>:  I have 41 resolve and 18k HP but only do 3Trillion. Are perfect interdiction and Redirected that huge? I only have 10%/58% on those affixes</span>
        </Box>
        <Box textAlign="left">
          <span style={{fontWeight: 'bold'}}>User2</span>
          <span style={{fontSize: 14}}>:  you proc revenge with Hide @Rob2628 right?</span>
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <TextField id="comment" label="Send a message" variant="outlined" size="small" />
        <Box sx={{bgcolor: '#367fe8', padding: "6px", borderRadius: 1, color: 'white'}}>
          <SendIcon />
        </Box>
      </Box>
    </Box>
  );
}
