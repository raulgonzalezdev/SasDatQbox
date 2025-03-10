import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary, // Color amarillo para los iconos activos
        tabBarInactiveTintColor: Colors.white, // Color blanco para los iconos inactivos
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: Colors.tabBar 
          }} />
        ),
        tabBarStyle: Platform.select({
          ios: {
            height: 60,
            paddingBottom: 5,
            backgroundColor: Colors.tabBar, // Fondo oscuro para el menú
            borderTopWidth: 0, // Eliminar la línea superior
            elevation: 8, // Sombra para Android
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          default: {
            height: 60,
            paddingBottom: 5,
            backgroundColor: Colors.tabBar, // Fondo oscuro para el menú
            borderTopWidth: 0, // Eliminar la línea superior
            elevation: 8, // Sombra para Android
          },
        }),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          color: Colors.white, // Color blanco para el texto
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reportes"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ventas"
        options={{
          title: 'Balance',
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: 'Deudas',
          tabBarIcon: ({ color, size }) => <Ionicons name="cash-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventario"
        options={{
          title: 'Menú',
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
