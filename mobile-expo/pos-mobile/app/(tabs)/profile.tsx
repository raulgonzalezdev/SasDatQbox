import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { logout } from '@/services/auth';

export default function ProfileScreen() {
  const { user, setUser, setAuthenticated } = useAppStore();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              setUser(null);
              setAuthenticated(false);
              router.replace('/landing');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
            }
          },
        },
      ]
    );
  };

  const getUserDisplayName = () => {
    if (!user) return 'Usuario';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    return user.email.split('@')[0];
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleText = () => {
    switch (user?.role) {
      case 'doctor':
        return 'Doctor';
      case 'patient':
        return 'Paciente';
      case 'admin':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  const menuItems = [
    {
      id: 'personal',
      title: 'Información Personal',
      subtitle: 'Editar tu perfil y datos personales',
      icon: 'person',
      color: Colors.primary,
      onPress: () => router.push('/edit-profile'),
    },
    {
      id: 'security',
      title: 'Seguridad',
      subtitle: 'Cambiar contraseña y configuración de seguridad',
      icon: 'shield-checkmark',
      color: Colors.secondary,
      onPress: () => router.push('/security'),
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      subtitle: 'Configurar alertas y notificaciones',
      icon: 'notifications',
      color: Colors.info,
      onPress: () => router.push('/notifications'),
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      subtitle: 'Configuración de privacidad y datos',
      icon: 'lock-closed',
      color: Colors.warning,
      onPress: () => router.push('/privacy'),
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      subtitle: 'Centro de ayuda y contacto',
      icon: 'help-circle',
      color: Colors.success,
      onPress: () => router.push('/help'),
    },
    {
      id: 'about',
      title: 'Acerca de',
      subtitle: 'Información de la aplicación',
      icon: 'information-circle',
      color: Colors.darkGray,
      onPress: () => router.push('/about'),
    },
  ];

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {/* Header del perfil */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>{getUserInitials()}</ThemedText>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>{getUserDisplayName()}</ThemedText>
              <ThemedText style={styles.profileEmail}>{user?.email}</ThemedText>
              <View style={styles.roleBadge}>
                <ThemedText style={styles.roleText}>{getRoleText()}</ThemedText>
              </View>
            </View>
          </View>

          {/* Estadísticas del perfil */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <ThemedText style={styles.statNumber}>15</ThemedText>
              <ThemedText style={styles.statLabel}>Citas</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="chatbubbles" size={24} color={Colors.secondary} />
              <ThemedText style={styles.statNumber}>8</ThemedText>
              <ThemedText style={styles.statLabel}>Chats</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={24} color={Colors.success} />
              <ThemedText style={styles.statNumber}>12</ThemedText>
              <ThemedText style={styles.statLabel}>Recetas</ThemedText>
            </View>
          </View>

          {/* Menú de opciones */}
          <View style={styles.menuSection}>
            <ThemedText style={styles.sectionTitle}>Configuración</ThemedText>
            
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.white} />
                </View>
                <View style={styles.menuContent}>
                  <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>{item.subtitle}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Botón de cerrar sesión */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color={Colors.white} />
              <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Información de la app */}
          <View style={styles.appInfoSection}>
            <ThemedText style={styles.appVersion}>BoxDoctor v1.0.0</ThemedText>
            <ThemedText style={styles.appCopyright}>
              © 2024 BoxDoctor. Todos los derechos reservados.
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.lg,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  roleText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...BordersAndShadows.shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  menuSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  logoutSection: {
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.sm,
  },
  logoutText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.sm,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  appVersion: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  appCopyright: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
});
