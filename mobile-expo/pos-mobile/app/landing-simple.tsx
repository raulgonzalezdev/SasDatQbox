import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { forceAppReset, debugStorage } from '@/utils/debugUtils';

export default function SimpleLandingPage() {
  console.log('🏠 Landing Simple cargando...');
  
  const { hidePromotions } = useAppStore();
  const [hidePromos] = useState(hidePromotions);

  const handleDebugStorage = () => {
    debugStorage();
    console.log('📋 Debug storage ejecutado - revisa la consola');
  };

  const handleDownloadApp = () => {
    console.log('📱 Descarga de app solicitada');
    // Aquí podría ir lógica de descarga real
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Simple */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={40} color={Colors.white} />
            <ThemedText style={styles.logoText}>DoctorBox</ThemedText>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText style={styles.heroTitle}>Bienvenido a DoctorBox</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Plataforma médica integral para doctores y pacientes
          </ThemedText>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => {
                console.log('🔄 Navegando a registro...');
                router.push('/auth/register');
              }}
            >
              <ThemedText style={styles.primaryButtonText}>Registrarse</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                console.log('🔄 Navegando a login...');
                router.push('/auth/login');
              }}
            >
              <ThemedText style={styles.secondaryButtonText}>Iniciar Sesión</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>Características Principales</ThemedText>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="medical" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Consultas Médicas</ThemedText>
                <ThemedText style={styles.featureText}>Agenda y gestiona citas médicas</ThemedText>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Chat Médico</ThemedText>
                <ThemedText style={styles.featureText}>Comunicación segura con pacientes</ThemedText>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Recetas Digitales</ThemedText>
                <ThemedText style={styles.featureText}>Genera y gestiona recetas electrónicas</ThemedText>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="videocam" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Videollamadas</ThemedText>
                <ThemedText style={styles.featureText}>Consultas virtuales de alta calidad</ThemedText>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Agenda Inteligente</ThemedText>
                <ThemedText style={styles.featureText}>Gestión automática de horarios</ThemedText>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Seguridad Médica</ThemedText>
                <ThemedText style={styles.featureText}>Cumple con estándares HIPAA</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        {!hidePromos && (
          <View style={styles.pricingSection}>
            <ThemedText style={styles.sectionTitle}>Planes de Precios</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Elige el plan que mejor se adapte a tu práctica médica
            </ThemedText>
            
            <View style={styles.plansContainer}>
              {/* Plan Gratis */}
              <View style={styles.planCard}>
                <ThemedText style={styles.planName}>Gratis</ThemedText>
                <View style={styles.planPrice}>
                  <ThemedText style={styles.planPriceAmount}>$0</ThemedText>
                  <ThemedText style={styles.planPricePeriod}>/mes</ThemedText>
                </View>
                <ThemedText style={styles.planDescription}>
                  Ideal para empezar a digitalizar tu consulta. 15 pacientes máximo.
                </ThemedText>
                <TouchableOpacity style={styles.planButton}>
                  <ThemedText style={styles.planButtonText}>Comenzar Gratis</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Plan Estándar */}
              <View style={[styles.planCard, styles.recommendedPlan]}>
                <View style={styles.recommendedBadge}>
                  <ThemedText style={styles.recommendedText}>Más Popular</ThemedText>
                </View>
                <ThemedText style={styles.planName}>Estándar</ThemedText>
                <View style={styles.planPrice}>
                  <ThemedText style={styles.planPriceAmount}>$49</ThemedText>
                  <ThemedText style={styles.planPricePeriod}>/mes</ThemedText>
                </View>
                <ThemedText style={styles.planDescription}>
                  Todas las funcionalidades, hasta 500 pacientes y consultas ilimitadas.
                </ThemedText>
                <TouchableOpacity style={[styles.planButton, styles.primaryPlanButton]}>
                  <ThemedText style={[styles.planButtonText, styles.primaryPlanButtonText]}>Suscribirse</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Plan Premium */}
              <View style={styles.planCard}>
                <ThemedText style={styles.planName}>Premium</ThemedText>
                <View style={styles.planPrice}>
                  <ThemedText style={styles.planPriceAmount}>$199</ThemedText>
                  <ThemedText style={styles.planPricePeriod}>/mes</ThemedText>
                </View>
                <ThemedText style={styles.planDescription}>
                  Para clínicas con múltiples consultorios y asistentes. Pacientes ilimitados.
                </ThemedText>
                <TouchableOpacity style={styles.planButton}>
                  <ThemedText style={styles.planButtonText}>Suscribirse</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Debug Section - Solo en desarrollo */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <ThemedText style={styles.debugTitle}>🔧 Herramientas de Debug</ThemedText>
            <View style={styles.debugButtons}>
              <TouchableOpacity style={styles.debugButton} onPress={handleDebugStorage}>
                <ThemedText style={styles.debugButtonText}>Ver Storage</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.debugButton} onPress={forceAppReset}>
                <ThemedText style={styles.debugButtonText}>Reset App</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            © {new Date().getFullYear()} DoctorBox. Todos los derechos reservados.
          </ThemedText>
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
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoText: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  heroSection: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  heroTitle: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
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
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
  },
  featuresSection: {
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  featuresList: {
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.md,
    ...BordersAndShadows.shadows.sm,
  },
  featureContent: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  featureText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  debugSection: {
    backgroundColor: Colors.lightGray,
    padding: Spacing.lg,
    margin: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.danger,
  },
  debugTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  debugButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  debugButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.sm,
  },
  debugButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
  },
  footer: {
    backgroundColor: Colors.dark,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
  },
  // Pricing Section Styles
  pricingSection: {
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  plansContainer: {
    gap: Spacing.lg,
  },
  planCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  recommendedPlan: {
    borderColor: Colors.primary,
    transform: [{ scale: 1.02 }],
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.sm,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold as any,
  },
  planName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  planPrice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  planPriceAmount: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  planPricePeriod: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  planDescription: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  planButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.md,
    alignItems: 'center',
  },
  planButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
  },
  primaryPlanButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  primaryPlanButtonText: {
    color: Colors.white,
  },
});
