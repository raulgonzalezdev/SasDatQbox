'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  CssBaseline, Box, Toolbar, List, Divider, IconButton, Drawer as MuiDrawer
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardNavbar from './Dashboard/DashboardNavbar';
import { mainListItems, secondaryListItems } from './Dashboard/listItems';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
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
  '/account/patients': 'Pacientes',
  '/account/appointments': 'Consultas',
  '/account/chat': 'Chat',
  '/account/consultation': 'Consulta',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Dashboard';
  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <DashboardNavbar toggleDrawer={toggleDrawer} title={title} open={open} />
      <Drawer variant="permanent" open={open}>
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          px: [1],
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
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
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.background.default
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Box sx={{ m: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
