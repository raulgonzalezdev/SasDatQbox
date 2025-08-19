'use client';
import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

interface LanguageSelectorProps {
  color?: string;
}

export default function LanguageSelector({ color = 'text.primary' }: LanguageSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
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
 /*   console.log('🔍 getLocalizedPath Debug:');
    console.log('  - newLocale:', newLocale);
    console.log('  - pathname:', pathname);
    console.log('  - pathWithoutLocale:', pathWithoutLocale);
    console.log('  - newPath:', newPath);*/
    return newPath;
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{ 
          color: color, 
          textTransform: 'none',
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          }
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
               onClick={() => {
                 handleClose();
                 router.push(href);
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
