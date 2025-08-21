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
        {/* Close Button Handle */}
        <TouchableOpacity style={styles.closeHandleContainer} onPress={onClose}>
            <View style={styles.closeHandle} />
        </TouchableOpacity>

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
    paddingTop: 12, // Reduced padding top for the handle
    minHeight: 320,
    ...BordersAndShadows.shadows.lg,
  },
  closeHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
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
