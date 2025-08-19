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
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import Logo from '../Logo';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const t = useTranslations('Navbar');

  console.log('🔍 Navbar Debug:');
  console.log('  - t("features"):', t('features'));
  console.log('  - t("pricing"):', t('pricing'));
  console.log('  - t("login"):', t('login'));

  const menuItems = [
    { text: t('features'), href: '/#features' },
    { text: t('pricing'), href: '/#pricing' },
    { text: t('blog'), href: '/blog' },
    { text: t('help'), href: '/#help' },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            <LanguageSelector />
          </Box>
        )}
        
                 {/* Login Button - siempre visible */}
         <Button
           component={Link}
           href="/signin"
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
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <LanguageSelector />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
