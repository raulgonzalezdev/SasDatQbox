import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir los tipos para el estado de la aplicación médica
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'doctor' | 'patient' | 'admin';
  businessName?: string;
  isPremium: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AppState {
  // Estado de autenticación
  isAuthenticated: boolean;
  user: User | null;
  
  // Estado de la aplicación
  isDemo: boolean;
  hidePromotions: boolean;
  currentLocale: 'es' | 'en';
  
  // Estado de navegación
  isInChat: boolean;
  currentChatId: string | null;
  
  // Acciones
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setDemo: (isDemo: boolean) => void;
  setHidePromotions: (hidePromotions: boolean) => void;
  setLocale: (locale: 'es' | 'en') => void;
  
  // Acciones de navegación
  enterChat: (chatId: string) => void;
  exitChat: () => void;
  
  logout: () => void;
}

// Crear la tienda con persistencia
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      isDemo: false, // Cambiado a false para app médica
      hidePromotions: false,
      currentLocale: 'es',
      
      // Estado de navegación inicial
      isInChat: false,
      currentChatId: null,
      
      // Acciones
      setUser: (user) => set({ user }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setDemo: (isDemo) => set({ isDemo }),
      setHidePromotions: (hidePromotions) => set({ hidePromotions }),
      setLocale: (currentLocale) => set({ currentLocale }),
      
      // Acciones de navegación optimizadas
      enterChat: (chatId) => set({ 
        isInChat: true, 
        currentChatId: chatId 
      }),
      exitChat: () => set({ 
        isInChat: false, 
        currentChatId: null 
      }),
      
      logout: () => set({ 
        isAuthenticated: false, 
        user: null,
        currentLocale: 'es',
        isInChat: false,
        currentChatId: null,
      }),
    }),
    {
      name: 'medical-app-storage', // Nombre actualizado para la app médica
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Funciones de utilidad para acceder al estado
export const isUserPremium = (): boolean => {
  const { user, isDemo } = useAppStore.getState();
  return !isDemo && user?.isPremium === true;
};

export const isUserAuthenticated = (): boolean => {
  return useAppStore.getState().isAuthenticated;
};

export const getCurrentUser = (): User | null => {
  return useAppStore.getState().user;
};

export const isDemoMode = (): boolean => {
  return useAppStore.getState().isDemo;
};

export const getUserRole = (): 'doctor' | 'patient' | 'admin' | null => {
  return useAppStore.getState().user?.role || null;
};

export const isDoctor = (): boolean => {
  return getUserRole() === 'doctor';
};

export const isPatient = (): boolean => {
  return getUserRole() === 'patient';
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

// Nueva función para verificar si se deben mostrar promociones
export const shouldShowPromotions = (): boolean => {
  const { isAuthenticated, user, hidePromotions } = useAppStore.getState();
  
  // Si el usuario ha elegido ocultar promociones, no las mostramos
  if (hidePromotions) return false;
  
  // Si el usuario está autenticado y es premium, no mostramos promociones
  if (isAuthenticated && user?.isPremium) return false;
  
  // En cualquier otro caso, mostramos promociones
  return true;
}; 