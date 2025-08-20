import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
import { HelpModal } from '@/components/ui/HelpModal';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { PremiumFeature } from '@/components/ui/PremiumFeature';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { isUserPremium, getCurrentUser } from '@/store/appStore';

export default function ReportesScreen() {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const isPremium = isUserPremium();
  const user = getCurrentUser();
  
  // Datos simulados de reportes
  const reportes = [
    { id: 1, titulo: 'Ventas del día', valor: '$1,250.00', icono: 'cart', color: Colors.success },
    { id: 2, titulo: 'Gastos del día', valor: '$350.00', icono: 'cash', color: Colors.danger },
    { id: 3, titulo: 'Ganancia del día', valor: '$900.00', icono: 'trending-up', color: Colors.info },
    { id: 4, titulo: 'Productos vendidos', valor: '45', icono: 'cube', color: Colors.warning },
    { id: 5, titulo: 'Clientes atendidos', valor: '28', icono: 'people', color: '#9C27B0' },
  ];

  // Datos simulados para el gráfico
  const ventasPorDia = [
    { dia: 'Lun', ventas: 950 },
    { dia: 'Mar', ventas: 850 },
    { dia: 'Mié', ventas: 1200 },
    { dia: 'Jue', ventas: 950 },
    { dia: 'Vie', ventas: 1500 },
    { dia: 'Sáb', ventas: 1800 },
    { dia: 'Dom', ventas: 1250 },
  ];

  // Datos simulados de productos más vendidos
  const productosMasVendidos = [
    { id: 1, nombre: 'Hamburguesa', cantidad: 25, porcentaje: 30 },
    { id: 2, nombre: 'Pizza', cantidad: 18, porcentaje: 22 },
    { id: 3, nombre: 'Refresco', cantidad: 15, porcentaje: 18 },
    { id: 4, nombre: 'Papas fritas', cantidad: 12, porcentaje: 15 },
    { id: 5, nombre: 'Helado', cantidad: 10, porcentaje: 12 },
  ];

  // Función para renderizar el gráfico de barras simple
  const renderBarChart = () => {
    const maxVentas = Math.max(...ventasPorDia.map(item => item.ventas));
    
    return (
      <View style={styles.chartContainer}>
        {ventasPorDia.map((item, index) => (
          <View key={index} style={styles.chartBarContainer}>
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${(item.ventas / maxVentas) * 100}%`,
                    backgroundColor: item.ventas === maxVentas ? Colors.success : Colors.secondary
                  }
                ]} 
              />
            </View>
            <ThemedText style={styles.chartLabel}>{item.dia}</ThemedText>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <Header 
        title={user?.businessName || "Varas Grill"}
        subtitle={user?.role || "Propietario"}
        onHelpPress={() => setHelpModalVisible(true)}
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
          
          {/* Selector de período */}
          <View style={styles.periodSelector}>
            <TouchableOpacity 
              style={[styles.periodButton, selectedPeriod === 'day' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('day')}
            >
              <ThemedText style={[styles.periodButtonText, selectedPeriod === 'day' && styles.periodButtonTextActive]}>
                Día
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('week')}
            >
              <ThemedText style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
                Semana
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('month')}
            >
              <ThemedText style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
                Mes
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('year')}
            >
              <ThemedText style={[styles.periodButtonText, selectedPeriod === 'year' && styles.periodButtonTextActive]}>
                Año
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Tarjetas de resumen */}
          <View style={styles.cardsGrid}>
            {reportes.map(reporte => (
              <View key={reporte.id} style={styles.card}>
                <View style={[styles.cardIconContainer, { backgroundColor: reporte.color }]}>
                  <Ionicons name={reporte.icono} size={24} color="white" />
                </View>
                <ThemedText style={styles.cardTitle}>{reporte.titulo}</ThemedText>
                <ThemedText style={styles.cardValue}>{reporte.valor}</ThemedText>
              </View>
            ))}
          </View>

          {/* Gráfico de ventas - Envuelto en PremiumFeature */}
          <PremiumFeature featureName="Gráficos avanzados" forceShow={isPremium}>
            <View style={[CommonStyles.card, styles.chartCard]}>
              <ThemedText style={CommonStyles.sectionTitle}>Ventas por día</ThemedText>
              {renderBarChart()}
            </View>
          </PremiumFeature>

          {/* Productos más vendidos */}
          <View style={CommonStyles.section}>
            <ThemedText style={CommonStyles.sectionTitle}>Productos más vendidos</ThemedText>
            {productosMasVendidos.map(producto => (
              <View key={producto.id} style={styles.productItem}>
                <View style={CommonStyles.row}>
                  <ThemedText style={styles.productRank}>{producto.id}</ThemedText>
                  <ThemedText style={styles.productName}>{producto.nombre}</ThemedText>
                </View>
                <View style={styles.productStats}>
                  <ThemedText style={styles.productQuantity}>{producto.cantidad} uds.</ThemedText>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${producto.porcentaje}%` }]} />
                  </View>
                  <ThemedText style={styles.productPercentage}>{producto.porcentaje}%</ThemedText>
                </View>
              </View>
            ))}
          </View>

          {/* Botones de acción - Envueltos en PremiumFeature */}
          <PremiumFeature featureName="Exportación de reportes" forceShow={isPremium}>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={20} color={Colors.white} />
                <ThemedText style={styles.actionButtonText}>Exportar PDF</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
                <Ionicons name="share-social-outline" size={20} color={Colors.secondary} />
                <ThemedText style={styles.secondaryActionButtonText}>Compartir</ThemedText>
              </TouchableOpacity>
            </View>
          </PremiumFeature>
        </ScrollView>
      </ThemedView>

      {/* Modal de ayuda */}
      <HelpModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
        screenName="reportes"
      />
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
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.circle,
    padding: Spacing.xs,
    ...BordersAndShadows.shadows.sm,
  },
  periodButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  periodButtonActive: {
    backgroundColor: Colors.secondary,
  },
  periodButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  periodButtonTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  cardValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  chartCard: {
    marginBottom: Spacing.xl,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: Spacing.xl,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: 20,
    height: 150,
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: BordersAndShadows.borderRadius.sm,
  },
  chartLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
  productItem: {
    marginBottom: Spacing.md,
  },
  productRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: Spacing.sm,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  productName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
  },
  productStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingLeft: Spacing.xl,
  },
  productQuantity: {
    width: 50,
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.circle,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  productPercentage: {
    width: 40,
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'right',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
    marginLeft: Spacing.xs,
  },
  secondaryActionButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  secondaryActionButtonText: {
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
    marginLeft: Spacing.xs,
  },
}); 