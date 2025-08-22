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

// Tipos de navegación del dashboard
type DashboardSection = 
  | 'dashboard' 
  | 'patients' 
  | 'appointments' 
  | 'consultations' 
  | 'prescriptions' 
  | 'chat' 
  | 'payments' 
  | 'statistics' 
  | 'settings';

interface AppState {
  user: User | null;
  status: AuthStatus;
  locale: string;
  currentDashboardSection: DashboardSection;
  setUserAndAuth: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  setLocale: (locale: string) => void;
  setCurrentDashboardSection: (section: DashboardSection) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  (set) => ({
    user: null,
    status: 'loading', // Empezamos en estado de carga
    locale: 'es', // Idioma por defecto
    currentDashboardSection: 'dashboard', // Sección por defecto del dashboard
    setUserAndAuth: (user: User | null) => set({ 
      user, 
      status: user ? 'authenticated' : 'unauthenticated' 
    }),
    setStatus: (status: AuthStatus) => set({ status }),
    setLocale: (locale: string) => set({ locale }),
    setCurrentDashboardSection: (section: DashboardSection) => set({ currentDashboardSection: section }),
    logout: () => set({ 
      user: null, 
      status: 'unauthenticated',
      currentDashboardSection: 'dashboard', // Resetear a dashboard al hacer logout
      locale: 'es' // Mantener el locale por defecto
    }),
  })
);
