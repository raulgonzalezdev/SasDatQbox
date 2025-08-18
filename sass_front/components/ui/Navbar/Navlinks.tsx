'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  Button, 
  Box, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '@/components/icons/Logo';

interface User {
  id: string;
  email: string;
}

interface NavlinksProps {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export default function Navlinks({ user, isAuthenticated, logout }: NavlinksProps) {
  const t = useTranslations('Navbar');
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleChangeLocale = (event: any) => {
    const newLocale = event.target.value;
    // Extrae la ruta base sin el locale actual
    const newPathname = pathname.startsWith('/en') ? pathname.substring(3) : pathname.substring(3);
    router.push(`/${newLocale}${newPathname || '/'}`);
  };

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'es';

  const buttonStyles = {
    textTransform: 'none',
    fontSize: '1rem',
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { text: t('features'), href: '/#features' },
    { text: t('pricing'), href: '/#pricing' },
    { text: t('blog'), href: '/blog' },
    { text: t('help'), href: '/#help' },
  ];

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          pt: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <Logo />
        <IconButton onClick={handleMobileMenuClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href}
              onClick={handleMobileMenuClose}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/account"
                onClick={handleMobileMenuClose}
              >
                <ListItemText primary={t('dashboard')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { logout(); handleMobileMenuClose(); }}>
                <ListItemText primary={t('logout')} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              href="/signin"
              onClick={handleMobileMenuClose}
            >
              <ListItemText primary={t('login')} />
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={t('downloadApp')} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <FormControl fullWidth size="small" variant="outlined">
            <Select
              value={currentLocale}
              onChange={handleChangeLocale}
              IconComponent={LanguageIcon}
            >
              <MenuItem value="es">ES</MenuItem>
              <MenuItem value="en">EN</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href="/" passHref>
            <Logo />
          </Link>
          {!isMobile && (
            <>
              <Button color="inherit" component={Link} href="/#features" sx={buttonStyles}>
                {t('features')}
              </Button>
              <Button color="inherit" component={Link} href="/#pricing" sx={buttonStyles}>
                {t('pricing')}
              </Button>
              <Button color="inherit" component={Link} href="/blog" sx={buttonStyles}>
                {t('blog')}
              </Button>
              <Button color="inherit" component={Link} href="/#help" sx={buttonStyles}>
                {t('help')}
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isMobile && (
            <>
              {isAuthenticated ? (
                <>
                  <Button color="inherit" component={Link} href="/account" sx={buttonStyles}>
                    {t('dashboard')}
                  </Button>
                  <Button color="inherit" onClick={logout} sx={buttonStyles}>
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <Button color="inherit" component={Link} href="/signin" sx={buttonStyles}>
                  {t('login')}
                </Button>
              )}
              <Button variant="contained" color="primary" sx={{ ...buttonStyles, borderRadius: '20px' }}>
                {t('downloadApp')}
              </Button>
            </>
          )}
          {isMobile && (
            <>
              {isAuthenticated ? (
                <Button color="inherit" component={Link} href="/account" sx={buttonStyles}>
                  {t('dashboard')}
                </Button>
              ) : (
                <Button color="inherit" component={Link} href="/signin" sx={buttonStyles}>
                  {t('login')}
                </Button>
              )}
              <IconButton onClick={handleMobileMenuToggle} color="inherit">
                <MenuIcon />
              </IconButton>
            </>
          )}
          {!isMobile && (
            <FormControl size="small" variant="outlined" sx={{ minWidth: 60 }}>
              <Select
                value={currentLocale}
                onChange={handleChangeLocale}
                IconComponent={LanguageIcon}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '& .MuiSelect-select': {
                    padding: '8px',
                  },
                }}
              >
                <MenuItem value="es">ES</MenuItem>
                <MenuItem value="en">EN</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>
      {mobileMenu}
    </>
  );
}
