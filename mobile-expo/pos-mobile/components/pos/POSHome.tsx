import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

export function POSHome() {
  const colorScheme = useColorScheme();
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  // Datos simulados del usuario logueado
  const loggedUser = {
    name: "Juan Pérez",
    role: "Administrador",
    store: "Tienda Principal"
  };

  const navigateToNewExpense = () => {
    router.push('/pos/new-expense');
  };

  const navigateToSales = () => {
    router.push('/pos/sales');
  };

  const navigateToInventory = () => {
    router.push('/pos/inventory');
  };

  const navigateToReports = () => {
    router.push('/pos/reports');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setHelpModalVisible(true)}
          >
            <Ionicons name="help-circle" size={28} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.storeName}>{loggedUser.store}</ThemedText>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{loggedUser.name}</ThemedText>
            <ThemedText style={styles.userRole}>{loggedUser.role}</ThemedText>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/')}>
            <Ionicons name="person-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.productGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <TouchableOpacity key={item} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Ionicons name="cafe" size={40} color="#8B4513" />
              </View>
              <ThemedText style={styles.productName}>Producto {item}</ThemedText>
              <ThemedText style={styles.productPrice}>$25.{item}0</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.cartContainer}>
        <View style={styles.cartHeader}>
          <ThemedText style={styles.cartTitle}>Carrito de compra</ThemedText>
          <ThemedText style={styles.cartItemCount}>3 items</ThemedText>
        </View>

        <View style={styles.cartItems}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.cartItem}>
              <ThemedText style={styles.cartItemName}>Producto {item}</ThemedText>
              <View style={styles.cartItemQuantity}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Ionicons name="remove" size={16} color="#8B4513" />
                </TouchableOpacity>
                <ThemedText style={styles.quantityText}>1</ThemedText>
                <TouchableOpacity style={styles.quantityButton}>
                  <Ionicons name="add" size={16} color="#8B4513" />
                </TouchableOpacity>
              </View>
              <ThemedText style={styles.cartItemPrice}>$25.{item}0</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.cartFooter}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalLabel}>Total:</ThemedText>
            <ThemedText style={styles.totalAmount}>$78.60</ThemedText>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <ThemedText style={styles.checkoutButtonText}>Pagar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

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
              <ThemedText style={styles.modalTitle}>Ayuda del POS</ThemedText>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.helpSection}>
                <ThemedText style={styles.helpSectionTitle}>Cómo usar el POS</ThemedText>
                <ThemedText style={styles.helpText}>
                  1. Selecciona los productos haciendo clic en las tarjetas.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  2. Ajusta las cantidades en el carrito usando los botones + y -.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  3. Cuando estés listo, presiona el botón "Pagar" para finalizar la venta.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <ThemedText style={styles.helpSectionTitle}>Navegación</ThemedText>
                <ThemedText style={styles.helpText}>
                  • Usa el menú inferior para navegar entre las diferentes secciones.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Presiona el icono de perfil para ver tus datos y cerrar sesión.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <ThemedText style={styles.helpSectionTitle}>Soporte</ThemedText>
                <ThemedText style={styles.helpText}>
                  Si necesitas ayuda adicional, contacta al soporte técnico:
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  Email: soporte@posmobile.com
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  Teléfono: (123) 456-7890
                </ThemedText>
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setHelpModalVisible(false)}
            >
              <ThemedText style={styles.closeModalButtonText}>Cerrar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 16,
    backgroundColor: '#FFD700', // Color amarillo para el encabezado
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    marginRight: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginRight: 12,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  userRole: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  cartContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 60, // Espacio para el menú inferior
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemCount: {
    fontSize: 14,
    color: '#666',
  },
  cartItems: {
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemName: {
    flex: 1,
    fontSize: 16,
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  checkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para el modal de ayuda
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  modalBody: {
    maxHeight: 400,
  },
  helpSection: {
    marginBottom: 24,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFD700',
  },
  helpText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  closeModalButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 