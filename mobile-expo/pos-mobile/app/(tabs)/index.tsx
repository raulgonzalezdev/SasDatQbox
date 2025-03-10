import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { HelpModal } from '@/components/ui/HelpModal';
import { PremiumFeature } from '@/components/ui/PremiumFeature';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore, getCurrentUser, isUserPremium, shouldShowPromotions } from '@/store/appStore';

export default function HomeScreen() {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const user = getCurrentUser();
  const isPremium = isUserPremium();
  const showPromotions = shouldShowPromotions();
  
  // Datos simulados del usuario logueado
  const loggedUser = {
    name: user?.name || "Usuario",
    role: user?.role || "Propietario",
    store: user?.businessName || "Varas Grill"
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <Header 
        title={loggedUser.store}
        subtitle={loggedUser.role}
        onHelpPress={() => setHelpModalVisible(true)}
      />

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content}>
          {/* Bienvenida a DatqboxPos */}
          <View style={styles.welcomeContainer}>
            <ThemedText style={styles.welcomeText}>
              Bienvenido a <ThemedText style={styles.appName}>DatqboxPos</ThemedText>
            </ThemedText>
            <ThemedText style={styles.welcomeSubtext}>
              Tu solución completa para la gestión de tu negocio
            </ThemedText>
            
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={16} color={Colors.white} />
                <ThemedText style={styles.premiumBadgeText}>Premium</ThemedText>
              </View>
            )}
          </View>

          {/* Accesos rápidos */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Accesos rápidos</ThemedText>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => router.push('/pos')}
              >
                <View style={[styles.quickAccessIconContainer, { backgroundColor: Colors.secondary }]}>
                  <Ionicons name="stats-chart" size={24} color={Colors.white} />
                </View>
                <ThemedText style={styles.quickAccessText}>Registrar Venta</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => router.push('/pos/expenses')}
              >
                <View style={[styles.quickAccessIconContainer, { backgroundColor: Colors.white }]}>
                  <Ionicons name="cash-outline" size={24} color={Colors.dark} />
                </View>
                <ThemedText style={styles.quickAccessText}>Registrar Gasto</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => router.push('/pos/menu')}
              >
                <View style={[styles.quickAccessIconContainer, { backgroundColor: Colors.success }]}>
                  <Ionicons name="restaurant-outline" size={24} color={Colors.white} />
                </View>
                <ThemedText style={styles.quickAccessText}>Ver Menú</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Banner promocional - Solo se muestra si showPromotions es true */}
          {showPromotions && (
            <PremiumFeature featureName="Impresión de tickets">
              <View style={styles.promotionBanner}>
                <View style={styles.promotionContent}>
                  <ThemedText style={styles.promotionTitle}>¡Mejora tu operación!</ThemedText>
                  <ThemedText style={styles.promotionText}>
                    Con nuestro plan pago imprime tickets de tus ventas.
                  </ThemedText>
                  <TouchableOpacity style={styles.promotionButton}>
                    <ThemedText style={styles.promotionButtonText}>Explorar planes</ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={styles.promotionImageContainer}>
                  <Ionicons name="receipt-outline" size={60} color={Colors.dark} />
                </View>
              </View>
            </PremiumFeature>
          )}

          {/* Sugeridos para ti */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Sugeridos para ti</ThemedText>
            <View style={styles.suggestedGrid}>
              <TouchableOpacity style={styles.suggestedItem}>
                <View style={styles.suggestedIconContainer}>
                  <Ionicons name="restaurant" size={32} color={Colors.primary} />
                </View>
                <ThemedText style={styles.suggestedText}>Mesas</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.suggestedItem}>
                <View style={styles.suggestedIconContainer}>
                  <Ionicons name="cash" size={32} color={Colors.primary} />
                </View>
                <ThemedText style={styles.suggestedText}>Deudas</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.suggestedItem}>
                <View style={styles.suggestedIconContainer}>
                  <Ionicons name="bar-chart" size={32} color={Colors.primary} />
                </View>
                <ThemedText style={styles.suggestedText}>Estadísticas</ThemedText>
              </TouchableOpacity>

              {/* Clientes - Se muestra directamente si el usuario es premium */}
              {isPremium ? (
                <TouchableOpacity style={styles.suggestedItem}>
                  <View style={styles.suggestedIconContainer}>
                    <Ionicons name="people" size={32} color={Colors.primary} />
                  </View>
                  <ThemedText style={styles.suggestedText}>Clientes</ThemedText>
                </TouchableOpacity>
              ) : (
                showPromotions && (
                  <PremiumFeature featureName="Gestión de clientes">
                    <View style={styles.suggestedItem}>
                      <View style={styles.suggestedIconContainer}>
                        <Ionicons name="people" size={32} color={Colors.primary} />
                      </View>
                      <ThemedText style={styles.suggestedText}>Clientes</ThemedText>
                    </View>
                  </PremiumFeature>
                )
              )}
            </View>
          </View>
        </ScrollView>
      </ThemedView>

      {/* Modal de ayuda */}
      <HelpModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
        screenName="home"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    position: 'relative',
  },
  welcomeText: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  appName: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.secondary,
  },
  welcomeSubtext: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: Spacing.md,
    backgroundColor: Colors.secondary,
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
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    alignItems: 'center',
    width: '30%',
  },
  quickAccessIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BordersAndShadows.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickAccessText: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    color: Colors.dark,
  },
  promotionBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.success,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  promotionContent: {
    flex: 3,
  },
  promotionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  promotionText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  promotionButton: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    color: Colors.success,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.sm,
  },
  promotionImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestedItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: Spacing.lg,
  },
  suggestedIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  suggestedText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
});


