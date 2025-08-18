'use client';
import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSelector() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: typeof languages[0]) => {
    setCurrentLanguage(language);
    handleClose();
    // Por ahora solo cambia el estado local
    // TODO: Implementar cambio de idioma real cuando se resuelvan los problemas de hidratación
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
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            selected={language.code === currentLanguage.code}
          >
            <ListItemIcon>
              <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
