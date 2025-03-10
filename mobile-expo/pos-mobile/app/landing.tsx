import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Linking, Switch, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore, isUserPremium, getCurrentUser } from '@/store/appStore';

export default function LandingPage() {
  const { hidePromotions, setHidePromotions } = useAppStore();
  const isPremium = isUserPremium();
  const user = getCurrentUser();
  const [hidePromos, setHidePromos] = useState(hidePromotions);
  
  // Planes disponibles
  const plans = [
    {
      id: 1,
      name: 'Gratuito',
      price: '$0',
      period: 'mes',
      features: [
        'Gestión de inventario básica',
        'Registro de ventas',
        'Reportes básicos',
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
        'Gestión de inventario avanzada',
        'Registro de ventas ilimitado',
        'Reportes básicos',
        'Soporte por email',
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
        'Gestión de inventario avanzada',
        'Registro de ventas ilimitado',
        'Reportes avanzados y exportación',
        'Impresión de tickets',
        'Gestión de clientes',
        'Soporte prioritario',
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
        'Múltiples sucursales',
        'Usuarios ilimitados',
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
    // Si el usuario ya es premium, mostrar un mensaje
    if (isPremium) {
      Alert.alert(
        'Ya tienes acceso premium',
        'Ya tienes acceso a todas las funcionalidades premium. No es necesario cambiar de plan.',
        [{ text: 'Entendido' }]
      );
      return;
    }
    
    // Si el usuario no está autenticado, redirigir a la pantalla de registro
    if (!user) {
      router.push('/auth/register');
      return;
    }
    
    // Si el usuario está autenticado pero no es premium, simular la actualización a premium
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.isPremium) {
      Alert.alert(
        'Actualizar a plan premium',
        `¿Estás seguro de que deseas actualizar al plan ${plan.name} por ${plan.price}/${plan.period}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Actualizar', 
            onPress: () => {
              // Simular la actualización a premium
              const { updateUser, setHidePromotions } = useAppStore.getState();
              updateUser({
                ...user,
                isPremium: true
              });
              setHidePromotions(true);
              
              Alert.alert(
                'Plan actualizado',
                `Tu plan ha sido actualizado a ${plan.name}. Ahora tienes acceso a todas las funcionalidades premium.`,
                [
                  { 
                    text: 'Continuar', 
                    onPress: () => router.replace('/(tabs)') 
                  }
                ]
              );
            }
          }
        ]
      );
    }
  };
  
  const toggleHidePromotions = () => {
    const newValue = !hidePromos;
    setHidePromos(newValue);
    setHidePromotions(newValue);
    
    if (newValue) {
      Alert.alert(
        'Promociones ocultas',
        'Las promociones y mensajes sobre características premium han sido ocultados. Puedes cambiar esta configuración en cualquier momento desde la pantalla de Configuración.',
        [{ text: 'Entendido' }]
      );
    }
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Planes y Precios</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content}>
          {/* Banner principal */}
          <View style={styles.heroBanner}>
            {isPremium ? (
              <>
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={24} color={Colors.white} />
                  <ThemedText style={styles.premiumBadgeText}>Premium</ThemedText>
                </View>
                <ThemedText style={styles.heroTitle}>¡Gracias por tu apoyo!</ThemedText>
                <ThemedText style={styles.heroSubtitle}>
                  Estás disfrutando de todas las funcionalidades premium de DatqboxPos
                </ThemedText>
              </>
            ) : (
              <>
                <ThemedText style={styles.heroTitle}>Potencia tu Negocio</ThemedText>
                <ThemedText style={styles.heroSubtitle}>
                  Elige el plan perfecto para tu restaurante y lleva tu gestión al siguiente nivel
                </ThemedText>
              </>
            )}
            <View style={styles.heroIconContainer}>
              <Ionicons name={isPremium ? "checkmark-circle" : "rocket"} size={60} color={Colors.white} />
            </View>
          </View>

          {/* Opción para ocultar promociones - Solo se muestra si el usuario no es premium */}
          {!isPremium && (
            <View style={styles.hidePromosContainer}>
              <View style={styles.hidePromosContent}>
                <Ionicons name="eye-off-outline" size={24} color={Colors.darkGray} style={styles.hidePromosIcon} />
                <View style={styles.hidePromosTextContainer}>
                  <ThemedText style={styles.hidePromosTitle}>No estoy interesado</ThemedText>
                  <ThemedText style={styles.hidePromosSubtitle}>Ocultar mensajes promocionales</ThemedText>
                </View>
              </View>
              <Switch
                value={hidePromos}
                onValueChange={toggleHidePromotions}
                trackColor={{ false: Colors.lightGray, true: Colors.secondaryLight }}
                thumbColor={hidePromos ? Colors.secondary : Colors.white}
              />
            </View>
          )}

          {/* Planes */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>
              {isPremium ? 'Tu plan actual' : 'Planes Disponibles'}
            </ThemedText>
            
            {plans.map(plan => (
              // Si el usuario es premium, solo mostrar planes premium
              (!isPremium || plan.isPremium) && (
                <View 
                  key={plan.id} 
                  style={[
                    styles.planCard,
                    plan.recommended && styles.recommendedPlan,
                    isPremium && plan.id === 3 && styles.currentPlan, // Asumimos que el usuario premium tiene el plan Premium (id: 3)
                  ]}
                >
                  {plan.recommended && !isPremium && (
                    <View style={styles.recommendedBadge}>
                      <ThemedText style={styles.recommendedText}>Recomendado</ThemedText>
                    </View>
                  )}
                  
                  {isPremium && plan.id === 3 && (
                    <View style={[styles.recommendedBadge, { backgroundColor: Colors.success }]}>
                      <ThemedText style={styles.recommendedText}>Tu Plan</ThemedText>
                    </View>
                  )}
                  
                  <View style={styles.planHeader}>
                    <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                    <View style={[styles.planIconContainer, { backgroundColor: plan.color }]}>
                      <Ionicons 
                        name={plan.id === 1 ? 'gift-outline' : plan.id === 2 ? 'cafe' : plan.id === 3 ? 'restaurant' : 'business'} 
                        size={24} 
                        color={Colors.white} 
                      />
                    </View>
                  </View>
                  
                  <View style={styles.planPriceContainer}>
                    <ThemedText style={styles.planPrice}>{plan.price}</ThemedText>
                    <ThemedText style={styles.planPeriod}>/{plan.period}</ThemedText>
                  </View>
                  
                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                        <ThemedText style={styles.featureText}>{feature}</ThemedText>
                      </View>
                    ))}
                  </View>
                  
                  {!isPremium && (
                    <TouchableOpacity 
                      style={[styles.planButton, { backgroundColor: plan.color }]}
                      onPress={() => handleRegister(plan.id)}
                    >
                      <ThemedText style={styles.planButtonText}>
                        {plan.isPremium ? 'Elegir Plan' : 'Plan Actual'}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              )
            ))}
          </View>

          {/* Testimonios - Solo se muestran si el usuario no es premium */}
          {!isPremium && (
            <View style={CommonStyles.section}>
              <ThemedText style={CommonStyles.sectionTitle}>Lo que dicen nuestros clientes</ThemedText>
              
              <View style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.testimonialAvatar}>
                    <ThemedText style={styles.testimonialInitials}>JR</ThemedText>
                  </View>
                  <View>
                    <ThemedText style={styles.testimonialName}>Juan Rodríguez</ThemedText>
                    <ThemedText style={styles.testimonialBusiness}>Restaurante El Sabor</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.testimonialText}>
                  "Desde que empecé a usar esta aplicación, la gestión de mi restaurante es mucho más eficiente. 
                  Los reportes me ayudan a tomar mejores decisiones y la impresión de tickets ha mejorado la 
                  experiencia de mis clientes."
                </ThemedText>
              </View>
            </View>
          )}

          {/* Contacto */}
          <View style={[CommonStyles.section, styles.contactSection]}>
            <ThemedText style={styles.contactTitle}>
              {isPremium ? '¿Necesitas ayuda con tu plan?' : '¿Necesitas ayuda para elegir?'}
            </ThemedText>
            <ThemedText style={styles.contactText}>
              {isPremium 
                ? 'Nuestro equipo de soporte está disponible para ayudarte con cualquier duda sobre tu plan premium.'
                : 'Nuestro equipo está disponible para ayudarte a encontrar el plan perfecto para tu negocio.'
              }
            </ThemedText>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => Linking.openURL('mailto:soporte@datqbox.com')}
            >
              <Ionicons name="mail" size={20} color={Colors.white} />
              <ThemedText style={styles.contactButtonText}>Contáctanos</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  heroBanner: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
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
  heroTitle: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidePromosContainer: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  hidePromosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hidePromosIcon: {
    marginRight: Spacing.md,
  },
  hidePromosTextContainer: {
    flex: 1,
  },
  hidePromosTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
  },
  hidePromosSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  recommendedPlan: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  currentPlan: {
    borderWidth: 2,
    borderColor: Colors.success,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  planIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  planPrice: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  planPeriod: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  planFeatures: {
    marginBottom: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    marginLeft: Spacing.sm,
  },
  planButton: {
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  planButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  testimonialCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  testimonialInitials: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  testimonialName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  testimonialBusiness: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  testimonialText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  contactSection: {
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  contactText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  contactButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
    marginLeft: Spacing.sm,
  },
}); 