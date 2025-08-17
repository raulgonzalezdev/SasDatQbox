import { AppBar, Toolbar, Typography, Box, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import React from 'react';

export default function Footer() {
  return (
    <AppBar position="static" color="primary" sx={{ mt: 5 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ACME
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: { xs: 2, md: 0 } }}>
          <Link color="inherit" href="/" underline="none">
            Home
          </Link>
          <Link color="inherit" href="/" underline="none">
            About
          </Link>
          <Link color="inherit" href="/" underline="none">
            Careers
          </Link>
          <Link color="inherit" href="/" underline="none">
            Blog
          </Link>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: { xs: 2, md: 0 } }}>
          <Link color="inherit" href="/" underline="none">
            Privacy Policy
          </Link>
          <Link color="inherit" href="/" underline="none">
            Terms of Use
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <IconButton color="inherit" href="https://github.com/vercel/nextjs-subscription-payments" target="_blank">
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', bgcolor: 'primary.dark' }}>
        <Typography variant="body2" color="inherit">
          &copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="inherit" sx={{ mr: 1 }}>
            Crafted by
          </Typography>
          <img
            src="/vercel.svg"
            alt="Vercel.com Logo"
            style={{ height: '24px', filter: 'invert(1)' }} // Adjust styling for dark background
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
