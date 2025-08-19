'use client';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Button, Box, Avatar, Menu, MenuItem, styled, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSelector from '../Navbar/LanguageSelector';
import ThemeToggle from '../ThemeToggle';

const drawerWidth = 240;

interface DashboardNavbarProps {
  toggleDrawer: () => void;
  title: string;
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<DashboardNavbarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : theme.palette.primary.main,
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  // On small screens, always use full width
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

export default function DashboardNavbar({ toggleDrawer, title, open }: DashboardNavbarProps) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const t = useTranslations('Dashboard.navbar');
  

  
  // Detect if screen is small (mobile/tablet)
  const isSmallScreen = useMediaQuery('(max-width:1024px)');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Generate user initials from name
  const getUserInitials = () => {
    if (!user?.first_name && !user?.last_name) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) {
      return t('user');
    }
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
      return user.first_name;
    }
    if (user.last_name) {
      return user.last_name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return t('user');
  };

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar>
        {!isSmallScreen && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Page Title */}
        <Typography 
          component="h1" 
          variant="h5" 
          color="inherit" 
          noWrap 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: 'white'
          }}
        >
          {title}
        </Typography>
        
        {/* User Avatar and Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme Toggle */}
          <ThemeToggle color="white" />
          {/* Language Selector */}
          <LanguageSelector color="white" />
          
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {user ? getUserDisplayName() : t('user')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {user?.email || ''}
            </Typography>
          </Box>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ 
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': { 
                border: '2px solid rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              {getUserInitials()}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: 3,
                '& .MuiMenuItem-root': {
                  py: 1.5,
                  px: 2,
                }
              }
            }}
          >
            <MenuItem onClick={handleClose} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {getUserDisplayName()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
              {t('profile')}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              {t('logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
