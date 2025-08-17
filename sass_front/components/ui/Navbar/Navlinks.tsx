'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

interface NavlinksProps {
  user?: any; // TODO: Replace with actual User type from FastAPI
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    // TODO: Call FastAPI logout endpoint
    console.log('Signing out...');
    // On successful logout, redirect to signin page
    router.push('/signin');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" passHref>
            <Typography variant="h6" component="div" sx={{ mr: 2, cursor: 'pointer' }}>
              ACME
            </Typography>
          </Link>
          <Button color="inherit" component={Link} href="/">
            Pricing
          </Button>
          {user && (
            <Button color="inherit" component={Link} href="/account">
              Account
            </Button>
          )}
        </Box>
        <Box>
          {user ? (
            <Button color="inherit" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <Button color="inherit" component={Link} href="/signin">
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
