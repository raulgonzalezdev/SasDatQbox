import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
}

interface Appointment {
    id: string;
    patient?: Patient;
    patientName?: string; // Mantener por compatibilidad con datos mock
    appointment_datetime: string;
    date?: string; // Mantener por compatibilidad
    time?: string; // Mantener por compatibilidad
    notes?: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    type?: string;
}

interface AppointmentState {
    appointments: Appointment[];
    selectedDate: string; // en formato 'YYYY-MM-DD'
    loading: boolean;
    error: string | null;

    // Acciones
    setSelectedDate: (date: string) => void;
    fetchAppointments: () => Promise<void>;
    getAppointmentsForDate: (date: Dayjs) => Appointment[];
    // addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
    // updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
}

// Datos simulados iniciales
const mockAppointments: Appointment[] = [
    { 
        id: '1', 
        patient: { id: 'p1', first_name: 'María', last_name: 'González' }, 
        appointment_datetime: '2024-07-25T10:00:00',
        status: 'confirmed',
        type: 'Consulta General'
    },
    { 
        id: '2', 
        patient: { id: 'p2', first_name: 'Juan', last_name: 'Pérez' }, 
        appointment_datetime: '2024-07-25T11:30:00',
        status: 'pending',
        type: 'Revisión'
    },
    { 
        id: '3', 
        patient: { id: 'p3', first_name: 'Laura', last_name: 'Silva' }, 
        appointment_datetime: '2024-07-26T09:00:00',
        status: 'confirmed',
        type: 'Consulta General'
    },
];


export const useAppointmentStore = create<AppointmentState>((set, get) => ({
    appointments: [],
    selectedDate: dayjs().format('YYYY-MM-DD'),
    loading: false,
    error: null,

    setSelectedDate: (date) => {
        set({ selectedDate: date });
    },

    fetchAppointments: async () => {
        set({ loading: true, error: null });
        try {
            // Simular una llamada a la API
            await new Promise(resolve => setTimeout(resolve, 500));
            // Asignar fechas y horas a los datos mock para que coincidan con la estructura esperada
            const formattedMocks = mockAppointments.map(apt => ({
                ...apt,
                date: dayjs(apt.appointment_datetime).format('YYYY-MM-DD'),
                time: dayjs(apt.appointment_datetime).format('HH:mm'),
                patientName: `${apt.patient?.first_name} ${apt.patient?.last_name}`
            }));
            set({ appointments: formattedMocks, loading: false });
        } catch (e) {
            set({ loading: false, error: 'Failed to fetch appointments' });
        }
    },

    getAppointmentsForDate: (date) => {
        const { appointments } = get();
        return appointments.filter(apt => dayjs(apt.appointment_datetime).isSame(date, 'day'));
    },
}));
