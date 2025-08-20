import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';

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
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        {options.map((opt, idx) => (
          <TouchableOpacity key={idx} style={styles.option} onPress={opt.onPress}>
            <Ionicons name={opt.icon} size={24} color={Colors.primary} style={{ marginRight: 16 }} />
            <Text style={styles.label}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={28} color={Colors.darkGray} />
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom: 32,
    minHeight: 320,
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
  closeBtn: {
    alignSelf: 'center',
    marginTop: 16,
  },
});
