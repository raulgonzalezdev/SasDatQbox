'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useThemeStore } from '@/stores/themeStore';

interface ThemeToggleProps {
  color?: string;
}

export default function ThemeToggle({ color }: ThemeToggleProps) {
  const { mode, setMode, isDarkMode } = useThemeStore();
  
  const handleToggle = () => {
    const newMode = isDarkMode() ? 'light' : 'dark';
    setMode(newMode);
  };

  const isDark = isDarkMode();

  return (
    <Tooltip title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton
        onClick={handleToggle}
        sx={{ 
          color: color || 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        {isDark ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </Tooltip>
  );
}
