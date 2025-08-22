import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: 'payment_submitted' | 'payment_approved' | 'payment_rejected' | 'appointment_confirmed' | 'appointment_reminder' | 'consultation_started' | 'prescription_ready' | 'general';
  title: string;
  message: string;
  recipient_id: string;
  recipient_type: 'doctor' | 'patient' | 'admin';
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  related_appointment_id?: string;
  related_payment_id?: string;
  action_url?: string;
  created_at: Date;
  read_at?: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Acciones
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  removeNotification: (notificationId: string) => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  
  // Notificaciones específicas del sistema médico
  notifyPaymentSubmitted: (patientId: string, doctorId: string, appointmentId: string, amount: number) => void;
  notifyPaymentApproved: (patientId: string, appointmentId: string) => void;
  notifyPaymentRejected: (patientId: string, appointmentId: string, reason?: string) => void;
  notifyAppointmentConfirmed: (patientId: string, doctorId: string, appointmentId: string, date: Date) => void;
  notifyAppointmentReminder: (patientId: string, appointmentId: string, date: Date) => void;
  notifyConsultationStarted: (patientId: string, doctorId: string, appointmentId: string) => void;
  notifyPrescriptionReady: (patientId: string, doctorId: string, prescriptionId: string) => void;
  
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date(),
        };
        
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
        
        console.log('📱 Nueva notificación:', notification.title);
      },
      
      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true, read_at: new Date() }
              : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },
      
      markAllAsRead: (userId) => {
        set((state) => {
          const userNotifications = state.notifications.filter(
            notif => notif.recipient_id === userId && !notif.is_read
          );
          
          return {
            notifications: state.notifications.map(notif => 
              notif.recipient_id === userId && !notif.is_read
                ? { ...notif, is_read: true, read_at: new Date() }
                : notif
            ),
            unreadCount: state.unreadCount - userNotifications.length,
          };
        });
      },
      
      removeNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId);
          return {
            notifications: state.notifications.filter(notif => notif.id !== notificationId),
            unreadCount: notification && !notification.is_read 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount,
          };
        });
      },
      
      getNotificationsByUser: (userId) => {
        return get().notifications.filter(notif => notif.recipient_id === userId);
      },
      
      getUnreadCount: (userId) => {
        return get().notifications.filter(
          notif => notif.recipient_id === userId && !notif.is_read
        ).length;
      },
      
      // Notificaciones específicas del sistema médico
      notifyPaymentSubmitted: (patientId, doctorId, appointmentId, amount) => {
        const { addNotification } = get();
        
        // Notificación para el doctor
        addNotification({
          type: 'payment_submitted',
          title: 'Nuevo Comprobante de Pago',
          message: `Un paciente ha enviado un comprobante de pago por $${amount.toFixed(2)}. Revísalo para confirmar la cita.`,
          recipient_id: doctorId,
          recipient_type: 'doctor',
          is_read: false,
          priority: 'high',
          related_appointment_id: appointmentId,
        });
        
        // Notificación para el paciente
        addNotification({
          type: 'payment_submitted',
          title: 'Comprobante Enviado',
          message: `Tu comprobante de pago por $${amount.toFixed(2)} ha sido enviado. El doctor lo revisará pronto.`,
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'normal',
          related_appointment_id: appointmentId,
        });
      },
      
      notifyPaymentApproved: (patientId, appointmentId) => {
        const { addNotification } = get();
        
        addNotification({
          type: 'payment_approved',
          title: '✅ Pago Aprobado',
          message: 'Tu pago ha sido verificado exitosamente. Tu cita está confirmada.',
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'high',
          related_appointment_id: appointmentId,
        });
      },
      
      notifyPaymentRejected: (patientId, appointmentId, reason) => {
        const { addNotification } = get();
        
        addNotification({
          type: 'payment_rejected',
          title: '❌ Pago Rechazado',
          message: `Tu comprobante de pago no pudo ser verificado. ${reason || 'Por favor, verifica los datos y envía un nuevo comprobante.'}`,
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'urgent',
          related_appointment_id: appointmentId,
        });
      },
      
      notifyAppointmentConfirmed: (patientId, doctorId, appointmentId, date) => {
        const { addNotification } = get();
        
        const formattedDate = date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        
        addNotification({
          type: 'appointment_confirmed',
          title: '📅 Cita Confirmada',
          message: `Tu cita médica está confirmada para el ${formattedDate}.`,
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'high',
          related_appointment_id: appointmentId,
        });
      },
      
      notifyAppointmentReminder: (patientId, appointmentId, date) => {
        const { addNotification } = get();
        
        const timeUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60));
        
        addNotification({
          type: 'appointment_reminder',
          title: '⏰ Recordatorio de Cita',
          message: `Tu cita médica es en ${timeUntil} minutos. ¡No olvides asistir!`,
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'urgent',
          related_appointment_id: appointmentId,
        });
      },
      
      notifyConsultationStarted: (patientId, doctorId, appointmentId) => {
        const { addNotification } = get();
        
        addNotification({
          type: 'consultation_started',
          title: '🩺 Consulta Iniciada',
          message: 'El doctor ha iniciado tu consulta. Ya puedes comunicarte a través del chat.',
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'urgent',
          related_appointment_id: appointmentId,
        });
      },
      
      notifyPrescriptionReady: (patientId, doctorId, prescriptionId) => {
        const { addNotification } = get();
        
        addNotification({
          type: 'prescription_ready',
          title: '💊 Receta Lista',
          message: 'El doctor ha generado tu receta médica. Puedes descargarla desde tu perfil.',
          recipient_id: patientId,
          recipient_type: 'patient',
          is_read: false,
          priority: 'high',
          related_appointment_id: prescriptionId,
        });
      },
      
      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },
    }),
    {
      name: 'medical-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook para obtener notificaciones de un usuario específico
export const useUserNotifications = (userId: string) => {
  const { notifications, getUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  
  const userNotifications = notifications.filter(notif => notif.recipient_id === userId);
  const unreadCount = getUnreadCount(userId);
  
  return {
    notifications: userNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead: () => markAllAsRead(userId),
  };
};
