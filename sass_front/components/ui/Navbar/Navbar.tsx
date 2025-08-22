'use client';
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const t = useTranslations('Navbar');
  const { user, status, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { text: t('features'), href: '/#features' },
    { text: t('pricing'), href: '/#pricing' },
    { text: t('blog'), href: '/blog', newWindow: true },
    { text: t('help'), href: '/#help' },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    handleUserMenuClose();
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
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

  // Mostrar loading mientras se verifica la autenticación
  if (status === 'loading') {
    return (
      <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, textDecoration: 'none' }}>
            <Logo width={100} height={100} disabledLink={true} />
            {!isMobile && (
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                BoxDoctor
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar>
        {/* Logo - siempre visible */}
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, textDecoration: 'none' }}>
          <Logo width={100} height={100} disabledLink={true} />
          {!isMobile && (
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              BoxDoctor
            </Typography>
          )}
        </Box>
        
        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                href={item.href}
                target={item.newWindow ? '_blank' : undefined}
                rel={item.newWindow ? 'noopener noreferrer' : undefined}
                variant="text"
                sx={{ 
                  color: 'text.primary', 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 8,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(43, 175, 154, 0.08)',
                    color: 'primary.main',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
            <ThemeToggle />
            <LanguageSelector />
          </Box>
        )}
        
        {/* Auth Button - Dashboard o Login */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={Link}
              href="/account"
              variant="contained"
              color="primary"
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 8,
                px: 3,
                py: 1,
                mr: isMobile ? 1 : 0,
              }}
            >
              {t('dashboard')}
            </Button>
            <IconButton
              onClick={handleUserMenuClick}
              sx={{ 
                border: '2px solid rgba(43, 175, 154, 0.3)',
                '&:hover': { 
                  border: '2px solid rgba(43, 175, 154, 0.5)',
                  backgroundColor: 'rgba(43, 175, 154, 0.1)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Box>
        ) : (
          <Button
            component={Link}
            href="/signin"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 8,
              px: 3,
              py: 1,
              mr: isMobile ? 1 : 0,
            }}
          >
            {t('login')}
          </Button>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open menu"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      
      {/* Mobile Menu Dropdown */}
      <Menu
        id="mobile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem 
            key={item.text} 
            component={Link} 
            href={item.href}
            target={item.newWindow ? '_blank' : undefined}
            rel={item.newWindow ? 'noopener noreferrer' : undefined}
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(43, 175, 154, 0.08)',
              },
            }}
          >
            {item.text}
          </MenuItem>
        ))}
        {isAuthenticated && (
          <MenuItem 
            component={Link} 
            href="/account"
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(43, 175, 154, 0.08)',
              },
            }}
          >
            {t('dashboard')}
          </MenuItem>
        )}
        {isAuthenticated && (
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(43, 175, 154, 0.08)',
              },
            }}
          >
            {t('logout')}
          </MenuItem>
        )}
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <ThemeToggle />
        </MenuItem>
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <LanguageSelector />
        </MenuItem>
      </Menu>

      {/* User Menu Dropdown */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleUserMenuClose} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {getUserDisplayName()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href="/account"
          onClick={handleUserMenuClose}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(43, 175, 154, 0.08)',
            },
          }}
        >
          <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
          {t('dashboard')}
        </MenuItem>
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
            },
          }}
        >
          {t('logout')}
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
