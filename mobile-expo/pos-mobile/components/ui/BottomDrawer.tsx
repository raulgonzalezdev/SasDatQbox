import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BordersAndShadows } from '@/constants/GlobalStyles';

interface DrawerOption {
  icon: string;
  label: string;
  onPress: () => void;
}

interface BottomDrawerProps {
  visible: boolean;
  onClose: () => void;
  options: DrawerOption[];
}

export default function BottomDrawer({ visible, onClose, options }: BottomDrawerProps) {
  if (!visible) return null;
  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.drawer}>
        {/* Botón de cierre naranja con flecha hacia abajo */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons
              name="chevron-down"
              size={32}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Acciones Rápidas</Text>

        {/* Options */}
        {options.map((opt, idx) => (
          <TouchableOpacity key={idx} style={styles.option} onPress={opt.onPress}>
            <Ionicons name={opt.icon as any} size={24} color={Colors.primary} style={{ marginRight: 16 }} />
            <Text style={styles.label}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        {/* The explicit close button is removed in favor of the handle and overlay press */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  drawer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 0, // Sin padding superior para el nuevo botón
    minHeight: 320,
    ...BordersAndShadows.shadows.lg,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    position: 'relative',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF7A00', // Mismo color naranja que el botón de apertura
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -30, // Lo elevamos para que sobresalga del drawer
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    marginTop: 30, // Espacio adicional para el botón elevado
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  label: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  // closeBtn style is removed
});
