import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function ReportesScreen() {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  // Datos simulados del usuario logueado
  const loggedUser = {
    name: "Varas Grill",
    role: "Propietario",
    store: "Varas Grill"
  };

  // Datos simulados de reportes
  const reportes = [
    { id: 1, titulo: 'Ventas del día', valor: '$1,250.00', icono: 'cart', color: '#4CAF50' },
    { id: 2, titulo: 'Gastos del día', valor: '$350.00', icono: 'cash', color: '#F44336' },
    { id: 3, titulo: 'Ganancia del día', valor: '$900.00', icono: 'trending-up', color: '#2196F3' },
    { id: 4, titulo: 'Productos vendidos', valor: '45', icono: 'cube', color: '#FF9800' },
    { id: 5, titulo: 'Clientes atendidos', valor: '28', icono: 'people', color: '#9C27B0' },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.userIconButton}>
            <Ionicons name="person" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <ThemedText style={styles.storeName}>{loggedUser.name}</ThemedText>
            <ThemedText style={styles.userRole}>{loggedUser.role}</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setHelpModalVisible(true)}
        >
          <Ionicons name="help-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Resumen</ThemedText>
          
          <View style={styles.reportGrid}>
            {reportes.map(reporte => (
              <View key={reporte.id} style={styles.reportCard}>
                <View style={[styles.reportIconContainer, { backgroundColor: reporte.color }]}>
                  <Ionicons name={reporte.icono} size={24} color="white" />
                </View>
                <ThemedText style={styles.reportTitle}>{reporte.titulo}</ThemedText>
                <ThemedText style={styles.reportValue}>{reporte.valor}</ThemedText>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Reportes Disponibles</ThemedText>
          
          <TouchableOpacity style={styles.reportButton}>
            <Ionicons name="document-text" size={24} color="#FFD700" />
            <ThemedText style={styles.reportButtonText}>Reporte de Ventas</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.reportButton}>
            <Ionicons name="document-text" size={24} color="#FFD700" />
            <ThemedText style={styles.reportButtonText}>Reporte de Gastos</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.reportButton}>
            <Ionicons name="document-text" size={24} color="#FFD700" />
            <ThemedText style={styles.reportButtonText}>Reporte de Inventario</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de ayuda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpModalVisible}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Centro de Ayuda</ThemedText>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="bar-chart" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Reportes</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  En esta pantalla puedes visualizar y generar reportes de tu negocio.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="stats-chart" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Resumen</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  • Visualiza un resumen de las métricas importantes.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Monitorea ventas, gastos y ganancias.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Controla el rendimiento de tu negocio.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="people" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Soporte</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  Si necesitas ayuda adicional, contacta a nuestro equipo:
                </ThemedText>
                <View style={styles.supportContact}>
                  <Ionicons name="mail" size={20} color="#666" />
                  <ThemedText style={styles.supportContactText}>soporte@varasgrill.com</ThemedText>
                </View>
                <View style={styles.supportContact}>
                  <Ionicons name="call" size={20} color="#666" />
                  <ThemedText style={styles.supportContactText}>(123) 456-7890</ThemedText>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 16,
    paddingTop: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  userRole: {
    fontSize: 12,
    color: 'black',
    opacity: 0.8,
  },
  helpButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  reportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  reportValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  reportButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    maxHeight: '90%',
  },
  helpSection: {
    marginBottom: 25,
  },
  helpSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  helpText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    paddingLeft: 34,
  },
  supportContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingLeft: 34,
  },
  supportContactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
}); 