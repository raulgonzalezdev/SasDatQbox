'use client';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const menuItems = [
    { text: 'Características', href: '/#features' },
    { text: 'Precios', href: '/#pricing' },
    { text: 'Blog', href: '/blog' },
    { text: 'Ayuda', href: '/#help' },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}>
          BoxDoctor
        </Typography>
        
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
            }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
