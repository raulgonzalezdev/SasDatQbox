import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { PremiumFeature } from '@/components/ui/PremiumFeature';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { isUserPremium, getCurrentUser } from '@/store/appStore';
import { router } from 'expo-router';

export default function VentasScreen() {
  const isPremium = isUserPremium();
  const user = getCurrentUser();
  
  // Datos simulados
  const balanceData = {
    totalVentas: 1250.75,
    totalGastos: 450.25,
    balance: 800.50,
    ultimasVentas: [
      { id: 1, fecha: '09/03/2025', monto: 125.50, cliente: 'Mesa 3' },
      { id: 2, fecha: '09/03/2025', monto: 78.25, cliente: 'Mesa 1' },
      { id: 3, fecha: '08/03/2025', monto: 245.00, cliente: 'Mesa 5' },
      { id: 4, fecha: '08/03/2025', monto: 56.75, cliente: 'Mesa 2' },
    ]
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
          {/* Indicador de Premium */}
          {isPremium && (
            <View style={styles.premiumIndicator}>
              <Ionicons name="star" size={16} color={Colors.white} />
              <ThemedText style={styles.premiumIndicatorText}>Premium</ThemedText>
            </View>
          )}
          
          {/* Resumen de balance */}
          <View style={styles.balanceSummary}>
            <View style={styles.balanceCard}>
              <ThemedText style={styles.balanceTitle}>Balance</ThemedText>
              <ThemedText style={styles.balanceAmount}>${balanceData.balance.toFixed(2)}</ThemedText>
              <View style={styles.balanceDetails}>
                <View style={styles.balanceDetailItem}>
                  <Ionicons name="arrow-up" size={16} color={Colors.success} />
                  <ThemedText style={styles.balanceDetailText}>
                    Ventas: ${balanceData.totalVentas.toFixed(2)}
                  </ThemedText>
                </View>
                <View style={styles.balanceDetailItem}>
                  <Ionicons name="arrow-down" size={16} color={Colors.danger} />
                  <ThemedText style={styles.balanceDetailText}>
                    Gastos: ${balanceData.totalGastos.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Últimas ventas */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Últimas ventas</ThemedText>
            {balanceData.ultimasVentas.map(venta => (
              <View key={venta.id} style={styles.ventaItem}>
                <View style={styles.ventaInfo}>
                  <ThemedText style={styles.ventaCliente}>{venta.cliente}</ThemedText>
                  <ThemedText style={styles.ventaFecha}>{venta.fecha}</ThemedText>
                </View>
                <ThemedText style={styles.ventaMonto}>${venta.monto.toFixed(2)}</ThemedText>
              </View>
            ))}
            <TouchableOpacity style={styles.verMasButton}>
              <ThemedText style={styles.verMasText}>Ver todas las ventas</ThemedText>
              <Ionicons name="chevron-forward" size={16} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Acciones rápidas - Algunas son premium */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Acciones rápidas</ThemedText>
            <View style={styles.accionesGrid}>
              {/* Exportar reporte - Premium */}
              <PremiumFeature featureName="Exportación de reportes" forceShow={isPremium}>
                <TouchableOpacity style={styles.accionItem}>
                  <View style={[styles.accionIconContainer, { backgroundColor: Colors.secondary }]}>
                    <Ionicons name="download" size={24} color={Colors.white} />
                  </View>
                  <ThemedText style={styles.accionText}>Exportar reporte</ThemedText>
                </TouchableOpacity>
              </PremiumFeature>

              {/* Filtrar por fecha - Disponible para todos */}
              <TouchableOpacity style={styles.accionItem}>
                <View style={[styles.accionIconContainer, { backgroundColor: Colors.success }]}>
                  <Ionicons name="calendar" size={24} color={Colors.white} />
                </View>
                <ThemedText style={styles.accionText}>Filtrar por fecha</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Análisis avanzado - Solo para premium */}
          <PremiumFeature featureName="Análisis avanzado de ventas" forceShow={isPremium}>
            <View style={CommonStyles.section}>
              <ThemedText style={CommonStyles.sectionTitle}>Análisis avanzado</ThemedText>
              <View style={styles.analysisCard}>
                <View style={styles.analysisHeader}>
                  <ThemedText style={styles.analysisTitle}>Rendimiento de ventas</ThemedText>
                  <TouchableOpacity>
                    <Ionicons name="options-outline" size={20} color={Colors.darkGray} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.analysisStat}>
                  <View style={styles.analysisStatInfo}>
                    <ThemedText style={styles.analysisStatLabel}>Ventas vs. semana anterior</ThemedText>
                    <ThemedText style={styles.analysisStatValue}>+15%</ThemedText>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '65%', backgroundColor: Colors.success }]} />
                  </View>
                </View>
                
                <View style={styles.analysisStat}>
                  <View style={styles.analysisStatInfo}>
                    <ThemedText style={styles.analysisStatLabel}>Ticket promedio</ThemedText>
                    <ThemedText style={styles.analysisStatValue}>$45.75</ThemedText>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '40%', backgroundColor: Colors.info }]} />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.analysisButton}>
                  <ThemedText style={styles.analysisButtonText}>Ver análisis completo</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </PremiumFeature>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  premiumIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  premiumIndicatorText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.xs,
  },
  balanceSummary: {
    marginBottom: Spacing.xl,
  },
  balanceCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    ...BordersAndShadows.shadows.md,
  },
  balanceTitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  balanceDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.sm,
  },
  balanceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceDetailText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  ventaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  ventaInfo: {
    flex: 1,
  },
  ventaCliente: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  ventaFecha: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  ventaMonto: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.secondary,
  },
  verMasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  verMasText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.medium,
    marginRight: Spacing.xs,
  },
  accionesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accionItem: {
    alignItems: 'center',
    width: '48%',
  },
  accionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BordersAndShadows.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  accionText: {
    fontSize: Typography.fontSizes.md,
    textAlign: 'center',
    color: Colors.dark,
  },
  analysisCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    ...BordersAndShadows.shadows.md,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  analysisTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  analysisStat: {
    marginBottom: Spacing.md,
  },
  analysisStatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  analysisStatLabel: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  analysisStatValue: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.circle,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  analysisButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  analysisButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
}); 