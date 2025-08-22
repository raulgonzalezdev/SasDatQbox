import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Función para limpiar completamente el AsyncStorage
export const clearAllStorage = async () => {
  try {
    console.log('🧹 Limpiando AsyncStorage completamente...');
    
    // Obtener todas las keys
    const keys = await AsyncStorage.getAllKeys();
    console.log('🔑 Keys encontradas:', keys);
    
    // Limpiar todas las keys
    await AsyncStorage.multiRemove(keys);
    
    console.log('✅ AsyncStorage limpiado completamente');
    return true;
  } catch (error) {
    console.error('❌ Error limpiando AsyncStorage:', error);
    return false;
  }
};

// Función para mostrar el contenido del AsyncStorage
export const debugStorage = async () => {
  try {
    console.log('🔍 Debugging AsyncStorage...');
    
    const keys = await AsyncStorage.getAllKeys();
    console.log('🔑 Keys:', keys);
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`📋 ${key}:`, value ? JSON.parse(value) : null);
    }
  } catch (error) {
    console.error('❌ Error debugging storage:', error);
  }
};

// Función para forzar reset completo de la app
export const forceAppReset = async () => {
  Alert.alert(
    'Reset Completo',
    '¿Estás seguro? Esto limpiará todos los datos de la aplicación.',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          const success = await clearAllStorage();
          if (success) {
            Alert.alert(
              'Reset Completado',
              'La aplicación se reiniciará. Cierra y abre la app nuevamente.',
              [{ text: 'OK' }]
            );
          }
        }
      }
    ]
  );
};

// Función para logs de debugging de navegación
export const logNavigationState = (routeName: string, params?: any) => {
  console.log(`🧭 Navegando a: ${routeName}`, params ? { params } : '');
};

// Función para verificar el estado de la app
export const checkAppState = (store: any) => {
  console.log('🔍 Estado actual de la app:', {
    isAuthenticated: store.isAuthenticated,
    hasUser: !!store.user,
    userId: store.user?.id,
    forceLanding: store.forceLanding,
    isInChat: store.isInChat,
    currentChatId: store.currentChatId,
  });
};
