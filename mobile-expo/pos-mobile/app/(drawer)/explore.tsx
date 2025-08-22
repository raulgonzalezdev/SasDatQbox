import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/ui/Header';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, Spacing, BordersAndShadows, Typography, CommonStyles } from '@/constants/GlobalStyles';
import { isUserPremium, shouldShowPromotions, getCurrentUser } from '@/store/appStore';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { PremiumFeature } from '@/components/ui/PremiumFeature';

export default function ExploreScreen() {
  const isPremium = isUserPremium();
  const showPromotions = shouldShowPromotions();
  const user = getCurrentUser();
  
  // Recursos médicos útiles
  const medicalResources = [
    { id: 1, title: 'Calculadora de IMC', icon: 'calculator-outline', color: Colors.primary, premium: false, route: null },
    { id: 2, title: 'Conversión de Unidades', icon: 'swap-horizontal-outline', color: Colors.info, premium: false, route: null },
    { id: 3, title: 'Guías de Diagnóstico', icon: 'book-outline', color: Colors.success, premium: true, route: null },
    { id: 4, title: 'Calculadora de Dosis', icon: 'medical-outline', color: Colors.warning, premium: true, route: null },
    { id: 5, title: 'Atlas Médico', icon: 'body-outline', color: Colors.danger, premium: true, route: null },
    { id: 6, title: 'Referencia de Medicamentos', icon: 'library-outline', color: Colors.secondary, premium: true, route: null },
  ];

  const handleResourcePress = (resource) => {
    if (resource.premium && !isPremium) {
      // Si es premium y el usuario no es premium, redirigir a planes
      router.push('/landing');
    } else {
      // Implementar funcionalidades médicas útiles
      switch (resource.id) {
        case 1: // Calculadora de IMC
          alert('Calculadora de IMC - Funcionalidad en desarrollo');
          break;
        case 2: // Conversión de Unidades
          alert('Conversión de Unidades Médicas - Funcionalidad en desarrollo');
          break;
        default:
          alert(`${resource.title} - Funcionalidad en desarrollo`);
      }
    }
  };

  const handleSubscriptionPress = () => {
    router.push('/landing');
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <Header 
        title="Centro de Recursos"
        subtitle="Herramientas médicas profesionales"
        showHelp={false}
      />

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content}>
          {/* Banner principal */}
          <View style={styles.mainBanner}>
            <ThemedText style={styles.mainBannerTitle}>
              {isPremium ? 'Recursos médicos completos' : 'Herramientas médicas esenciales'}
          </ThemedText>
            <ThemedText style={styles.mainBannerSubtitle}>
              {isPremium 
                ? 'Accede a calculadoras, guías y referencias médicas profesionales.' 
                : 'Utiliza nuestras herramientas básicas y descubre las funciones premium'}
            </ThemedText>
            
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="medical" size={16} color={Colors.white} />
                <ThemedText style={styles.premiumBadgeText}>Médico Pro</ThemedText>
              </View>
            )}
          </View>

          {/* Recursos médicos */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Herramientas médicas</ThemedText>
            <View style={styles.featuresGrid}>
              {medicalResources.map(resource => (
                <TouchableOpacity 
                  key={resource.id} 
                  style={[
                    styles.featureItem,
                    resource.premium && !isPremium && styles.premiumFeatureItem
                  ]}
                  onPress={() => handleResourcePress(resource)}
                >
                  <View style={[styles.featureIconContainer, { backgroundColor: resource.color }]}>
                    <Ionicons name={resource.icon} size={24} color={Colors.white} />
                  </View>
                  <ThemedText style={styles.featureTitle}>{resource.title}</ThemedText>
                  
                  {resource.premium && !isPremium && (
                    <View style={styles.featurePremiumBadge}>
                      <Ionicons name="lock-closed" size={12} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Banner de suscripción - Solo se muestra si no es premium y showPromotions es true */}
          {!isPremium && showPromotions && (
            <View style={styles.subscriptionBanner}>
              <View style={styles.subscriptionContent}>
                <ThemedText style={styles.subscriptionTitle}>DoctorBox Pro</ThemedText>
                <ThemedText style={styles.subscriptionText}>
                  Desbloquea herramientas médicas avanzadas y mejora tu práctica profesional
                </ThemedText>
                <TouchableOpacity 
                  style={styles.subscriptionButton}
                  onPress={handleSubscriptionPress}
                >
                  <ThemedText style={styles.subscriptionButtonText}>Ser Premium</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.subscriptionImageContainer}>
                <Ionicons name="medical" size={60} color={Colors.primary} />
              </View>
            </View>
          )}

          {/* Soporte */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>¿Necesitas ayuda?</ThemedText>
            <TouchableOpacity 
              style={styles.supportItem}
              onPress={() => router.push('/help')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.secondary} />
              <View style={styles.supportItemContent}>
                <ThemedText style={styles.supportItemTitle}>Soporte médico especializado</ThemedText>
                <ThemedText style={styles.supportItemText}>
                  Nuestro equipo médico-técnico está disponible 24/7
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainBanner: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  mainBannerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  mainBannerSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.xs,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
    position: 'relative',
  },
  premiumFeatureItem: {
    opacity: 0.8,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    textAlign: 'center',
    color: Colors.dark,
  },
  featurePremiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.dark,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  subscriptionContent: {
    flex: 3,
  },
  subscriptionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subscriptionText: {
    fontSize: Typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.sm,
  },
  subscriptionButton: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  subscriptionButtonText: {
    color: Colors.dark,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  subscriptionImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  supportItemContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  supportItemTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  supportItemText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: Colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
