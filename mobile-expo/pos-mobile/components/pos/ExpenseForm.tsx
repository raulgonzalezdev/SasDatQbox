import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

type ExpenseFormProps = {
  onSave: (expense: {
    date: string;
    category: string;
    value: string;
    provider: string;
    isPaid: boolean;
  }) => void;
};

export function ExpenseForm({ onSave }: ExpenseFormProps) {
  const colorScheme = useColorScheme();
  const [date, setDate] = useState('Hoy, 07 marzo');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [provider, setProvider] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  // Datos simulados del usuario logueado
  const loggedUser = {
    name: "Varas Grill",
    role: "Propietario",
    store: "Varas Grill"
  };

  const handleSave = () => {
    onSave({
      date,
      category,
      value,
      provider,
      isPaid,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setHelpModalVisible(true)}
          >
            <Ionicons name="help-circle" size={28} color="black" />
          </TouchableOpacity>
          <ThemedText style={styles.storeName}>{loggedUser.store}</ThemedText>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{loggedUser.name}</ThemedText>
            <ThemedText style={styles.userRole}>{loggedUser.role}</ThemedText>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, isPaid && styles.activeTab]} 
          onPress={() => setIsPaid(true)}
        >
          <ThemedText style={[styles.tabText, isPaid && styles.activeTabText]}>Pagado</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, !isPaid && styles.activeTab]} 
          onPress={() => setIsPaid(false)}
        >
          <ThemedText style={[styles.tabText, !isPaid && styles.activeTabText]}>Deuda</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Fecha del gasto <Text style={styles.required}>*</Text></ThemedText>
          <TouchableOpacity style={styles.input}>
            <ThemedText>{date}</ThemedText>
            <Ionicons name="calendar" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Categoría del gasto <Text style={styles.required}>*</Text></ThemedText>
          <TouchableOpacity style={styles.input}>
            <ThemedText>{category || 'Selecciona una opción'}</ThemedText>
            <Ionicons name="chevron-down" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Valor <Text style={styles.required}>*</Text></ThemedText>
          <TextInput
            style={[styles.input, styles.valueInput]}
            value={value}
            onChangeText={setValue}
            placeholder="$0"
            keyboardType="numeric"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Proveedor</ThemedText>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowProviderModal(true)}
          >
            <ThemedText>{provider || 'Selecciona un proveedor'}</ThemedText>
            <Ionicons name="search" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Guardar gasto</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para seleccionar proveedor */}
      <Modal
        visible={showProviderModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Escoge un proveedor</ThemedText>
              <TouchableOpacity onPress={() => setShowProviderModal(false)}>
                <Ionicons name="close-circle" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={24} color="#999" />
              <TextInput 
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.noResultsContainer}>
              <View style={styles.magnifyingGlassContainer}>
                <Ionicons name="search" size={40} color="#FFD700" />
              </View>
              <ThemedText style={styles.noResultsText}>No encontramos resultados</ThemedText>
              <ThemedText style={styles.noResultsSubtext}>
                Intenta con otro nombre o crea el proveedor
              </ThemedText>
              
              <TouchableOpacity 
                style={styles.createProviderButton}
                onPress={() => {
                  // Lógica para crear nuevo proveedor
                  setShowProviderModal(false);
                  router.push('/pos/new-provider');
                }}
              >
                <ThemedText style={styles.createProviderText}>Crear nuevo proveedor</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de ayuda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpModalVisible}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.helpModalContainer}>
          <View style={styles.helpModalContent}>
            <View style={styles.helpModalHeader}>
              <ThemedText style={styles.helpModalTitle}>Centro de Ayuda</ThemedText>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.helpModalBody}>
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="cash-outline" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Registro de Gastos</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  En esta pantalla puedes registrar todos los gastos de tu negocio de forma rápida y organizada.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="calendar" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Fecha</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  • La fecha se establece automáticamente al día actual.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Puedes cambiarla tocando el campo de fecha.
                </ThemedText>
              </View>
              
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <Ionicons name="list" size={24} color="#FFD700" />
                  <ThemedText style={styles.helpSectionTitle}>Categorías</ThemedText>
                </View>
                <ThemedText style={styles.helpText}>
                  • Selecciona la categoría que mejor describa tu gasto.
                </ThemedText>
                <ThemedText style={styles.helpText}>
                  • Las categorías te ayudan a organizar y analizar tus gastos.
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
    color: 'black',
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
    color: 'black',
  },
  userRole: {
    fontSize: 12,
    color: 'black',
    opacity: 0.8,
  },
  profileButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#008060', // Color verde para la pestaña activa
    color: 'white',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  valueInput: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  magnifyingGlassContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  createProviderButton: {
    backgroundColor: '#008060',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  createProviderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  helpModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  helpModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  helpModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  helpModalBody: {
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