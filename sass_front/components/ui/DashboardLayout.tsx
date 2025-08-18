'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { styled, Theme } from '@mui/material/styles';
import {
  CssBaseline, Box, Toolbar, List, Divider, IconButton, Drawer as MuiDrawer, Typography, Avatar
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardNavbar from './Dashboard/DashboardNavbar';
import DashboardFooter from './Dashboard/DashboardFooter';
import { mainListItems, secondaryListItems } from './Dashboard/listItems';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }: { theme: Theme; open: boolean }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
      }),
    },
  }),
);

const pageTitles: { [key: string]: string } = {
  '/account': 'Dashboard',
  '/account/': 'Dashboard',
  '/account/patients': 'Pacientes',
  '/account/patients/': 'Pacientes',
  '/account/appointments': 'Agenda',
  '/account/appointments/': 'Agenda',
  '/account/chat': 'Chat',
  '/account/chat/': 'Chat',
  '/account/consultation': 'Consultas',
  '/account/consultation/': 'Consultas',
  '/account/prescriptions': 'Recetas',
  '/account/prescriptions/': 'Recetas',
  '/account/payments': 'Pagos',
  '/account/payments/': 'Pagos',
  '/account/reports': 'Estadísticas',
  '/account/reports/': 'Estadísticas',
};

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
  const [open, setOpen] = React.useState(true);
  const currentPath = useCurrentPath();
  
  // Clean the pathname to remove trailing slashes and ensure consistent matching
  const cleanPathname = currentPath?.replace(/\/$/, '') || '';
  const title = pageTitles[cleanPathname] || pageTitles[currentPath] || 'Dashboard';
  const toggleDrawer = () => setOpen(!open);

  // Debug - remove this later
  console.log('DashboardLayout - currentPath:', currentPath, 'cleanPathname:', cleanPathname, 'title:', title);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <DashboardNavbar toggleDrawer={toggleDrawer} title={title} open={open} />
      <Drawer variant="permanent" open={open}>
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          px: [1],
          backgroundColor: 'primary.main',
          color: 'white',
          minHeight: '64px'
        }}>
          {open ? (
            // When sidebar is extended - show BoxDoctor brand
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  width: 40,
                  height: 40,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                BD
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  flexGrow: 1
                }}
              >
                BoxDoctor
              </Typography>
            </Box>
          ) : (
            // When sidebar is collapsed - show compact avatar
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  width: 40,
                  height: 40,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                BD
              </Avatar>
            </Box>
          )}
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <List component="nav">{mainListItems()}</List>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <List component="nav">{secondaryListItems()}</List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme: Theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.background.default
              : theme.palette.grey[900],
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {children}
        </Box>
        <DashboardFooter />
      </Box>
    </Box>
  );
}
