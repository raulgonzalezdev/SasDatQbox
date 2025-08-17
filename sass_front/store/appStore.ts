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

// Tipos para el estado y las acciones del store
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Creación del store (sin persistencia del token)
export const useAppStore = create<AppState>()(
  (set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
  })
);
