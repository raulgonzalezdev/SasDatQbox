import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

dayjs.extend(weekOfYear);


export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_datetime: string;
  reason: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    contact_info: {
      email: string;
      phone: string;
    };
  };
  doctor?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface CreateAppointmentPayload {
  patient_id: string;
  doctor_id: string;
  appointment_datetime: string;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentPayload {
  id: string;
  appointment_datetime?: string;
  reason?: string;
  notes?: string;
  status?: Appointment['status'];
}

interface AppointmentState {
  // State
  appointments: Appointment[];
  selectedDate: Dayjs;
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  
  // UI State
  isNewAppointmentDialogOpen: boolean;
  isAppointmentDetailDialogOpen: boolean;
  isRescheduleDialogOpen: boolean;
  
  // Actions
  setSelectedDate: (date: Dayjs) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Appointment CRUD
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  setAppointments: (appointments: Appointment[]) => void;
  
  // UI Actions
  openNewAppointmentDialog: () => void;
  closeNewAppointmentDialog: () => void;
  openAppointmentDetailDialog: (appointment: Appointment) => void;
  closeAppointmentDetailDialog: () => void;
  openRescheduleDialog: (appointment: Appointment) => void;
  closeRescheduleDialog: () => void;
  
  // Computed
  getAppointmentsForDate: (date: Dayjs) => Appointment[];
  getAppointmentsForDateRange: (startDate: Dayjs, endDate: Dayjs) => Appointment[];
  getAppointmentsForWeek: (date: Dayjs) => Appointment[];
  getAppointmentsForMonth: (date: Dayjs) => Appointment[];
}

// Mock data for development
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patient_id: '1',
    doctor_id: '1',
    appointment_datetime: '2024-08-12T13:00:00Z',
    reason: 'Consulta general',
    notes: 'Paciente con dolor de cabeza',
    status: 'scheduled',
    patient: {
      id: '1',
      first_name: 'Maria',
      last_name: 'Calderon',
      contact_info: {
        email: 'direccion@Kuidales.com',
        phone: '112244'
      }
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Carlos',
      last_name: 'Rodriguez'
    }
  },
  {
    id: '2',
    patient_id: '2',
    doctor_id: '1',
    appointment_datetime: '2024-08-12T14:00:00Z',
    reason: 'Revisión',
    notes: 'Especial',
    status: 'confirmed',
    patient: {
      id: '2',
      first_name: 'Mauricio',
      last_name: 'Fernandez',
      contact_info: {
        email: 'mauricio@email.com',
        phone: '334455'
      }
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Carlos',
      last_name: 'Rodriguez'
    }
  },
  {
    id: '3',
    patient_id: '3',
    doctor_id: '1',
    appointment_datetime: '2024-08-13T10:00:00Z',
    reason: 'Examen físico',
    notes: 'Chequeo anual',
    status: 'scheduled',
    patient: {
      id: '3',
      first_name: 'Ana',
      last_name: 'Lopez',
      contact_info: {
        email: 'ana@email.com',
        phone: '556677'
      }
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Carlos',
      last_name: 'Rodriguez'
    }
  },
  {
    id: '4',
    patient_id: '4',
    doctor_id: '1',
    appointment_datetime: '2024-08-14T16:00:00Z',
    reason: 'Seguimiento',
    notes: 'Control de medicación',
    status: 'scheduled',
    patient: {
      id: '4',
      first_name: 'Juan',
      last_name: 'Perez',
      contact_info: {
        email: 'juan@email.com',
        phone: '778899'
      }
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Carlos',
      last_name: 'Rodriguez'
    }
  }
];

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      // Initial state
      appointments: mockAppointments,
      selectedDate: dayjs(),
      selectedAppointment: null,
      isLoading: false,
      error: null,
      
      // UI State
      isNewAppointmentDialogOpen: false,
      isAppointmentDetailDialogOpen: false,
      isRescheduleDialogOpen: false,
      
      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Appointment CRUD
      addAppointment: (appointment) => 
        set((state) => ({ 
          appointments: [...state.appointments, appointment] 
        })),
      
      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map(apt =>
            apt.id === id ? { ...apt, ...updates } : apt
          )
        })),
      
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter(apt => apt.id !== id)
        })),
      
      setAppointments: (appointments) => set({ appointments }),
      
      // UI Actions
      openNewAppointmentDialog: () => set({ isNewAppointmentDialogOpen: true }),
      closeNewAppointmentDialog: () => set({ isNewAppointmentDialogOpen: false }),
      
      openAppointmentDetailDialog: (appointment) => 
        set({ 
          selectedAppointment: appointment, 
          isAppointmentDetailDialogOpen: true 
        }),
      
      closeAppointmentDetailDialog: () => 
        set({ 
          selectedAppointment: null, 
          isAppointmentDetailDialogOpen: false 
        }),
      
      openRescheduleDialog: (appointment) =>
        set({
          selectedAppointment: appointment,
          isRescheduleDialogOpen: true
        }),
      
      closeRescheduleDialog: () =>
        set({
          selectedAppointment: null,
          isRescheduleDialogOpen: false
        }),
      
      // Computed
      getAppointmentsForDate: (date) => {
        const state = get();
        return state.appointments.filter(apt => 
          dayjs(apt.appointment_datetime).isSame(date, 'day')
        );
      },
      
      getAppointmentsForDateRange: (startDate, endDate) => {
        const state = get();
        return state.appointments.filter(apt => {
          const aptDate = dayjs(apt.appointment_datetime);
          return aptDate.startOf('day').valueOf() >= startDate.startOf('day').valueOf() &&
                 aptDate.startOf('day').valueOf() <= endDate.startOf('day').valueOf();

        });
      },
      
      getAppointmentsForWeek: (date) => {
        const dayjsDate = dayjs(date);
        const startOfWeek = dayjsDate.startOf('week');
        const endOfWeek = dayjsDate.endOf('week');
        return get().getAppointmentsForDateRange(startOfWeek, endOfWeek);
      },
      
      getAppointmentsForMonth: (date) => {
        const dayjsDate = dayjs(date);
        const startOfMonth = dayjsDate.startOf('month');
        const endOfMonth = dayjsDate.endOf('month');
        return get().getAppointmentsForDateRange(startOfMonth, endOfMonth);
      }
    }),
    {
      name: 'appointment-store',
      partialize: (state) => ({
        appointments: state.appointments,
        selectedDate: state.selectedDate.toISOString()
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedDate = dayjs(state.selectedDate);
        }
      }
    }
  )
);
