import { Tabs, router } from 'expo-router';
import React, { useState } from 'react'; // Importar useState
import { View } from 'react-native';
import { Colors } from '@/constants/GlobalStyles';
import CustomTabBar from '@/components/ui/CustomTabBar';
import BottomDrawer from '@/components/ui/BottomDrawer'; // Importar el BottomDrawer
import { useAppStore } from '@/store/appStore';

export default function TabLayout() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';
  const [drawerVisible, setDrawerVisible] = useState(false); // Estado de visibilidad

  // Opciones para el BottomDrawer
  const businessOptions = [
    {
      icon: 'add-circle-outline',
      label: 'Nueva Venta',
      onPress: () => {
        setDrawerVisible(false);
        router.push('/sales/new');
      },
    },
    {
      icon: 'receipt-outline',
      label: 'Ver Inventario',
      onPress: () => {
        setDrawerVisible(false);
        router.push('/inventory');
      },
    },
    {
      icon: 'bar-chart-outline',
      label: 'Reportes',
      onPress: () => {
        setDrawerVisible(false);
        router.push('/reports');
      },
    },
    {
      icon: 'cash-outline',
      label: 'Cierre de Caja',
      onPress: () => {
        setDrawerVisible(false);
        console.log('Cierre de caja...');
      },
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...props} onCenterPress={() => setDrawerVisible(true)} />
        )}
        screenOptions={{
          headerShown: false,
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
          component={() => null} // Componente vacío
        />
        <Tabs.Screen
          name="patients"
          options={{
            title: 'Pacientes',
            tabBarIconName: 'people-outline',
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
        options={businessOptions}
      />
    </View>
  );
}

