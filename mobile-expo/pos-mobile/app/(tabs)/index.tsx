import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { TabScreenWrapper } from '@/components/ui/TabScreenWrapper';

export default function HomeScreen() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

  const getUserDisplayName = () => {
    if (!user) return 'Usuario';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    return user.email.split('@')[0];
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const quickActions = isDoctor ? [
    {
      id: 'appointments',
      title: 'Ver Citas',
      subtitle: 'Gestionar citas del día',
      icon: 'calendar',
      color: Colors.primary,
      onPress: () => router.push('/(tabs)/appointments'),
    },
    {
      id: 'patients',
      title: 'Pacientes',
      subtitle: 'Gestionar pacientes',
      icon: 'people',
      color: Colors.secondary,
      onPress: () => router.push('/(tabs)/patients'),
    },
    {
      id: 'chat',
      title: 'Chat',
      subtitle: 'Mensajes pendientes',
      icon: 'chatbubbles',
      color: Colors.info,
      onPress: () => router.push('/(tabs)/chat'),
    },
    {
      id: 'prescriptions',
      title: 'Recetas',
      subtitle: 'Crear prescripciones',
      icon: 'medical',
      color: Colors.success,
      onPress: () => router.push('/prescriptions'),
    },
  ] : [
    {
      id: 'appointments',
      title: 'Mis Citas',
      subtitle: 'Ver próximas citas',
      icon: 'calendar',
      color: Colors.primary,
      onPress: () => router.push('/(tabs)/appointments'),
    },
    {
      id: 'book',
      title: 'Agendar Cita',
      subtitle: 'Reservar nueva cita',
      icon: 'add-circle',
      color: Colors.secondary,
      onPress: () => router.push('/book-appointment'),
    },
    {
      id: 'chat',
      title: 'Chat',
      subtitle: 'Hablar con mi doctor',
      icon: 'chatbubbles',
      color: Colors.info,
      onPress: () => router.push('/(tabs)/chat'),
    },
    {
      id: 'history',
      title: 'Historial',
      subtitle: 'Ver mi historial médico',
      icon: 'document-text',
      color: Colors.success,
      onPress: () => router.push('/medical-history'),
    },
  ];

  const stats = isDoctor ? [
    {
      id: 'today',
      title: 'Hoy',
      value: '5',
      icon: 'calendar',
      color: Colors.primary,
    },
    {
      id: 'total',
      title: 'Total',
      value: '23',
      icon: 'checkmark-circle',
      color: Colors.success,
    },
    {
      id: 'patients',
      title: 'Pacientes',
      value: '12',
      icon: 'people',
      color: Colors.info,
    },
    {
      id: 'prescriptions',
      title: 'Recetas',
      value: '8',
      icon: 'document-text',
      color: Colors.warning,
    },
  ] : [
    {
      id: 'next',
      title: 'Mañana',
      value: 'Próxima Cita',
      icon: 'calendar',
      color: Colors.primary,
    },
    {
      id: 'total',
      title: 'Citas Totales',
      value: '15',
      icon: 'checkmark-circle',
      color: Colors.success,
    },
    {
      id: 'doctors',
      title: 'Doctores',
      value: '3',
      icon: 'star',
      color: Colors.info,
    },
    {
      id: 'prescriptions',
      title: 'Recetas',
      value: '8',
      icon: 'document-text',
      color: Colors.warning,
    },
  ];

  return (
    <TabScreenWrapper>
      <SafeAreaView style={CommonStyles.safeArea}>
        <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
        
        <ThemedView style={CommonStyles.container}>
          <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
                <ThemedText style={styles.userName}>{getUserDisplayName()}</ThemedText>
                <ThemedText style={styles.userRole}>
                  {isDoctor ? 'Doctor' : 'Paciente'}
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <Ionicons name="person-circle" size={48} color={Colors.secondary} />
              </TouchableOpacity>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsSection}>
              <ThemedText style={styles.sectionTitle}>
                {isDoctor ? 'Resumen del Día' : 'Mi Resumen'}
              </ThemedText>
              <View style={styles.statsGrid}>
                {stats.map((stat) => (
                  <View key={stat.id} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                      <Ionicons name={stat.icon as any} size={24} color={Colors.white} />
                    </View>
                    <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                    <ThemedText style={styles.statTitle}>{stat.title}</ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Acciones Rápidas */}
            <View style={styles.actionsSection}>
              <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
              <View style={styles.actionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionCard}
                    onPress={action.onPress}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                      <Ionicons name={action.icon as any} size={28} color={Colors.white} />
                    </View>
                    <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
                    <ThemedText style={styles.actionSubtitle}>{action.subtitle}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Información Adicional */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoTitle}>Tu información está segura</ThemedText>
                  <ThemedText style={styles.infoText}>
                    Todos tus datos médicos están protegidos con encriptación de nivel bancario.
                  </ThemedText>
                </View>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.medium,
  },
  profileButton: {
    padding: Spacing.xs,
  },
  statsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  statTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: Spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 14,
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    lineHeight: 18,
  },
});


