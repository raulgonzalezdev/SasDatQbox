import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles } from '@/constants/GlobalStyles';
import AgendaView from '@/components/appointments/AgendaView';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ThemedView style={CommonStyles.container}>
        <AgendaView />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (los estilos se pueden eliminar si ya no se usan, 
  // pero los mantendré por si los necesitamos más adelante)
});
