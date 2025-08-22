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
          <ThemedText style={styles.heroTitle}>Conectamos Salud</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            La plataforma que une pacientes con profesionales de la salud cerca de ti
          </ThemedText>
          <ThemedText style={styles.heroDescription}>
            🏥 Encuentra doctores • 📱 Consultas fáciles • 💳 Paga en cuotas • ⭐ Construye tu reputación
          </ThemedText>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => {
                console.log('🔄 Navegando a registro como paciente...');
                router.push('/auth/register');
              }}
            >
              <Ionicons name="person" size={20} color={Colors.white} />
              <ThemedText style={styles.primaryButtonText}>Soy Paciente</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                console.log('🔄 Navegando a registro como doctor...');
                router.push('/auth/register');
              }}
            >
              <Ionicons name="medical" size={20} color={Colors.primary} />
              <ThemedText style={styles.secondaryButtonText}>Soy Doctor</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => {
              console.log('🔄 Navegando a login...');
              router.push('/auth/login');
            }}
          >
            <ThemedText style={styles.loginLinkText}>¿Ya tienes cuenta? Inicia sesión</ThemedText>
          </TouchableOpacity>
        </View>

        {/* How It Works Section */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>¿Cómo Funciona?</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Conectamos pacientes y doctores en 3 simples pasos
          </ThemedText>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepText}>1</ThemedText>
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Encuentra tu Doctor</ThemedText>
                <ThemedText style={styles.featureText}>Busca profesionales cerca de ti según tu ubicación y especialidad</ThemedText>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepText}>2</ThemedText>
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Elige tu Paquete</ThemedText>
                <ThemedText style={styles.featureText}>Selecciona consultas individuales o paquetes con financiamiento</ThemedText>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepText}>3</ThemedText>
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>Consulta y Califica</ThemedText>
                <ThemedText style={styles.featureText}>Recibe atención médica y construye tu reputación como paciente</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <ThemedText style={styles.sectionTitle}>Beneficios para Todos</ThemedText>
          
          <View style={styles.benefitsContainer}>
            {/* Para Pacientes */}
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <Ionicons name="person-circle" size={32} color={Colors.success} />
                <ThemedText style={styles.benefitTitle}>Para Pacientes</ThemedText>
              </View>
              <View style={styles.benefitList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="location" size={16} color={Colors.success} />
                  <ThemedText style={styles.benefitText}>Doctores cerca de ti</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="card" size={16} color={Colors.success} />
                  <ThemedText style={styles.benefitText}>Pago en cuotas</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="star" size={16} color={Colors.success} />
                  <ThemedText style={styles.benefitText}>Sistema de reputación</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="document-text" size={16} color={Colors.success} />
                  <ThemedText style={styles.benefitText}>Historial médico digital</ThemedText>
                </View>
              </View>
            </View>

            {/* Para Doctores */}
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <Ionicons name="medical" size={32} color={Colors.primary} />
                <ThemedText style={styles.benefitTitle}>Para Doctores</ThemedText>
              </View>
              <View style={styles.benefitList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="people" size={16} color={Colors.primary} />
                  <ThemedText style={styles.benefitText}>Más pacientes</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="cash" size={16} color={Colors.primary} />
                  <ThemedText style={styles.benefitText}>Pagos garantizados</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="time" size={16} color={Colors.primary} />
                  <ThemedText style={styles.benefitText}>Gestión simplificada</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="trending-up" size={16} color={Colors.primary} />
                  <ThemedText style={styles.benefitText}>Crecimiento profesional</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Value Proposition Section */}
        <View style={styles.valueSection}>
          <ThemedText style={styles.sectionTitle}>¿Por Qué Elegirnos?</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Somos el puente entre pacientes y profesionales de la salud
          </ThemedText>
          
          <View style={styles.valueContainer}>
            <View style={styles.valueCard}>
              <Ionicons name="globe" size={48} color={Colors.primary} />
              <ThemedText style={styles.valueTitle}>Cobertura Nacional</ThemedText>
              <ThemedText style={styles.valueText}>
                Encuentra doctores en toda Venezuela, desde Caracas hasta Maracaibo
              </ThemedText>
            </View>

            <View style={styles.valueCard}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.success} />
              <ThemedText style={styles.valueTitle}>Pagos Seguros</ThemedText>
              <ThemedText style={styles.valueText}>
                Sistema de pagos protegido con garantía para doctores y pacientes
              </ThemedText>
            </View>

            <View style={styles.valueCard}>
              <Ionicons name="trending-up" size={48} color={Colors.warning} />
              <ThemedText style={styles.valueTitle}>Crecimiento Mutuo</ThemedText>
              <ThemedText style={styles.valueText}>
                A mayor reputación, mejores beneficios y acceso a financiamiento
              </ThemedText>
            </View>
          </View>

          <View style={styles.commissionInfo}>
            <View style={styles.commissionCard}>
              <Ionicons name="handshake" size={32} color={Colors.primary} />
              <View style={styles.commissionContent}>
                <ThemedText style={styles.commissionTitle}>Modelo Win-Win</ThemedText>
                <ThemedText style={styles.commissionText}>
                  Solo cobramos una pequeña comisión por transacciones exitosas. 
                  Si no hay consultas, no hay costos.
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

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
  heroDescription: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BordersAndShadows.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
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
    paddingHorizontal: Spacing.xl,
    borderRadius: BordersAndShadows.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
  },
  loginLink: {
    marginTop: Spacing.lg,
  },
  loginLinkText: {
    color: Colors.darkGray,
    fontSize: Typography.fontSizes.md,
    textAlign: 'center',
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
  // New Styles for Marketplace Design
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
  },
  benefitsSection: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
  },
  benefitsContainer: {
    gap: Spacing.lg,
  },
  benefitCard: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.sm,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  benefitTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  benefitList: {
    gap: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    flex: 1,
  },
  valueSection: {
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  valueContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  valueCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  valueTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  valueText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  commissionInfo: {
    marginTop: Spacing.lg,
  },
  commissionCard: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...BordersAndShadows.shadows.lg,
  },
  commissionContent: {
    flex: 1,
  },
  commissionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  commissionText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    lineHeight: 18,
  },
});
