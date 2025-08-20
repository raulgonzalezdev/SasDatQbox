import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color?: string;
}

export const HamburgerMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

  // Opciones del menú hamburguesa
  const menuItems: MenuItem[] = [
    {
      id: 'explore',
      title: 'Explorar',
      icon: 'compass',
      route: '/(tabs)/explore',
      color: Colors.primary,
    },
    {
      id: 'inventory',
      title: 'Inventario',
      icon: 'cube',
      route: '/(tabs)/inventario',
      color: '#4CAF50',
    },
    {
      id: 'sales',
      title: 'Ventas',
      icon: 'card',
      route: '/(tabs)/ventas',
      color: '#2196F3',
    },
    {
      id: 'expenses',
      title: 'Gastos',
      icon: 'wallet',
      route: '/(tabs)/gastos',
      color: '#FF9800',
    },
    {
      id: 'reports',
      title: 'Reportes',
      icon: 'bar-chart',
      route: '/(tabs)/reportes',
      color: '#9C27B0',
    },
  ];

  // Solo mostrar inventario, ventas, gastos y reportes para doctores
  const filteredMenuItems = isDoctor 
    ? menuItems 
    : menuItems.filter(item => ['explore'].includes(item.id));

  const handleMenuItemPress = (route: string) => {
    setIsVisible(false);
    router.push(route as any);
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            {/* Header del menú */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Más Opciones</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Lista de opciones */}
            <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
              {filteredMenuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.darkGray} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    right: 15,
    bottom: 80, // Posicionado encima del tab bar
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: Colors.tabBar,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: 300,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
});
