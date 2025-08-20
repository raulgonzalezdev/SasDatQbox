import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

export default function MoreScreen() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

  const menuSections = [
    {
      title: 'Gestión',
      items: [
        {
          id: 'explore',
          title: 'Explorar',
          subtitle: 'Descubre nuevas funciones',
          icon: 'compass',
          color: Colors.primary,
          route: '/(tabs)/explore',
        },
        ...(isDoctor ? [
          {
            id: 'inventory',
            title: 'Inventario',
            subtitle: 'Gestionar productos y stock',
            icon: 'cube',
            color: '#4CAF50',
            route: '/(tabs)/inventario',
          },
          {
            id: 'sales',
            title: 'Ventas',
            subtitle: 'Historial de ventas',
            icon: 'card',
            color: '#2196F3',
            route: '/(tabs)/ventas',
          },
          {
            id: 'expenses',
            title: 'Gastos',
            subtitle: 'Control de gastos',
            icon: 'wallet',
            color: '#FF9800',
            route: '/(tabs)/gastos',
          },
          {
            id: 'reports',
            title: 'Reportes',
            subtitle: 'Análisis y estadísticas',
            icon: 'bar-chart',
            color: '#9C27B0',
            route: '/(tabs)/reportes',
          },
        ] : []),
      ],
    },
    {
      title: 'Cuenta',
      items: [
        {
          id: 'profile',
          title: 'Perfil',
          subtitle: 'Información personal',
          icon: 'person',
          color: Colors.secondary,
          route: '/(tabs)/profile',
        },
        {
          id: 'settings',
          title: 'Configuración',
          subtitle: 'Ajustes de la aplicación',
          icon: 'settings',
          color: Colors.info,
          route: '/settings',
        },
        {
          id: 'help',
          title: 'Ayuda',
          subtitle: 'Soporte y documentación',
          icon: 'help-circle',
          color: Colors.success,
          route: '/help',
        },
      ],
    },
  ];

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <ThemedView style={CommonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>Más Opciones</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Accede a todas las funciones
            </ThemedText>
          </View>
        </View>

        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
              
              <View style={styles.menuGrid}>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item.route)}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon as any} size={24} color={Colors.white} />
                    </View>
                    <View style={styles.menuContent}>
                      <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.menuSubtitle}>{item.subtitle}</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  menuGrid: {
    paddingHorizontal: Spacing.lg,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  menuSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xl,
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
