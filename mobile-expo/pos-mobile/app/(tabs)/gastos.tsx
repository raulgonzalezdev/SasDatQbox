import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';

export default function DeudasScreen() {
  // Datos simulados
  const deudasData = {
    totalDeudas: 1850.75,
    deudas: [
      { id: 1, fecha: '05/03/2025', monto: 750.50, proveedor: 'Distribuidora ABC', vencimiento: '20/03/2025' },
      { id: 2, fecha: '01/03/2025', monto: 425.25, proveedor: 'Carnes Premium', vencimiento: '15/03/2025' },
      { id: 3, fecha: '28/02/2025', monto: 350.00, proveedor: 'Bebidas del Sur', vencimiento: '15/03/2025' },
      { id: 4, fecha: '25/02/2025', monto: 325.00, proveedor: 'Verduras Express', vencimiento: '10/03/2025' },
    ]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomStatusBar backgroundColor="#FFD700" barStyle="dark-content" />
      
      <Header 
        title="Varas Grill"
        subtitle="Propietario"
        showHelp={false}
      />

      <ThemedView style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Resumen de deudas */}
          <View style={styles.deudaSummary}>
            <View style={styles.deudaCard}>
              <ThemedText style={styles.deudaTitle}>Total de deudas</ThemedText>
              <ThemedText style={styles.deudaAmount}>${deudasData.totalDeudas.toFixed(2)}</ThemedText>
              <TouchableOpacity style={styles.registrarButton}>
                <Ionicons name="add-circle" size={16} color="white" />
                <ThemedText style={styles.registrarButtonText}>Registrar nueva deuda</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de deudas */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Deudas pendientes</ThemedText>
            {deudasData.deudas.map(deuda => (
              <View key={deuda.id} style={styles.deudaItem}>
                <View style={styles.deudaInfo}>
                  <ThemedText style={styles.deudaProveedor}>{deuda.proveedor}</ThemedText>
                  <ThemedText style={styles.deudaFecha}>Registrada: {deuda.fecha}</ThemedText>
                  <ThemedText style={styles.deudaVencimiento}>Vence: {deuda.vencimiento}</ThemedText>
                </View>
                <View style={styles.deudaMontoContainer}>
                  <ThemedText style={styles.deudaMonto}>${deuda.monto.toFixed(2)}</ThemedText>
                  <TouchableOpacity style={styles.pagarButton}>
                    <ThemedText style={styles.pagarButtonText}>Pagar</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Filtros */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Filtros</ThemedText>
            <View style={styles.filtrosGrid}>
              <TouchableOpacity style={[styles.filtroItem, styles.filtroItemActive]}>
                <ThemedText style={styles.filtroText}>Todas</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filtroItem}>
                <ThemedText style={styles.filtroText}>Vencidas</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filtroItem}>
                <ThemedText style={styles.filtroText}>Por vencer</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filtroItem}>
                <ThemedText style={styles.filtroText}>Pagadas</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  deudaSummary: {
    marginBottom: 24,
  },
  deudaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deudaTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  deudaAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 16,
  },
  registrarButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  registrarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  deudaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  deudaInfo: {
    flex: 1,
  },
  deudaProveedor: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  deudaFecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deudaVencimiento: {
    fontSize: 14,
    color: '#F44336',
  },
  deudaMontoContainer: {
    alignItems: 'flex-end',
  },
  deudaMonto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pagarButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pagarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filtrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filtroItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  filtroItemActive: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
}); 