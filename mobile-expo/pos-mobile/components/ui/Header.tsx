import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, Typography, BordersAndShadows, CommonStyles } from '@/constants/GlobalStyles';
import { useLogout } from '@/hooks/useLogout';
import { useAppStore } from '@/store/appStore';
import NotificationBell from '@/components/notifications/NotificationBell';
import NotificationPanel from '@/components/notifications/NotificationPanel';

interface AppHeaderProps {
  showDrawerButton?: boolean;
  DrawerButton?: React.ComponentType<any>;
}

const AppHeader: React.FC<AppHeaderProps> = ({ showDrawerButton, DrawerButton }) => {
  const { handleLogout } = useLogout();
  const { user, isExploring } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotifications = () => {
    setShowNotifications(true);
  };

  // Determinar el saludo y estado del usuario
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getUserDisplayName = () => {
    if (isExploring) return 'Invitado';
    if (user?.first_name) return user.first_name;
    return 'Usuario';
  };

  const getUserRole = () => {
    if (isExploring) return 'Explorando la app';
    if (user?.role === 'doctor') return 'Doctor';
    if (user?.role === 'patient') return 'Paciente';
    return 'Usuario';
  };

  return (
    <View style={styles.headerContainer}>
      {/* Lado izquierdo: Saludo personalizado + Logo compacto */}
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo-doctorbox.png')} 
            style={styles.logoCompact} 
          />
        </View>
        
        <View style={styles.greetingContainer}>
          <ThemedText style={styles.greetingText}>{getGreeting()}</ThemedText>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{getUserDisplayName()}</ThemedText>
            <View style={styles.roleContainer}>
              <View style={[
                styles.roleBadge, 
                { 
                  backgroundColor: isExploring ? Colors.neutral[200] : 
                                  user?.role === 'doctor' ? Colors.primarySoft : Colors.successSoft 
                }
              ]}>
                <Text style={[
                  styles.roleText,
                  { 
                    color: isExploring ? Colors.neutral[600] : 
                           user?.role === 'doctor' ? Colors.primary : Colors.success 
                  }
                ]}>
                  {getUserRole()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Lado derecho: Acciones */}
      <View style={styles.rightSection}>
        {/* Notificaciones */}
        <TouchableOpacity style={styles.actionButton} onPress={handleNotifications}>
          <NotificationBell onPress={handleNotifications} />
        </TouchableOpacity>

        {/* Menú/Configuración */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <View style={styles.iconWrapper}>
            <Ionicons name="settings-outline" size={22} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Drawer button si es necesario */}
        {showDrawerButton && DrawerButton && (
          <View style={styles.drawerButtonContainer}>
            <DrawerButton />
          </View>
        )}
      </View>

      <NotificationPanel 
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent', // Transparente para gradiente
  },
  
  // Sección izquierda moderna
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: BordersAndShadows.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  logoCompact: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  greetingContainer: {
    flex: 1,
    marginLeft: Spacing.xs,
  },
  greetingText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.sm,
    marginBottom: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.white,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.lg,
    letterSpacing: Typography.letterSpacing.tight,
  },
  roleContainer: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BordersAndShadows.borderRadius.full,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xs,
  },
  
  // Sección derecha moderna
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BordersAndShadows.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra sutil
    ...BordersAndShadows.shadows.xs,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerButtonContainer: {
    marginLeft: Spacing.xs,
  },
});

export default AppHeader;