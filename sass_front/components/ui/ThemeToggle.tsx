'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useThemeStore } from '@/stores/themeStore';
import { useTranslations } from 'next-intl';

interface ThemeToggleProps {
  color?: string;
}

export default function ThemeToggle({ color }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const t = useTranslations('ThemeToggle');
  
  const handleToggle = () => {
    toggleTheme();
  };

  const isDark = isDarkMode();

  return (
    <Tooltip title={isDark ? t('lightMode') : t('darkMode')}>
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
