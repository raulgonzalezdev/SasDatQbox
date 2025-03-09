import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  // Datos simulados del usuario logueado
  const loggedUser = {
    name: "Varas Grill",
    role: "Propietario",
    store: "Varas Grill"
  };

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
        {/* Accesos rápidos */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Accesos rápidos</ThemedText>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push('/pos')}
            >
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="stats-chart" size={24} color="white" />
              </View>
              <ThemedText style={styles.quickAccessText}>Registrar Venta</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push('/pos/new-expense')}
            >
              <View style={[styles.quickAccessIconContainer, {backgroundColor: '#FFFFFF'}]}>
                <Ionicons name="trending-up" size={24} color="#FFD700" />
              </View>
              <ThemedText style={styles.quickAccessText}>Registrar Gasto</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
            >
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="menu" size={24} color="white" />
              </View>
              <ThemedText style={styles.quickAccessText}>Ver Menú</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Banner promocional */}
        <View style={styles.promotionBanner}>
          <View style={styles.promotionContent}>
            <ThemedText style={styles.promotionTitle}>¡Mejora tu operación!</ThemedText>
            <ThemedText style={styles.promotionText}>
              Con nuestro plan pago imprime tickets de tus ventas.
            </ThemedText>
            <TouchableOpacity style={styles.promotionButton}>
              <ThemedText style={styles.promotionButtonText}>Explorar planes</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.promotionImageContainer}>
            <Ionicons name="receipt" size={50} color="#FFFFFF" />
          </View>
        </View>
        
        {/* Sugeridos para ti */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Sugeridos para ti</ThemedText>
          <View style={styles.suggestionsGrid}>
            <TouchableOpacity style={styles.suggestionItem}>
              <View style={styles.suggestionIconContainer}>
                <Ionicons name="restaurant" size={32} color="#FFD700" />
              </View>
              <ThemedText style={styles.suggestionText}>Mesas</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.suggestionItem}>
              <View style={styles.suggestionIconContainer}>
                <Ionicons name="cash" size={32} color="#FFD700" />
              </View>
              <ThemedText style={styles.suggestionText}>Deudas</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.suggestionItem}>
              <View style={styles.suggestionIconContainer}>
                <Ionicons name="bar-chart" size={32} color="#FFD700" />
              </View>
              <ThemedText style={styles.suggestionText}>Estadísticas</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.suggestionItem}>
              <View style={styles.suggestionIconContainer}>
                <Ionicons name="people" size={32} color="#FFD700" />
              </View>
              <ThemedText style={styles.suggestionText}>Clientes</ThemedText>
            </TouchableOpacity>
          </View>
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
                  <Ionicons name="home" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Pantalla Principal</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  Aquí encontrarás accesos rápidos a las funciones más utilizadas y sugerencias personalizadas para tu negocio.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="cart" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Ventas</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  • Registra ventas rápidamente seleccionando productos.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Aplica descuentos y promociones.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Genera tickets y comprobantes.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="cash-outline" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Gastos</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  • Registra gastos por categoría.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Lleva control de pagos a proveedores.
        </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Visualiza reportes de gastos.
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
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: '30%',
    alignItems: 'center',
  },
  quickAccessIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#1E2F3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  promotionBanner: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
  },
  promotionContent: {
    flex: 3,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  promotionText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
  },
  promotionButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 14,
  },
  promotionImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  suggestionIconContainer: {
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
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


