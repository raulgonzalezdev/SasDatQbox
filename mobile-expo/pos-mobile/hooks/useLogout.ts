import { Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/store/appStore';
import { useMedicalStore } from '@/store/medicalStore';
import { useNotificationStore } from '@/store/notificationStore';

export const useLogout = () => {
  const { logout } = useAppStore();
  const { clearAllData } = useMedicalStore();
  const { clearAllNotifications } = useNotificationStore();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir de la aplicación?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚪 Iniciando logout...');
              
              // 1. Limpiar stores secundarios primero
              console.log('🧹 Limpiando datos médicos...');
              clearAllData();
              
              console.log('🔔 Limpiando notificaciones...');
              clearAllNotifications();
              
              // 2. Limpiar el store principal
              console.log('👤 Limpiando sesión de usuario...');
              logout();
              
              // 3. Limpiar AsyncStorage completamente (opcional pero más seguro)
              console.log('💾 Limpiando storage...');
              try {
                await AsyncStorage.multiRemove([
                  'medical-app-storage',
                  'medical-business-logic', 
                  'medical-notifications'
                ]);
              } catch (storageError) {
                console.warn('⚠️ Error limpiando storage:', storageError);
              }
              
              // 4. Forzar una pequeña pausa para que se complete la limpieza
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // 5. Navegar a la pantalla de inicio
              console.log('🔄 Navegando a landing original...');
              router.replace('/landing');
              
              console.log('✅ Logout completado exitosamente');
              
            } catch (error) {
              console.error('❌ Error durante logout:', error);
              Alert.alert(
                'Error', 
                'Hubo un problema al cerrar sesión. La aplicación se reiniciará.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // En caso de error crítico, forzar navegación
                      router.replace('/landing');
                    }
                  }
                ]
              );
            }
          },
        },
      ]
    );
  };

  const forceLogout = async () => {
    try {
      console.log('🚨 Forzando logout...');
      clearAllData();
      clearAllNotifications();
      logout();
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace('/landing');
    } catch (error) {
      console.error('❌ Error en force logout:', error);
      router.replace('/landing');
    }
  };

  return {
    handleLogout,
    forceLogout,
  };
};
