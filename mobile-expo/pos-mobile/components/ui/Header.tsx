import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows } from '@/constants/GlobalStyles';
import { SideMenu } from './SideMenu';
import { useAppStore, getCurrentUser, isUserAuthenticated } from '@/store/appStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onHelpPress?: () => void;
  showHelp?: boolean;
}

export function Header({ 
  title, 
  subtitle = "Propietario", 
  onHelpPress, 
  showHelp = true 
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const isAuthenticated = isUserAuthenticated();
  const user = getCurrentUser();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  // Determinar las iniciales o el icono para mostrar
  const renderUserIcon = () => {
    if (isAuthenticated && user) {
      return (
        <ThemedText style={styles.userInitials}>
          {user.name.substring(0, 1).toUpperCase()}
        </ThemedText>
      );
    } else {
      return <Ionicons name="person" size={24} color="black" />;
    }
  };

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 12 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[
              styles.userIconButton, 
              isAuthenticated ? styles.authenticatedUserIcon : {}
            ]}
            onPress={toggleMenu}
          >
            {renderUserIcon()}
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <ThemedText style={styles.storeName}>{title}</ThemedText>
            <ThemedText style={styles.userRole}>
              {isAuthenticated && user ? user.businessName : subtitle}
            </ThemedText>
          </View>
        </View>
        
        {showHelp && (
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={onHelpPress}
          >
            <Ionicons name="help-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <SideMenu visible={menuVisible} onClose={closeMenu} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    ...BordersAndShadows.shadows.sm,
  },
  authenticatedUserIcon: {
    backgroundColor: Colors.secondary,
  },
  userInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  userInfo: {
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 0,
  },
  userRole: {
    fontSize: 14,
    color: Colors.dark,
    opacity: 0.8,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
}); 