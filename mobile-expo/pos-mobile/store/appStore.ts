import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir los tipos para el estado de la aplicación
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  businessName: string;
  isPremium: boolean;
}

interface AppState {
  // Estado de autenticación
  isAuthenticated: boolean;
  user: User | null;
  
  // Estado de la aplicación
  isDemo: boolean;
  hidePromotions: boolean;
  
  // Acciones
  setUser: (user: User | null) => void;
  updateUser: (userData: User) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setDemo: (isDemo: boolean) => void;
  setHidePromotions: (hidePromotions: boolean) => void;
  logout: () => void;
}

// Crear la tienda con persistencia
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      isDemo: true, // Por defecto, la aplicación está en modo demo
      hidePromotions: false, // Por defecto, mostrar promociones
      
      // Acciones
      setUser: (user) => set({ user }),
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setDemo: (isDemo) => set({ isDemo }),
      setHidePromotions: (hidePromotions) => set({ hidePromotions }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'app-storage', // Nombre para la persistencia
      storage: createJSONStorage(() => AsyncStorage), // Usar AsyncStorage para persistencia
    }
  )
);

// Funciones de utilidad para acceder al estado
export const isUserPremium = (): boolean => {
  const { user, isDemo } = useAppStore.getState();
  // Si está en modo demo o el usuario no es premium, devuelve false
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