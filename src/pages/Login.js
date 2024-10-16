import { Box, Button, Card, TextField } from '@mui/material';
import bgImage from '../assets/images/bg.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();

  const login = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <Card sx={{ width: 350, display: 'flex', flexDirection: 'column', padding: 2, gap: 2 }}>
        <h1>Login</h1>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          type="password"
          label="password"
          variant="outlined"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant="contained" disableElevation sx={{mb: 3}} onClick={login}>
          Login
        </Button>
      </Card>
    </Box>
  )
}

export default Login
