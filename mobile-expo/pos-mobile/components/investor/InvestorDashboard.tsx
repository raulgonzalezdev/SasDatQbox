import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Dimensions,
  Text
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';

interface InvestorDashboardProps {
  visible: boolean;
  onClose: () => void;
}

interface BusinessMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeUsers: number;
  completedServices: number;
  averageRating: number;
  platformRevenue: number;
  doctorRetention: number;
  patientSatisfaction: number;
}

interface ChartData {
  month: string;
  revenue: number;
  services: number;
}

const { width } = Dimensions.get('window');

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ visible, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'3M' | '6M' | '1Y'>('6M');
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalRevenue: 125000,
    monthlyGrowth: 15.4,
    activeUsers: 2847,
    completedServices: 1250,
    averageRating: 4.7,
    platformRevenue: 18750, // 15% de comisión
    doctorRetention: 89,
    patientSatisfaction: 94,
  });

  const [chartData] = useState<ChartData[]>([
    { month: 'Ene', revenue: 45000, services: 180 },
    { month: 'Feb', revenue: 52000, services: 210 },
    { month: 'Mar', revenue: 61000, services: 245 },
    { month: 'Abr', revenue: 74000, services: 295 },
    { month: 'May', revenue: 89000, services: 360 },
    { month: 'Jun', revenue: 125000, services: 500 },
  ]);

  // Simular actualización de métricas en tiempo real
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 500),
        completedServices: prev.completedServices + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [visible]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-VE').format(num);
  };

  const calculateROI = () => {
    const investmentAmount = 150000; // Inversión inicial
    const currentValue = metrics.totalRevenue * 12; // Proyección anual
    return ((currentValue - investmentAmount) / investmentAmount) * 100;
  };

  const getGrowthProjection = () => {
    const currentMonthly = metrics.totalRevenue;
    const growthRate = metrics.monthlyGrowth / 100;
    
    return [
      { period: 'Q3 2024', value: currentMonthly * 3 * (1 + growthRate) },
      { period: 'Q4 2024', value: currentMonthly * 3 * (1 + growthRate) ** 2 },
      { period: 'Q1 2025', value: currentMonthly * 3 * (1 + growthRate) ** 3 },
      { period: 'Q2 2025', value: currentMonthly * 3 * (1 + growthRate) ** 4 },
    ];
  };

  const MetricCard = ({ title, value, subtitle, icon, color, trend }: {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: string;
    trend?: number;
  }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={20} color={Colors.white} />
        </View>
        {trend !== undefined && (
          <View style={[styles.trendBadge, { backgroundColor: trend >= 0 ? Colors.success : Colors.danger }]}>
            <Ionicons 
              name={trend >= 0 ? 'trending-up' : 'trending-down'} 
              size={12} 
              color={Colors.white} 
            />
            <Text style={styles.trendText}>{Math.abs(trend)}%</Text>
          </View>
        )}
      </View>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );

  const SimpleChart = ({ data, type }: { data: ChartData[], type: 'revenue' | 'services' }) => {
    const maxValue = Math.max(...data.map(d => type === 'revenue' ? d.revenue : d.services));
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {data.map((item, index) => {
            const value = type === 'revenue' ? item.revenue : item.services;
            const height = (value / maxValue) * 100;
            
            return (
              <View key={index} style={styles.chartBarContainer}>
                <View style={styles.chartBarWrapper}>
                  <View 
                    style={[
                      styles.chartBar, 
                      { 
                        height: `${height}%`,
                        backgroundColor: type === 'revenue' ? Colors.primary : Colors.success,
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{item.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

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
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Dashboard Inversionistas</ThemedText>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* KPIs principales */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>KPIs Clave</ThemedText>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Ingresos Totales"
                value={formatCurrency(metrics.totalRevenue)}
                subtitle="Este mes"
                icon="trending-up"
                color={Colors.primary}
                trend={metrics.monthlyGrowth}
              />
              <MetricCard
                title="Usuarios Activos"
                value={formatNumber(metrics.activeUsers)}
                subtitle="Doctores y pacientes"
                icon="people"
                color={Colors.success}
                trend={12.3}
              />
              <MetricCard
                title="Servicios Completados"
                value={formatNumber(metrics.completedServices)}
                subtitle="Este mes"
                icon="medical"
                color={Colors.info}
                trend={8.7}
              />
              <MetricCard
                title="Ingresos Plataforma"
                value={formatCurrency(metrics.platformRevenue)}
                subtitle="Comisión (15%)"
                icon="card"
                color={Colors.warning}
                trend={15.4}
              />
            </View>
          </View>

          {/* Gráficos de crecimiento */}
          <View style={styles.section}>
            <View style={styles.chartHeader}>
              <ThemedText style={styles.sectionTitle}>Crecimiento</ThemedText>
              <View style={styles.periodSelector}>
                {(['3M', '6M', '1Y'] as const).map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodButton,
                      selectedPeriod === period && styles.periodButtonActive
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonTextActive
                    ]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.chartsContainer}>
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
                <SimpleChart data={chartData} type="revenue" />
              </View>
              
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Servicios Completados</Text>
                <SimpleChart data={chartData} type="services" />
              </View>
            </View>
          </View>

          {/* Métricas de calidad */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Métricas de Calidad</ThemedText>
            <View style={styles.qualityMetrics}>
              <View style={styles.qualityItem}>
                <View style={styles.qualityCircle}>
                  <Text style={styles.qualityValue}>{metrics.averageRating}</Text>
                  <Text style={styles.qualityLabel}>★ Rating</Text>
                </View>
              </View>
              
              <View style={styles.qualityItem}>
                <View style={styles.qualityCircle}>
                  <Text style={styles.qualityValue}>{metrics.doctorRetention}%</Text>
                  <Text style={styles.qualityLabel}>Retención Dr.</Text>
                </View>
              </View>
              
              <View style={styles.qualityItem}>
                <View style={styles.qualityCircle}>
                  <Text style={styles.qualityValue}>{metrics.patientSatisfaction}%</Text>
                  <Text style={styles.qualityLabel}>Satisfacción</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Proyecciones financieras */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Proyecciones Financieras</ThemedText>
            <View style={styles.projectionCard}>
              <View style={styles.roiHeader}>
                <Text style={styles.roiLabel}>ROI Proyectado (12 meses)</Text>
                <Text style={styles.roiValue}>{calculateROI().toFixed(1)}%</Text>
              </View>
              
              <View style={styles.projectionsList}>
                {getGrowthProjection().map((proj, index) => (
                  <View key={index} style={styles.projectionItem}>
                    <Text style={styles.projectionPeriod}>{proj.period}</Text>
                    <Text style={styles.projectionValue}>{formatCurrency(proj.value)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Resumen ejecutivo */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Resumen Ejecutivo</ThemedText>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.summaryText}>
                  Crecimiento mensual sostenido del {metrics.monthlyGrowth}%
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.summaryText}>
                  Alta satisfacción del cliente ({metrics.patientSatisfaction}%)
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.summaryText}>
                  Modelo de negocio escalable con margen del 15%
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="trending-up" size={20} color={Colors.primary} />
                <Text style={styles.summaryText}>
                  Proyección de break-even en 8 meses
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer con acciones */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.reportButton}>
            <Ionicons name="document-text" size={20} color={Colors.primary} />
            <Text style={styles.reportButtonText}>Generar Reporte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share" size={20} color={Colors.white} />
            <Text style={styles.shareButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    marginLeft: 2,
    fontWeight: Typography.fontWeights.bold as any,
  },
  metricValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  metricTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.bold as any,
    marginBottom: Spacing.xs,
  },
  metricSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 18,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  periodButtonTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
  chartsContainer: {
    gap: Spacing.md,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  chartTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  chartContainer: {
    height: 120,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarWrapper: {
    height: 80,
    width: 20,
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
  chartBar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  qualityMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  qualityItem: {
    alignItems: 'center',
  },
  qualityCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  qualityLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    marginTop: 2,
  },
  projectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  roiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  roiLabel: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.bold as any,
  },
  roiValue: {
    fontSize: Typography.fontSizes.xl,
    color: Colors.success,
    fontWeight: Typography.fontWeights.bold as any,
  },
  projectionsList: {
    gap: Spacing.md,
  },
  projectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectionPeriod: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  projectionValue: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    marginLeft: Spacing.md,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
  },
  reportButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
    marginLeft: Spacing.sm,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
  },
  shareButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
    marginLeft: Spacing.sm,
  },
});

export default InvestorDashboard;