import { create } from 'zustand';

// Asumimos que tenemos una interfaz para el usuario
// Idealmente, esto vendría de un archivo de tipos compartido
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'patient';
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AppState {
  user: User | null;
  status: AuthStatus;
  locale: string;
  setUserAndAuth: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  setLocale: (locale: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  (set) => ({
    user: null,
    status: 'loading', // Empezamos en estado de carga
    locale: 'es', // Idioma por defecto
    setUserAndAuth: (user: User | null) => set({ 
      user, 
      status: user ? 'authenticated' : 'unauthenticated' 
    }),
    setStatus: (status: AuthStatus) => set({ status }),
    setLocale: (locale: string) => set({ locale }),
    logout: () => set({ user: null, status: 'unauthenticated' }),
  })
);
