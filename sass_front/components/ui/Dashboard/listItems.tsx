import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import Link from 'next/link';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';

// Items principales del menú, comunes a todos los roles
export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} href="/account">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/patients">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Pacientes" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/appointments">
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Consultas" />
    </ListItemButton>
    <ListItemButton component={Link} href="/account/chat">
      <ListItemIcon>
        <ChatIcon />
      </ListItemIcon>
      <ListItemText primary="Chat" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reportes" />
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
