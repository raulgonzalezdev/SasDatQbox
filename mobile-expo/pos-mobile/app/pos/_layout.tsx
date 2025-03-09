import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function POSLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false, // Ocultamos el header por defecto ya que lo manejamos en cada componente
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'POS',
        }}
      />
      <Stack.Screen
        name="new-expense"
        options={{
          title: 'Nuevo Gasto',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="new-provider"
        options={{
          title: 'Nuevo Proveedor',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="sales"
        options={{
          title: 'Ventas',
        }}
      />
      <Stack.Screen
        name="inventory"
        options={{
          title: 'Inventario',
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          title: 'Reportes',
        }}
      />
    </Stack>
  );
} 