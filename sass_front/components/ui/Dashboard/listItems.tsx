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
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';

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
  const t = useTranslations('Dashboard.menu');
  
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
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
        <ListItemText primary={t('dashboard')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/patients"
        selected={cleanPathname === '/account/patients'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/patients' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
        <ListItemText primary={t('patients')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/appointments"
        selected={cleanPathname === '/account/appointments'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/appointments' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><EventIcon /></ListItemIcon>
        <ListItemText primary={t('appointments')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/consultation"
        selected={cleanPathname === '/account/consultation'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/consultation' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><StethoscopeIcon /></ListItemIcon>
        <ListItemText primary={t('consultations')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/prescriptions"
        selected={cleanPathname === '/account/prescriptions'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/prescriptions' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><DescriptionIcon /></ListItemIcon>
        <ListItemText primary={t('prescriptions')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/chat"
        selected={cleanPathname === '/account/chat'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/chat' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><ChatIcon /></ListItemIcon>
        <ListItemText primary={t('chat')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/payments"
        selected={cleanPathname === '/account/payments'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/payments' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><PaymentIcon /></ListItemIcon>
        <ListItemText primary={t('payments')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/account/reports"
        selected={cleanPathname === '/account/reports'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/account/reports' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><BarChartIcon /></ListItemIcon>
        <ListItemText primary={t('statistics')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      
      <Divider sx={{ my: 1, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }} />
      
      {/* Links al sitio público */}
      <ListItemButton 
        component={Link} 
        href="/"
        selected={cleanPathname === '/'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
        <ListItemText primary={t('mainSite')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
      <ListItemButton 
        component={Link} 
        href="/blog"
        selected={cleanPathname === '/blog'}
        sx={{ 
          color: 'white',
          fontWeight: cleanPathname === '/blog' ? 600 : 400,
          '&:hover': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            fontWeight: 600
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}><BookIcon /></ListItemIcon>
        <ListItemText primary={t('blog')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
    </React.Fragment>
  );
};

// Items secundarios, podrían ser específicos para admins o configuraciones
export const secondaryListItems = () => {
  const currentPath = useCurrentPath();
  const t = useTranslations('Dashboard.menu');
  
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
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          },
          '&.Mui-selected': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
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
        <ListItemText primary={t('settings')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
    </React.Fragment>
  );
};

// Botón de logout fijo en la parte inferior
export const logoutListItems = () => {
  const t = useTranslations('Dashboard.menu');
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <React.Fragment>
      <ListItemButton
        onClick={handleLogout}
        sx={{ 
          color: 'white',
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0 20px 20px 0',
            marginRight: '8px'
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary={t('logout')} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
      </ListItemButton>
    </React.Fragment>
  );
};
