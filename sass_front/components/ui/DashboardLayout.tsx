'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { styled, Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import {
  CssBaseline, Box, Toolbar, List, Divider, IconButton, Drawer as MuiDrawer, Typography, Avatar
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardNavbar from './Dashboard/DashboardNavbar';
import DashboardFooter from './Dashboard/DashboardFooter';
import { mainListItems, secondaryListItems } from './Dashboard/listItems';
import Logo from './Logo';
import { useTranslations } from 'next-intl';

const drawerWidth = 250;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }: { theme: Theme; open: boolean }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : theme.palette.primary.main,
      color: 'white',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      overflowX: 'hidden', // Always prevent horizontal scroll
      overflowY: 'auto', // Allow vertical scroll if needed
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
      }),
      // Force collapsed state on small screens
      [theme.breakpoints.down('lg')]: {
        width: theme.spacing(7),
        overflowX: 'hidden',
      },
    },
  }),
);

// Custom hook to properly detect route changes
function useCurrentPath() {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = React.useState(pathname);
  
  React.useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);
  
  // Remove locale from pathname for matching
  const pathWithoutLocale = currentPath?.replace(/^\/[a-z]{2}/, '') || '';
  
  return pathWithoutLocale;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentPath = useCurrentPath();
  const t = useTranslations('Dashboard.menu');
  
  // Detect if screen is small (mobile/tablet)
  const isSmallScreen = useMediaQuery('(max-width:1024px)');
  
  // Initialize sidebar state based on screen size
  const [open, setOpen] = React.useState(!isSmallScreen);
  
  // Update sidebar state when screen size changes
  React.useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);
  
  // Clean the pathname to remove trailing slashes and ensure consistent matching
  const cleanPathname = currentPath?.replace(/\/$/, '') || '';
  
  // Get translated title based on path
  const getTranslatedTitle = () => {
    switch (cleanPathname) {
      case '/account':
        return t('dashboard');
      case '/account/patients':
        return t('patients');
      case '/account/appointments':
        return t('appointments');
      case '/account/consultation':
        return t('consultations');
      case '/account/prescriptions':
        return t('prescriptions');
      case '/account/chat':
        return t('chat');
      case '/account/payments':
        return t('payments');
      case '/account/reports':
        return t('statistics');
      case '/account/settings':
        return t('settings');
      default:
        return t('dashboard');
    }
  };
  
  const title = getTranslatedTitle();
  
  // Toggle drawer only on larger screens
  const toggleDrawer = () => {
    if (!isSmallScreen) {
      setOpen(!open);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <DashboardNavbar toggleDrawer={toggleDrawer} title={title} open={open} />
      <Drawer variant="permanent" open={isSmallScreen ? false : open} theme={undefined as any}>
                 <Toolbar sx={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'space-between', 
           px: [1, 2], // Balanced padding
           backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : theme.palette.primary.main,
           color: 'white',
           minHeight: '64px',
           flexShrink: 0, // Prevent toolbar from shrinking
           position: 'sticky',
           top: 0,
           zIndex: 1
         }}>
                     {open ? (
             // When sidebar is extended - show BoxDoctor brand
                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
                <Logo width={80} height={80} disabledLink={true} />
                                 <Typography 
                   variant="body1" 
                   sx={{ 
                     fontWeight: 'bold',
                     color: 'white',
                     flexGrow: 1,
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap',
                     fontSize: '0.95rem'
                   }}
                 >
                  BoxDoctor
                </Typography>
              </Box>
            ) : (
             // When sidebar is collapsed - show compact logo
             <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
               <Logo width={48} height={48} disabledLink={true} />
             </Box>
           )}
           
           {/* Toggle button - positioned next to BoxDoctor */}
           {!isSmallScreen && (
             <IconButton 
               onClick={toggleDrawer} 
               sx={{ 
                 color: 'white',
                 minWidth: '40px',
                 minHeight: '40px',
                 flexShrink: 0,
                 '&:hover': {
                   backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)',
                 }
               }}
             >
               <ChevronLeftIcon sx={{ 
                 transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                 transition: 'transform 0.3s ease',
                 fontSize: '1.5rem'
               }} />
             </IconButton>
           )}
        </Toolbar>
                           <Divider sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }} />
          <List component="nav">{mainListItems()}</List>
          <Divider sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }} />
          <List component="nav">{secondaryListItems()}</List>
      </Drawer>
             <Box
         component="main"
         sx={{
           backgroundColor: (theme: Theme) =>
             theme.palette.mode === 'light'
               ? theme.palette.background.default
               : '#1e1e1e',
           flexGrow: 1,
           display: 'flex',
           flexDirection: 'column',
           height: '100vh',
           overflow: 'hidden',
           minWidth: 0, // Prevents flex item from overflowing
         }}
       >
         <Toolbar />
         <Box sx={{ flex: 1, p: 3, overflow: 'auto', minWidth: 0 }}>
           {children}
         </Box>
         <DashboardFooter />
       </Box>
    </Box>
  );
}
