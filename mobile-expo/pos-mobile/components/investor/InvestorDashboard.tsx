import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useServiceTrackingStore } from '@/store/serviceTrackingStore';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const chartWidth = width - (Spacing.lg * 2);

interface InvestorDashboardProps {
  visible: boolean;
  onClose: () => void;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  visible,
  onClose,
}) => {
  const {
    metrics,
    completedServices,
    updateMetrics,
    getRevenueProjection,
    getGrowthMetrics,
    generateMockData,
  } = useServiceTrackingStore();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [showProjections, setShowProjections] = useState(false);

  useEffect(() => {
    if (visible) {
      updateMetrics();
      // Generar datos mock si no hay suficientes datos
      if (completedServices.length < 10) {
        generateMockData();
      }
    }
  }, [visible]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Datos para gráficos
  const revenueProjection = getRevenueProjection(12);
  const growthMetrics = getGrowthMetrics();

  // Datos del gráfico de líneas (ingresos mensuales proyectados)
  const lineChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        data: revenueProjection,
        color: (opacity = 1) => `rgba(${Colors.primary.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  // Datos del gráfico de barras (servicios por tipo)
  const barChartData = {
    labels: ['Virtual', 'Presencial', 'Domicilio'],
    datasets: [
      {
        data: [metrics.virtualConsults, metrics.inPersonConsults, metrics.homeVisits],
      },
    ],
  };

  // Datos del gráfico circular (distribución de ingresos)
  const pieChartData = [
    {
      name: 'Consultas Virtuales',
      population: metrics.virtualConsults * 50, // Precio promedio
      color: Colors.primary,
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
    {
      name: 'Consultas Presenciales',
      population: metrics.inPersonConsults * 75,
      color: Colors.success,
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
    {
      name: 'Visitas Domiciliarias',
      population: metrics.homeVisits * 112,
      color: Colors.warning,
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(51, 102, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'System',
    },
  };

  const kpiCards = [
    {
      title: 'Ingresos Totales',
      value: formatCurrency(metrics.totalRevenue),
      subtitle: 'Último mes',
      icon: 'cash',
      color: Colors.success,
      growth: '+23.5%',
    },
    {
      title: 'Comisión Plataforma',
      value: formatCurrency(metrics.platformRevenue),
      subtitle: '15% por transacción',
      icon: 'trending-up',
      color: Colors.primary,
      growth: '+28.2%',
    },
    {
      title: 'Servicios Completados',
      value: metrics.completedServices.toString(),
      subtitle: 'Total histórico',
      icon: 'checkmark-circle',
      color: Colors.info,
      growth: '+15.7%',
    },
    {
      title: 'Rating Promedio',
      value: metrics.averageRating.toFixed(1),
      subtitle: 'Satisfacción usuarios',
      icon: 'star',
      color: Colors.warning,
      growth: '+2.1%',
    },
    {
      title: 'Tiempo Promedio',
      value: `${Math.round(metrics.averageServiceTime)} min`,
      subtitle: 'Por consulta',
      icon: 'time',
      color: Colors.darkGray,
      growth: '-8.3%',
    },
    {
      title: 'Servicios Hoy',
      value: metrics.dailyServices.toString(),
      subtitle: 'Actividad diaria',
      icon: 'today',
      color: Colors.secondary,
      growth: '+41.2%',
    },
  ];

  const renderKPICard = (kpi: typeof kpiCards[0], index: number) => (
    <View key={index} style={styles.kpiCard}>
      <View style={styles.kpiHeader}>
        <View style={[styles.kpiIcon, { backgroundColor: kpi.color }]}>
          <Ionicons name={kpi.icon as any} size={20} color={Colors.white} />
        </View>
        <View style={[styles.growthBadge, {
          backgroundColor: kpi.growth.startsWith('+') ? Colors.success : Colors.danger,
        }]}>
          <ThemedText style={styles.growthText}>{kpi.growth}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.kpiValue}>{kpi.value}</ThemedText>
      <ThemedText style={styles.kpiTitle}>{kpi.title}</ThemedText>
      <ThemedText style={styles.kpiSubtitle}>{kpi.subtitle}</ThemedText>
    </View>
  );

  const renderProjectionModal = () => (
    <Modal
      visible={showProjections}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowProjections(false)}
    >
      <View style={styles.projectionContainer}>
        <View style={styles.projectionHeader}>
          <ThemedText style={styles.projectionTitle}>Proyecciones de Ingresos</ThemedText>
          <TouchableOpacity onPress={() => setShowProjections(false)}>
            <Ionicons name="close" size={24} color={Colors.dark} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.projectionContent}>
          {/* Proyección anual */}
          <View style={styles.projectionSection}>
            <ThemedText style={styles.sectionTitle}>Crecimiento Proyectado (15% mensual)</ThemedText>
            <LineChart
              data={lineChartData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Métricas clave de proyección */}
          <View style={styles.projectionMetrics}>
            <View style={styles.projectionMetricCard}>
              <ThemedText style={styles.projectionMetricValue}>
                {formatCurrency(revenueProjection.reduce((a, b) => a + b, 0))}
              </ThemedText>
              <ThemedText style={styles.projectionMetricLabel}>Ingresos Anuales Proyectados</ThemedText>
            </View>
            
            <View style={styles.projectionMetricCard}>
              <ThemedText style={styles.projectionMetricValue}>
                {formatCurrency(revenueProjection.reduce((a, b) => a + b, 0) * 0.15)}
              </ThemedText>
              <ThemedText style={styles.projectionMetricLabel}>Comisiones Proyectadas</ThemedText>
            </View>
          </View>

          {/* Escenarios de inversión */}
          <View style={styles.investmentScenarios}>
            <ThemedText style={styles.sectionTitle}>Escenarios de Inversión</ThemedText>
            
            {[
              { investment: 100000, multiplier: 1.2, label: 'Conservador' },
              { investment: 250000, multiplier: 1.5, label: 'Moderado' },
              { investment: 500000, multiplier: 2.0, label: 'Agresivo' },
            ].map((scenario, index) => (
              <View key={index} style={styles.scenarioCard}>
                <View style={styles.scenarioHeader}>
                  <ThemedText style={styles.scenarioLabel}>{scenario.label}</ThemedText>
                  <ThemedText style={styles.scenarioInvestment}>
                    {formatCurrency(scenario.investment)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.scenarioReturn}>
                  ROI Proyectado: {formatCurrency(scenario.investment * scenario.multiplier)}
                </ThemedText>
                <ThemedText style={styles.scenarioMultiplier}>
                  {scenario.multiplier}x en 24 meses
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Dashboard Inversionistas</ThemedText>
          <TouchableOpacity 
            onPress={() => setShowProjections(true)}
            style={styles.projectionsButton}
          >
            <Ionicons name="trending-up" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* KPIs Grid */}
          <View style={styles.kpiSection}>
            <ThemedText style={styles.sectionTitle}>Métricas Clave del Negocio</ThemedText>
            <View style={styles.kpiGrid}>
              {kpiCards.map((kpi, index) => renderKPICard(kpi, index))}
            </View>
          </View>

          {/* Gráfico de ingresos */}
          <View style={styles.chartSection}>
            <ThemedText style={styles.sectionTitle}>Proyección de Ingresos (12 meses)</ThemedText>
            <View style={styles.chartContainer}>
              <LineChart
                data={lineChartData}
                width={chartWidth}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>

          {/* Distribución de servicios */}
          <View style={styles.chartSection}>
            <ThemedText style={styles.sectionTitle}>Distribución de Servicios</ThemedText>
            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={chartWidth}
                height={200}
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </View>
          </View>

          {/* Distribución de ingresos por tipo */}
          <View style={styles.chartSection}>
            <ThemedText style={styles.sectionTitle}>Ingresos por Tipo de Servicio</ThemedText>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
          </View>

          {/* Métricas de mercado */}
          <View style={styles.marketSection}>
            <ThemedText style={styles.sectionTitle}>Oportunidad de Mercado</ThemedText>
            
            <View style={styles.marketCard}>
              <ThemedText style={styles.marketTitle}>Mercado Venezolano</ThemedText>
              <View style={styles.marketStats}>
                <View style={styles.marketStat}>
                  <ThemedText style={styles.marketStatValue}>28M</ThemedText>
                  <ThemedText style={styles.marketStatLabel}>Población</ThemedText>
                </View>
                <View style={styles.marketStat}>
                  <ThemedText style={styles.marketStatValue}>45K</ThemedText>
                  <ThemedText style={styles.marketStatLabel}>Médicos</ThemedText>
                </View>
                <View style={styles.marketStat}>
                  <ThemedText style={styles.marketStatValue}>$2.1B</ThemedText>
                  <ThemedText style={styles.marketStatLabel}>Mercado Salud</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.competitiveAdvantage}>
              <ThemedText style={styles.advantageTitle}>Ventajas Competitivas</ThemedText>
              {[
                'Primer marketplace médico con geolocalización en Venezuela',
                'Modelo de comisión sin costos fijos para doctores',
                'Sistema de reputación y financiamiento integrado',
                'Visitas domiciliarias como Uber médico',
                'Tecnología móvil nativa con UX familiar',
              ].map((advantage, index) => (
                <View key={index} style={styles.advantageItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  <ThemedText style={styles.advantageText}>{advantage}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Call to action para inversión */}
          <View style={styles.investmentCTA}>
            <ThemedText style={styles.ctaTitle}>¿Listo para Invertir?</ThemedText>
            <ThemedText style={styles.ctaSubtitle}>
              Únete a la revolución de la salud digital en Venezuela
            </ThemedText>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => setShowProjections(true)}
            >
              <ThemedText style={styles.ctaButtonText}>Ver Proyecciones Detalladas</ThemedText>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {renderProjectionModal()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  projectionsButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  kpiSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.lg,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.sm,
  },
  growthText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  kpiValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  kpiTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  kpiSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  chartSection: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  chart: {
    borderRadius: BordersAndShadows.borderRadius.md,
  },
  marketSection: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  marketCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  marketTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  marketStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  marketStat: {
    alignItems: 'center',
  },
  marketStatValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  marketStatLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  competitiveAdvantage: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  advantageTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  advantageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  advantageText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    flex: 1,
  },
  investmentCTA: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.lg,
  },
  ctaTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  ctaSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    gap: Spacing.sm,
  },
  ctaButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  // Estilos del modal de proyecciones
  projectionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  projectionHeader: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  projectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  projectionContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  projectionSection: {
    marginBottom: Spacing.xl,
  },
  projectionMetrics: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  projectionMetricCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  projectionMetricValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  projectionMetricLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  investmentScenarios: {
    marginBottom: Spacing.xl,
  },
  scenarioCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.sm,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scenarioLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  scenarioInvestment: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  scenarioReturn: {
    fontSize: Typography.fontSizes.md,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  scenarioMultiplier: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
});

export default InvestorDashboard;
