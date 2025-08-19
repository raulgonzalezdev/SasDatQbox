import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Linking, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

export default function LandingPage() {
  const { hidePromotions, setHidePromotions } = useAppStore();
  const [hidePromos, setHidePromos] = useState(hidePromotions);
  
  // Planes disponibles para BoxDoctor
  const plans = [
    {
      id: 1,
      name: 'Gratuito',
      price: '$0',
      period: 'mes',
      features: [
        'Agendar citas básicas',
        'Chat con el doctor',
        'Historial médico básico',
        'Soporte por email',
      ],
      recommended: false,
      color: Colors.darkGray,
      isPremium: false,
    },
    {
      id: 2,
      name: 'Básico',
      price: '$9.99',
      period: 'mes',
      features: [
        'Agendar citas ilimitadas',
        'Chat prioritario',
        'Historial médico completo',
        'Recordatorios de citas',
        'Soporte prioritario',
      ],
      recommended: false,
      color: Colors.info,
      isPremium: true,
    },
    {
      id: 3,
      name: 'Premium',
      price: '$19.99',
      period: 'mes',
      features: [
        'Todas las funciones básicas',
        'Video consultas',
        'Prescripciones digitales',
        'Análisis médicos',
        'Soporte 24/7',
        'Acceso a especialistas',
      ],
      recommended: true,
      color: Colors.primary,
      isPremium: true,
    },
    {
      id: 4,
      name: 'Empresarial',
      price: '$39.99',
      period: 'mes',
      features: [
        'Múltiples doctores',
        'Gestión de clínica',
        'Todas las funciones premium',
        'API para integraciones',
        'Soporte 24/7',
        'Capacitación personalizada',
      ],
      recommended: false,
      color: Colors.secondary,
      isPremium: true,
    },
  ];

  const handleRegister = (planId: number) => {
    // Redirigir a la pantalla de registro
    router.push('/auth/register');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleDownloadApp = () => {
    // Aquí se puede agregar la lógica para descargar la app
    Alert.alert(
      'Descargar App',
      'La app ya está disponible en tu dispositivo. Si necesitas la versión web, visita boxdoctor.com',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <ThemedText style={styles.logo}>BoxDoctor</ThemedText>
            <ThemedText style={styles.tagline}>Tu salud en tus manos</ThemedText>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>Iniciar Sesión</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText style={styles.heroTitle}>
            Conecta con tu doctor de forma segura y fácil
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            BoxDoctor te permite agendar citas, chatear con tu médico y gestionar tu salud desde cualquier lugar
          </ThemedText>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/auth/register')}>
              <ThemedText style={styles.primaryButtonText}>Comenzar Ahora</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadApp}>
              <Ionicons name="download" size={20} color={Colors.secondary} />
              <ThemedText style={styles.secondaryButtonText}>Descargar App</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>¿Por qué elegir BoxDoctor?</ThemedText>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="calendar" size={32} color={Colors.primary} />
              </View>
              <ThemedText style={styles.featureTitle}>Agenda Citas</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Reserva tu cita médica en segundos, 24/7
              </ThemedText>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="chatbubbles" size={32} color={Colors.primary} />
              </View>
              <ThemedText style={styles.featureTitle}>Chat Médico</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Comunícate directamente con tu doctor
              </ThemedText>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="medical" size={32} color={Colors.primary} />
              </View>
              <ThemedText style={styles.featureTitle}>Historial Médico</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Accede a tu información médica completa
              </ThemedText>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
              </View>
              <ThemedText style={styles.featureTitle}>100% Seguro</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Tus datos médicos están protegidos
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        {!hidePromos && (
          <View style={styles.pricingSection}>
            <ThemedText style={styles.sectionTitle}>Planes y Precios</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Elige el plan que mejor se adapte a tus necesidades
            </ThemedText>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansContainer}>
              {plans.map((plan) => (
                <View key={plan.id} style={[styles.planCard, plan.recommended && styles.recommendedPlan]}>
                  {plan.recommended && (
                    <View style={styles.recommendedBadge}>
                      <ThemedText style={styles.recommendedText}>Recomendado</ThemedText>
                    </View>
                  )}
                  
                  <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                  <View style={styles.planPrice}>
                    <ThemedText style={styles.planPriceAmount}>{plan.price}</ThemedText>
                    <ThemedText style={styles.planPricePeriod}>/{plan.period}</ThemedText>
                  </View>

                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.planFeature}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                        <ThemedText style={styles.planFeatureText}>{feature}</ThemedText>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.planButton, { backgroundColor: plan.color }]}
                    onPress={() => handleRegister(plan.id)}
                  >
                    <ThemedText style={styles.planButtonText}>
                      {plan.isPremium ? 'Comenzar Prueba' : 'Registrarse Gratis'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <ThemedText style={styles.footerLogo}>BoxDoctor</ThemedText>
            <ThemedText style={styles.footerTagline}>Tu salud, nuestra prioridad</ThemedText>
            
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/about')}>
                <ThemedText style={styles.footerLink}>Acerca de</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/help')}>
                <ThemedText style={styles.footerLink}>Ayuda</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')}>
                <ThemedText style={styles.footerLink}>Configuración</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.footerCopyright}>
              © 2024 BoxDoctor. Todos los derechos reservados.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.secondary,
  },
  tagline: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BordersAndShadows.borderRadius.md,
    backgroundColor: Colors.secondary,
  },
  loginButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.medium,
  },
  heroSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSizes.md,
  },
  featuresSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.lg,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  featureDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  pricingSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.lightGray,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  plansContainer: {
    paddingVertical: Spacing.lg,
  },
  planCard: {
    width: 280,
    backgroundColor: Colors.white,
    marginRight: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.md,
    position: 'relative',
  },
  recommendedPlan: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  planName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  planPrice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  planPriceAmount: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.secondary,
  },
  planPricePeriod: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  planFeatures: {
    marginBottom: Spacing.lg,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  planFeatureText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  planButton: {
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.md,
    alignItems: 'center',
  },
  planButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  footer: {
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  footerTagline: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  footerLink: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
  },
  footerCopyright: {
    color: Colors.darkGray,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
  },
}); 