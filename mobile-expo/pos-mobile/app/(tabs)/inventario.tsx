import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function InventarioScreen() {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  // Datos simulados del usuario logueado
  const loggedUser = {
    name: "Varas Grill",
    role: "Propietario",
    store: "Varas Grill"
  };

  // Datos simulados de productos
  const productos = [
    { id: 1, nombre: 'Hamburguesa', precio: 8.99, stock: 25 },
    { id: 2, nombre: 'Pizza', precio: 12.99, stock: 15 },
    { id: 3, nombre: 'Ensalada', precio: 6.99, stock: 20 },
    { id: 4, nombre: 'Refresco', precio: 2.50, stock: 50 },
    { id: 5, nombre: 'Papas fritas', precio: 3.99, stock: 30 },
    { id: 6, nombre: 'Helado', precio: 4.50, stock: 18 },
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
          <ThemedText style={styles.sectionTitle}>Inventario de Productos</ThemedText>
          
          <View style={styles.tableHeader}>
            <ThemedText style={[styles.tableHeaderText, { flex: 2 }]}>Producto</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Precio</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Stock</ThemedText>
          </View>
          
          {productos.map(producto => (
            <View key={producto.id} style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { flex: 2 }]}>{producto.nombre}</ThemedText>
              <ThemedText style={[styles.tableCell, { flex: 1 }]}>${producto.precio.toFixed(2)}</ThemedText>
              <ThemedText style={[styles.tableCell, { flex: 1 }]}>{producto.stock}</ThemedText>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#FFD700" />
            <ThemedText style={styles.addButtonText}>Agregar Producto</ThemedText>
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
                  <Ionicons name="cube" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Inventario</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  En esta pantalla puedes gestionar tu inventario de productos.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="list" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Productos</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  • Visualiza todos tus productos en stock.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Controla precios y cantidades disponibles.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Agrega nuevos productos a tu inventario.
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tableCell: {
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 1,
  },
  addButtonText: {
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 8,
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