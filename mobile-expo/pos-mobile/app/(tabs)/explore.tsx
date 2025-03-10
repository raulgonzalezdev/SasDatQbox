import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
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
  
  // Datos simulados
  const featuresData = [
    { id: 1, title: 'Gestión de inventario', icon: 'cube-outline', color: Colors.success, premium: false },
    { id: 2, title: 'Reportes avanzados', icon: 'bar-chart-outline', color: Colors.info, premium: true },
    { id: 3, title: 'Gestión de mesas', icon: 'grid-outline', color: Colors.warning, premium: true },
    { id: 4, title: 'Fidelización de clientes', icon: 'people-outline', color: Colors.secondary, premium: true },
    { id: 5, title: 'Integración con impresoras', icon: 'print-outline', color: Colors.darkGray, premium: true },
    { id: 6, title: 'Múltiples métodos de pago', icon: 'card-outline', color: Colors.danger, premium: true },
  ];

  const handleFeaturePress = (feature) => {
    if (feature.premium && !isPremium) {
      // Si la característica es premium y el usuario no es premium, redirigir a la página de planes
      router.push('/landing');
    } else {
      // Aquí iría la lógica para mostrar más detalles sobre la característica
      // Por ahora, solo mostramos un mensaje
      alert(`Característica: ${feature.title}`);
    }
  };

  const handleSubscriptionPress = () => {
    router.push('/landing');
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <Header 
        title={user?.businessName || "Varas Grill"}
        subtitle={user?.role || "Propietario"}
        showHelp={false}
      />

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content}>
          {/* Banner principal */}
          <View style={styles.mainBanner}>
            <ThemedText style={styles.mainBannerTitle}>
              {isPremium ? 'Todas las funciones desbloqueadas' : 'Explora todas las funciones'}
        </ThemedText>
            <ThemedText style={styles.mainBannerSubtitle}>
              {isPremium 
                ? 'Gracias por ser un usuario premium. Disfruta de todas las funcionalidades.' 
                : 'Descubre todo lo que puedes hacer con nuestra aplicación'}
            </ThemedText>
            
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={16} color={Colors.white} />
                <ThemedText style={styles.premiumBadgeText}>Premium</ThemedText>
              </View>
            )}
          </View>

          {/* Características */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Características disponibles</ThemedText>
            <View style={styles.featuresGrid}>
              {featuresData.map(feature => (
                <TouchableOpacity 
                  key={feature.id} 
                  style={[
                    styles.featureItem,
                    feature.premium && !isPremium && styles.premiumFeatureItem
                  ]}
                  onPress={() => handleFeaturePress(feature)}
                >
                  <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                    <Ionicons name={feature.icon} size={24} color={Colors.white} />
                  </View>
                  <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                  
                  {feature.premium && !isPremium && (
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
                <ThemedText style={styles.subscriptionTitle}>Plan Premium</ThemedText>
                <ThemedText style={styles.subscriptionText}>
                  Accede a todas las funciones avanzadas y mejora tu negocio
                </ThemedText>
                <TouchableOpacity 
                  style={styles.subscriptionButton}
                  onPress={handleSubscriptionPress}
                >
                  <ThemedText style={styles.subscriptionButtonText}>Ver planes</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.subscriptionImageContainer}>
                <Ionicons name="star" size={60} color={Colors.primary} />
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
                <ThemedText style={styles.supportItemTitle}>Contacta con soporte</ThemedText>
                <ThemedText style={styles.supportItemText}>
                  Nuestro equipo está disponible para ayudarte
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Herramientas</Text>
          
          <View style={styles.grid}>
            <Link href="/api-test" asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: '#0066CC' }]}>
                  <Ionicons name="server-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Prueba de API</Text>
                <Text style={styles.cardDescription}>Verificar la conexión con el backend</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/businesses" asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: '#34c759' }]}>
                  <Ionicons name="business-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Mis Negocios</Text>
                <Text style={styles.cardDescription}>Gestionar tus negocios</Text>
              </TouchableOpacity>
            </Link>
            
            <PremiumFeature>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: '#ff9500' }]}>
                  <Ionicons name="people-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Clientes</Text>
                <Text style={styles.cardDescription}>Gestión de clientes y fidelización</Text>
              </TouchableOpacity>
            </PremiumFeature>
            
            <PremiumFeature>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: '#5856d6' }]}>
                  <Ionicons name="cart-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Productos</Text>
                <Text style={styles.cardDescription}>Gestión de productos e inventario</Text>
              </TouchableOpacity>
            </PremiumFeature>
          </View>
          
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <View style={styles.grid}>
            <TouchableOpacity style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#8e8e93' }]}>
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Ajustes</Text>
              <Text style={styles.cardDescription}>Configuración de la aplicación</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#ff3b30' }]}>
                <Ionicons name="help-buoy-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Soporte</Text>
              <Text style={styles.cardDescription}>Ayuda y soporte técnico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#007aff' }]}>
                <Ionicons name="information-circle-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Acerca de</Text>
              <Text style={styles.cardDescription}>Información sobre la aplicación</Text>
            </TouchableOpacity>
            
            <Link href="/landing" asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: '#ff2d55' }]}>
                  <Ionicons name="star-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Premium</Text>
                <Text style={styles.cardDescription}>Actualiza a la versión premium</Text>
              </TouchableOpacity>
            </Link>
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
