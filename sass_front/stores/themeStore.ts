import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  // Theme settings
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  
  // UI settings
  sidebarCollapsed: boolean;
  language: string;
  timezone: string;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  
  // Computed
  isDarkMode: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'light',
      primaryColor: '#2baf9a',
      secondaryColor: '#fcb079',
      sidebarCollapsed: false,
      language: 'es',
      timezone: 'America/Mexico_City',
      
      // Actions
      setMode: (mode) => set({ mode }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setSecondaryColor: (color) => set({ secondaryColor: color }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      
      // Computed
      isDarkMode: () => {
        const state = get();
        if (state.mode === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return state.mode === 'dark';
      }
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({
        mode: state.mode,
        primaryColor: state.primaryColor,
        secondaryColor: state.secondaryColor,
        sidebarCollapsed: state.sidebarCollapsed,
        language: state.language,
        timezone: state.timezone
      })
    }
  )
);
