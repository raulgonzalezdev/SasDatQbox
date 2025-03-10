import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  screenName?: string;
}

export function HelpModal({ 
  visible, 
  onClose, 
  title = "Ayuda", 
  content,
  screenName
}: HelpModalProps) {
  // Contenido específico según la pantalla
  const getScreenContent = () => {
    switch (screenName) {
      case 'home':
        return "Esta es la pantalla principal de tu aplicación POS. Desde aquí puedes acceder a todas las funcionalidades principales como registrar ventas, gestionar gastos y ver el menú.";
      case 'balance':
        return "En esta pantalla puedes ver un resumen de tus finanzas, incluyendo ventas, gastos y balance general. También puedes ver un historial de tus últimas ventas.";
      case 'deudas':
        return "Aquí puedes gestionar las deudas pendientes con tus proveedores. Puedes registrar nuevas deudas, marcarlas como pagadas y filtrarlas por estado.";
      case 'menu':
        return "En esta sección puedes gestionar tu inventario de productos. Puedes ver el stock disponible, añadir nuevos productos y actualizar los existentes.";
      case 'reportes':
        return "Aquí encontrarás informes detallados sobre el rendimiento de tu negocio, incluyendo ventas, gastos, productos más vendidos y estadísticas de clientes.";
      case 'explorar':
        return "Descubre todas las funcionalidades disponibles en la aplicación y aprende a sacar el máximo provecho de ellas para mejorar la gestión de tu negocio.";
      default:
        return content || "Esta sección te permite gestionar diferentes aspectos de tu negocio. Si necesitas ayuda adicional, contacta con nuestro equipo de soporte.";
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>{title}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ThemedText style={styles.modalText}>
            {getScreenContent()}
          </ThemedText>
          
          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}
          >
            <ThemedText style={styles.modalButtonText}>Entendido</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 