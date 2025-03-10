import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore, getCurrentUser, isUserAuthenticated } from '@/store/appStore';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { logout } = useAppStore();
  const isAuthenticated = isUserAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    onClose();
    router.replace('/auth/login');
  };

  const handleLogin = () => {
    onClose();
    router.push('/auth/login');
  };

  const handleRegister = () => {
    onClose();
    router.push('/auth/register');
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'Mi Perfil',
      icon: 'person-outline',
      onPress: () => {
        onClose();
        router.push('/profile');
      },
      requiresAuth: true,
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: 'settings-outline',
      onPress: () => {
        onClose();
        router.push('/settings');
      },
      requiresAuth: false,
    },
    {
      id: 'help',
      title: 'Ayuda',
      icon: 'help-circle-outline',
      onPress: () => {
        onClose();
        router.push('/help');
      },
      requiresAuth: false,
    },
    {
      id: 'about',
      title: 'Acerca de',
      icon: 'information-circle-outline',
      onPress: () => {
        onClose();
        router.push('/about');
      },
      requiresAuth: false,
    },
    {
      id: 'premium',
      title: 'Planes Premium',
      icon: 'star-outline',
      onPress: () => {
        onClose();
        router.push('/landing');
      },
      requiresAuth: false,
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.menu}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.appBranding}>
            <ThemedText style={styles.appName}>DatqboxPos</ThemedText>
            <ThemedText style={styles.appVersion}>v1.0.0</ThemedText>
          </View>

          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              {isAuthenticated && user ? (
                <ThemedText style={styles.userInitials}>
                  {user.name.substring(0, 1).toUpperCase()}
                </ThemedText>
              ) : (
                <Ionicons name="person" size={40} color={Colors.white} />
              )}
            </View>
            
            {isAuthenticated && user ? (
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{user.name}</ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                <ThemedText style={styles.userBusiness}>{user.businessName}</ThemedText>
              </View>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <ThemedText style={styles.loginButtonText}>Iniciar Sesión</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={handleRegister}
                >
                  <ThemedText style={styles.registerButtonText}>Registrarse</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView style={styles.menuItems}>
            {menuItems.map(item => {
              // Si el elemento requiere autenticación y el usuario no está autenticado, no lo mostramos
              if (item.requiresAuth && !isAuthenticated) {
                return null;
              }

              return (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <Ionicons name={item.icon} size={24} color={Colors.dark} style={styles.menuItemIcon} />
                  <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={Colors.danger} style={styles.menuItemIcon} />
              <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <ThemedText style={styles.version}>Versión 1.0.0</ThemedText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: '80%',
    height: '100%',
    backgroundColor: Colors.white,
    ...BordersAndShadows.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBranding: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  appName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.secondary,
  },
  appVersion: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  userSection: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    alignItems: 'center',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userInitials: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  userBusiness: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.secondary,
  },
  authButtons: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  loginButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  registerButton: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  registerButtonText: {
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuItemIcon: {
    marginRight: Spacing.md,
  },
  menuItemText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  logoutText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.danger,
    fontWeight: Typography.fontWeights.medium,
  },
  footer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  version: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
}); 