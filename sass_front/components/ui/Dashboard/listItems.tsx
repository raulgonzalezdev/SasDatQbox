'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StethoscopeIcon from '@mui/icons-material/MedicalServices';

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

export const mainListItems = () => {
  const currentPath = useCurrentPath();
  
  // Clean the pathname to remove trailing slashes and ensure consistent matching
  const cleanPathname = currentPath?.replace(/\/$/, '') || '';

  return (
    <React.Fragment>
      {/* Links de la aplicación */}
      <ListItemButton 
        component={Link} 
        href="/account"
        selected={cleanPathname === '/account'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/patients"
        selected={cleanPathname === '/account/patients'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/patients' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
        <ListItemText primary="Pacientes" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/appointments"
        selected={cleanPathname === '/account/appointments'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/appointments' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><EventIcon /></ListItemIcon>
        <ListItemText primary="Agenda" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/consultation"
        selected={cleanPathname === '/account/consultation'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/consultation' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><StethoscopeIcon /></ListItemIcon>
        <ListItemText primary="Consultas" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/prescriptions"
        selected={cleanPathname === '/account/prescriptions'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/prescriptions' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><DescriptionIcon /></ListItemIcon>
        <ListItemText primary="Recetas" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/chat"
        selected={cleanPathname === '/account/chat'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/chat' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><ChatIcon /></ListItemIcon>
        <ListItemText primary="Chat" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/payments"
        selected={cleanPathname === '/account/payments'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/payments' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><PaymentIcon /></ListItemIcon>
        <ListItemText primary="Pagos" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/reports"
        selected={cleanPathname === '/account/reports'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/reports' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><BarChartIcon /></ListItemIcon>
        <ListItemText primary="Estadísticas" />
      </ListItemButton>
      
      <Divider sx={{ my: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
      
      {/* Links al sitio público */}
      <ListItemButton 
        component={Link} 
        href="/"
        selected={cleanPathname === '/'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
        <ListItemText primary="Sitio Principal" />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/blog"
        selected={cleanPathname === '/blog'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/blog' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><BookIcon /></ListItemIcon>
        <ListItemText primary="Blog" />
      </ListItemButton>
    </React.Fragment>
  );
};

// Items secundarios, podrían ser específicos para admins o configuraciones
export const secondaryListItems = () => {
  const currentPath = useCurrentPath();
  
  // Clean the pathname to remove trailing slashes and ensure consistent matching
  const cleanPathname = currentPath?.replace(/\/$/, '') || '';
  
  return (
    <React.Fragment>
      <ListItemButton
        selected={cleanPathname === '/account/settings'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/settings' ? 600 : 400,
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Configuración" />
      </ListItemButton>
    </React.Fragment>
  );
};
