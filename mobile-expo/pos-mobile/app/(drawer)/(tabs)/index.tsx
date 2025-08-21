import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import AppHeader from '@/components/ui/Header'; // Importamos el header
import { LinearGradient } from 'expo-linear-gradient'; // Importamos el gradiente

export default function HomeScreen() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const summaryCards = [
    {
      id: 'next_appointment',
      title: 'Próxima Cita',
      value: 'Mañana',
      icon: 'calendar',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'total_appointments',
      title: 'Citas Totales',
      value: '15',
      icon: 'checkmark-circle',
      color: Colors.success,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'new_patients',
      title: 'Nuevos Pacientes',
      value: '3',
      icon: 'person-add',
      color: Colors.info,
      route: '/(drawer)/(tabs)/patients',
    },
    {
      id: 'unread_messages',
      title: 'Mensajes Sin Leer',
      value: '2',
      icon: 'chatbubbles',
      color: Colors.warning,
      route: '/(tabs)/chat',
    },
    {
      id: 'premium_features',
      title: 'Funciones Premium',
      value: 'Explorar',
      icon: 'star',
      color: Colors.info,
      route: '/(drawer)/explore',
    },
    {
      id: 'profile_completion',
      title: 'Perfil Completo',
      value: '80%',
      icon: 'document-text',
      color: Colors.warning,
      route: '/(drawer)/profile',
    },
  ];

  const quickActions = [
    {
      id: 'my_appointments',
      title: 'Mis Citas',
      subtitle: 'Ver próximas citas',
      icon: 'calendar',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'schedule_appointment',
      title: 'Agendar Cita',
      subtitle: 'Reservar nueva cita',
      icon: 'add-circle',
      color: Colors.info,
      route: '/(drawer)/(tabs)/appointments',
    },
  ];

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <CustomStatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{ height: 80, paddingTop: 25 }}
      >
        <AppHeader />
      </LinearGradient>

      <SafeAreaView style={styles.safeAreaContent}>
        <ThemedView style={CommonStyles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* El contenido de saludo y tarjetas se mueve aquí adentro */}
            <View style={styles.greetingSection}>
              <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
              <ThemedText style={styles.userName}>{`${user?.first_name || 'Usuario'} ${user?.last_name || ''}`}</ThemedText>
            </View>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Mi Resumen</ThemedText>
              <View style={styles.summaryGrid}>
                {summaryCards.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={styles.summaryCard}
                    onPress={() => handleCardPress(card.route)}
                  >
                    <View style={[styles.summaryIcon, { backgroundColor: card.color }]}>
                      <Ionicons name={card.icon as any} size={24} color={Colors.white} />
                    </View>
                    <ThemedText style={styles.summaryTitle}>{card.title}</ThemedText>
                    <ThemedText style={styles.summaryValue}>{card.value}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionCard}
                    onPress={() => handleCardPress(action.route)}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                      <Ionicons name={action.icon as any} size={24} color={Colors.white} />
                    </View>
                    <View style={styles.quickActionContent}>
                      <ThemedText style={styles.quickActionTitle}>{action.title}</ThemedText>
                      <ThemedText style={styles.quickActionSubtitle}>{action.subtitle}</ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContent: {
    flex: 1,
    backgroundColor: Colors.background, // Fondo claro para el contenido
  },
  greetingSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  userName: {
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    textAlign: 'center',
  },
  quickActionsGrid: {
    paddingHorizontal: Spacing.lg,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  quickActionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
});
