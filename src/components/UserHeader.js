import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assets/images/logo.jpg';
import { useNavigate } from 'react-router-dom';
import placeholder from '../assets/images/2.jpg'

const settings = ['Start Streaming', 'Logout'];

function UserHeader() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();

  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  

  const handleCloseUserMenu = (a) => {
    setAnchorElUser(null);
  };

  const handleSettingClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Start Streaming') {
      navigate('/create-streaming')
    }
  }

  const isLogedin = () => {
    return true;
  }

  return (
    <AppBar position="fixed" sx={{zIndex: 999, bgcolor: '#fff', padding: "0 20px"}}>
      <Toolbar disableGutters>
        <Box sx={{ display: 'flex', mr: 1 }}>
          <img src={Logo} alt="Logo" style={{width: 40}} />
        </Box>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            color: '#333',
            textDecoration: 'none',
          }}
        >
          Team Name
        </Typography>


        <Box sx={{ flexGrow: 1, display: 'flex' }}>
        </Box>


        {isLogedin() ? 
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={placeholder} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        :
        <Button sx={{ textAlign: 'center' }} href="/login">
          Log In
        </Button>

        }
      </Toolbar>
    </AppBar>
  );
}
export default UserHeader;
