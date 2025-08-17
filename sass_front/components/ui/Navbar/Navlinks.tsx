'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Box, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Logo from '@/components/icons/Logo';

interface User {
  id: string;
  email: string;
}

interface NavlinksProps {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export default function Navlinks({ user, isAuthenticated, logout }: NavlinksProps) {
  const t = useTranslations('Navbar');
  const router = useRouter();
  const pathname = usePathname();
  
  const handleChangeLocale = (event: any) => {
    const newLocale = event.target.value;
    // Extrae la ruta base sin el locale actual
    const newPathname = pathname.startsWith('/en') ? pathname.substring(3) : pathname.substring(3);
    router.push(`/${newLocale}${newPathname || '/'}`);
  };

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'es';

  const buttonStyles = {
    textTransform: 'none',
    fontSize: '1rem',
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Link href="/" passHref>
          <Logo />
        </Link>
        <Button color="inherit" component={Link} href="/#features" sx={buttonStyles}>
          {t('features')}
        </Button>
        <Button color="inherit" component={Link} href="/#pricing" sx={buttonStyles}>
          {t('pricing')}
        </Button>
        <Button color="inherit" component={Link} href="/blog" sx={buttonStyles}>
          {t('blog')}
        </Button>
        <Button color="inherit" component={Link} href="/#help" sx={buttonStyles}>
          {t('help')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} href="/account" sx={buttonStyles}>
              {t('dashboard')}
            </Button>
            <Button color="inherit" onClick={logout} sx={buttonStyles}>
              {t('logout')}
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} href="/signin" sx={buttonStyles}>
            {t('login')}
          </Button>
        )}
        <Button variant="contained" color="primary" sx={{ ...buttonStyles, borderRadius: '20px' }}>
          {t('downloadApp')}
        </Button>
        <FormControl size="small" variant="outlined" sx={{ minWidth: 60 }}>
          <Select
            value={currentLocale}
            onChange={handleChangeLocale}
            IconComponent={LanguageIcon}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiSelect-select': {
                padding: '8px',
              },
            }}
          >
            <MenuItem value="es">ES</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
