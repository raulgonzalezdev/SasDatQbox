'use client';
import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSelector() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const locale = useLocale();
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  
  console.log('🔍 LanguageSelector Debug:');
  console.log('  - pathname:', pathname);
  console.log('  - locale:', locale);
  console.log('  - currentLanguage:', currentLanguage);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getLocalizedPath = (newLocale: string) => {
    // Remove current locale from pathname if it exists
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    console.log('🔍 getLocalizedPath Debug:');
    console.log('  - newLocale:', newLocale);
    console.log('  - pathname:', pathname);
    console.log('  - pathWithoutLocale:', pathWithoutLocale);
    console.log('  - newPath:', newPath);
    return newPath;
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{ 
          color: 'text.primary', 
          textTransform: 'none',
          minWidth: 'auto'
        }}
      >
        {currentLanguage.flag}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
                 {languages.map((language) => {
           const href = getLocalizedPath(language.code);
           return (
             <MenuItem
               key={language.code}
               component={Link}
               href={href}
               onClick={() => {
                 console.log('🔍 Language Clicked:', language.code);
                 console.log('🔍 Navigating to:', href);
                 handleClose();
               }}
               selected={language.code === currentLanguage.code}
             >
              <ListItemIcon>
                <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
              </ListItemIcon>
              <ListItemText>{language.name}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
