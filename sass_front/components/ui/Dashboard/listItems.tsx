import * as React from 'react';
import Link from 'next/link';
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

export const mainListItems = (
  <React.Fragment>
    {/* Links de la aplicación */}
    <ListItemButton component={Link} href="/account">
      <ListItemIcon><DashboardIcon /></ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/patients">
      <ListItemIcon><PeopleIcon /></ListItemIcon>
      <ListItemText primary="Pacientes" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/appointments">
      <ListItemIcon><EventIcon /></ListItemIcon>
      <ListItemText primary="Consultas" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/prescriptions">
      <ListItemIcon><DescriptionIcon /></ListItemIcon>
      <ListItemText primary="Recetas" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/chat">
      <ListItemIcon><ChatIcon /></ListItemIcon>
      <ListItemText primary="Chat" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/payments">
      <ListItemIcon><PaymentIcon /></ListItemIcon>
      <ListItemText primary="Pagos" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/reports">
      <ListItemIcon><BarChartIcon /></ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItemButton>
    
    <Divider sx={{ my: 1 }} />
    
    {/* Links al sitio público */}
    <ListItemButton component={Link} href="/">
      <ListItemIcon><HomeIcon /></ListItemIcon>
      <ListItemText primary="Sitio Principal" />
    </ListItemButton>
    <ListItemButton component={Link} href="/blog">
      <ListItemIcon><BookIcon /></ListItemIcon>
      <ListItemText primary="Blog" />
    </ListItemButton>
  </React.Fragment>
);

// Items secundarios, podrían ser específicos para admins o configuraciones
export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Configuración" />
    </ListItemButton>
  </React.Fragment>
);
