import { Tabs, router } from 'expo-router';
import React, { useState } from 'react'; // Importar useState
import { View } from 'react-native';
import { Colors } from '@/constants/GlobalStyles';
import CustomTabBar from '@/components/ui/CustomTabBar';
import BottomDrawer from '@/components/ui/BottomDrawer'; // Importar el BottomDrawer
import { useAppStore } from '@/store/appStore';
// Usando directamente el store sin contexto
export default function TabLayout() {
  const { user, isInChat } = useAppStore(); // Directamente del store
  const isDoctor = user?.role === 'doctor';
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Opciones para el BottomDrawer según el rol
  const getDynamicOptions = () => {
    if (isDoctor) {
      return [
        {
          icon: 'add-circle-outline',
          label: 'Nueva Cita',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/appointments');
          },
        },
        {
          icon: 'person-add-outline',
          label: 'Nuevo Paciente',
          onPress: () => {
            setDrawerVisible(false);
            console.log('Nuevo paciente...');
          },
        },
        {
          icon: 'medical-outline',
          label: 'Consulta Rápida',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/chat');
          },
        },
        {
          icon: 'receipt-outline',
          label: 'Nueva Receta',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/chat');
          },
        },
      ];
    } else {
      // Opciones para pacientes
      return [
        {
          icon: 'calendar-outline',
          label: 'Agendar Cita',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/appointments');
          },
        },
        {
          icon: 'chatbubble-outline',
          label: 'Consultar Médico',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/chat');
          },
        },
        {
          icon: 'document-text-outline',
          label: 'Mi Historial',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/patients');
          },
        },
        {
          icon: 'call-outline',
          label: 'Emergencia',
          onPress: () => {
            setDrawerVisible(false);
            router.push('/(drawer)/(tabs)/chat');
          },
        },
      ];
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => 
          !isInChat ? (
            <CustomTabBar {...props} onCenterPress={() => setDrawerVisible(true)} />
          ) : null
        }
        screenOptions={{
          headerShown: false, // Los tabs no mostrarán header individual, usarán el del drawer
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIconName: 'home-outline',
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: 'Citas',
            tabBarIconName: 'calendar-outline',
          }}
        />
        {/* Tab invisible para el botón central */}
        <Tabs.Screen
          name="center"
          options={{
            title: '',
            tabBarIconName: 'add',
            tabBarButton: () => null, // Esto hace que el tab no se renderice normalmente
          }}
        />
        <Tabs.Screen
          name="patients"
          options={{
            title: isDoctor ? 'Pacientes' : 'Mi Perfil',
            tabBarIconName: isDoctor ? 'people-outline' : 'person-outline',
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIconName: 'chatbubbles-outline',
          }}
        />
      </Tabs>
      <BottomDrawer 
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        options={getDynamicOptions()}
      />
    </View>
  );
}

