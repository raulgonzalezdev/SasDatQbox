import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

interface AppHeaderProps {
  showDrawerButton?: boolean;
  DrawerButton?: React.ComponentType<any>;
}

const AppHeader: React.FC<AppHeaderProps> = ({ showDrawerButton, DrawerButton }) => {
  const { logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace('/landing'); // Redirige a la página de inicio
  };

  const handleNotifications = () => {
    // Lógica para navegar a la pantalla de notificaciones
    console.log('Abriendo notificaciones...');
  };

  return (
    <View style={styles.headerContainer}>
      {/* Lado izquierdo: Logo */}
      <View style={styles.leftContainer}>
        <Image source={require('@/assets/images/logo-doctorbox.png')} style={styles.logo} />
      </View>

      {/* Lado derecho: Iconos */}
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={26} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={28} color={Colors.white} />
        </TouchableOpacity>

        {showDrawerButton && DrawerButton && (
          <DrawerButton />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: Spacing.md,
    backgroundColor: 'transparent', // Fondo transparente para el gradiente
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
    tintColor: Colors.white, // Hacemos el logo blanco para que contraste
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});

export default AppHeader;