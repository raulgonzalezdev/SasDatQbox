import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useMedicalLocation } from '@/hooks/useMedicalLocation';
import { MEDICAL_SPECIALTIES } from '@/store/locationStore';

interface MedicalFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
}

const MedicalFilters: React.FC<MedicalFiltersProps> = ({
  visible,
  onClose,
  onApplyFilters,
}) => {
  const {
    filters,
    updateFilters,
    getSearchStats,
  } = useMedicalLocation();

  const [tempFilters, setTempFilters] = useState(filters);
  const stats = getSearchStats();

  // Rangos de precios predefinidos
  const priceRanges = [
    { label: 'Cualquier precio', min: 0, max: 500 },
    { label: '$0 - $30', min: 0, max: 30 },
    { label: '$30 - $60', min: 30, max: 60 },
    { label: '$60 - $100', min: 60, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: 500 },
  ];

  // Rangos de distancia
  const distanceOptions = [
    { label: 'Hasta 5km', value: 5 },
    { label: 'Hasta 10km', value: 10 },
    { label: 'Hasta 15km', value: 15 },
    { label: 'Hasta 25km', value: 25 },
    { label: 'Hasta 50km', value: 50 },
  ];

  // Opciones de disponibilidad
  const availabilityOptions = [
    { label: 'Cualquier momento', value: null },
    { label: 'Disponible ahora', value: 'now' },
    { label: 'Disponible hoy', value: 'today' },
    { label: 'Esta semana', value: 'this_week' },
  ];

  // Opciones de tipo de consulta
  const consultationTypes = [
    { label: 'Cualquier tipo', value: null, icon: 'medical' },
    { label: 'Virtual', value: 'virtual', icon: 'videocam' },
    { label: 'Presencial', value: 'in_person', icon: 'business' },
    { label: 'Visita a casa', value: 'home_visit', icon: 'home' },
  ];

  // Ratings mínimos
  const ratingOptions = [
    { label: 'Cualquier rating', value: 0 },
    { label: '3+ estrellas', value: 3 },
    { label: '4+ estrellas', value: 4 },
    { label: '4.5+ estrellas', value: 4.5 },
  ];

  const handleApplyFilters = () => {
    console.log('🔍 Aplicando filtros médicos:', tempFilters);
    updateFilters(tempFilters);
    onApplyFilters();
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      specialty: null,
      consultationType: null,
      maxDistance: 25,
      priceRange: { min: 0, max: 500 },
      rating: 0,
      availability: null,
    };
    setTempFilters(resetFilters);
  };

  const updateTempFilter = (key: keyof typeof tempFilters, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderFilterSection = (title: string, children: React.ReactNode) => (
    <View style={styles.filterSection}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.dark} />
          </TouchableOpacity>
          
          <ThemedText style={styles.headerTitle}>Filtros de Búsqueda</ThemedText>
          
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        {/* Resultados actuales */}
        <View style={styles.resultsBar}>
          <View style={styles.resultStats}>
            <ThemedText style={styles.resultNumber}>{stats.totalDoctors}</ThemedText>
            <ThemedText style={styles.resultLabel}>doctores encontrados</ThemedText>
          </View>
          <View style={styles.resultStats}>
            <ThemedText style={styles.resultNumber}>{stats.availableNow}</ThemedText>
            <ThemedText style={styles.resultLabel}>disponibles ahora</ThemedText>
          </View>
        </View>

        <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
          {/* Especialidad médica */}
          {renderFilterSection('Especialidad Médica', (
            <View style={styles.chipContainer}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !tempFilters.specialty && styles.filterChipActive
                ]}
                onPress={() => updateTempFilter('specialty', null)}
              >
                <Text style={[
                  styles.filterChipText,
                  !tempFilters.specialty && styles.filterChipTextActive
                ]}>
                  Todas las especialidades
                </Text>
              </TouchableOpacity>
              
              {MEDICAL_SPECIALTIES.map((specialty) => (
                <TouchableOpacity
                  key={specialty}
                  style={[
                    styles.filterChip,
                    tempFilters.specialty === specialty && styles.filterChipActive
                  ]}
                  onPress={() => updateTempFilter('specialty', specialty)}
                >
                  <Text style={[
                    styles.filterChipText,
                    tempFilters.specialty === specialty && styles.filterChipTextActive
                  ]}>
                    {specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Tipo de consulta */}
          {renderFilterSection('Tipo de Consulta', (
            <View style={styles.consultationGrid}>
              {consultationTypes.map((type) => (
                <TouchableOpacity
                  key={type.value || 'any'}
                  style={[
                    styles.consultationCard,
                    tempFilters.consultationType === type.value && styles.consultationCardActive
                  ]}
                  onPress={() => updateTempFilter('consultationType', type.value)}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={tempFilters.consultationType === type.value ? Colors.white : Colors.primary} 
                  />
                  <Text style={[
                    styles.consultationText,
                    tempFilters.consultationType === type.value && styles.consultationTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Distancia máxima */}
          {renderFilterSection('Distancia Máxima', (
            <View style={styles.optionsList}>
              {distanceOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionRow,
                    tempFilters.maxDistance === option.value && styles.optionRowActive
                  ]}
                  onPress={() => updateTempFilter('maxDistance', option.value)}
                >
                  <View style={styles.optionContent}>
                    <Ionicons name="location" size={16} color={Colors.primary} />
                    <Text style={[
                      styles.optionText,
                      tempFilters.maxDistance === option.value && styles.optionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  {tempFilters.maxDistance === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Rango de precios */}
          {renderFilterSection('Rango de Precios', (
            <View style={styles.optionsList}>
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={`${range.min}-${range.max}`}
                  style={[
                    styles.optionRow,
                    tempFilters.priceRange.min === range.min && 
                    tempFilters.priceRange.max === range.max && 
                    styles.optionRowActive
                  ]}
                  onPress={() => updateTempFilter('priceRange', { min: range.min, max: range.max })}
                >
                  <View style={styles.optionContent}>
                    <Ionicons name="card" size={16} color={Colors.success} />
                    <Text style={[
                      styles.optionText,
                      tempFilters.priceRange.min === range.min && 
                      tempFilters.priceRange.max === range.max && 
                      styles.optionTextActive
                    ]}>
                      {range.label}
                    </Text>
                  </View>
                  {tempFilters.priceRange.min === range.min && 
                   tempFilters.priceRange.max === range.max && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Rating mínimo */}
          {renderFilterSection('Rating Mínimo', (
            <View style={styles.optionsList}>
              {ratingOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionRow,
                    tempFilters.rating === option.value && styles.optionRowActive
                  ]}
                  onPress={() => updateTempFilter('rating', option.value)}
                >
                  <View style={styles.optionContent}>
                    <Ionicons name="star" size={16} color={Colors.warning} />
                    <Text style={[
                      styles.optionText,
                      tempFilters.rating === option.value && styles.optionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  {tempFilters.rating === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.warning} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Disponibilidad */}
          {renderFilterSection('Disponibilidad', (
            <View style={styles.optionsList}>
              {availabilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value || 'any'}
                  style={[
                    styles.optionRow,
                    tempFilters.availability === option.value && styles.optionRowActive
                  ]}
                  onPress={() => updateTempFilter('availability', option.value)}
                >
                  <View style={styles.optionContent}>
                    <Ionicons name="time" size={16} color={Colors.info} />
                    <Text style={[
                      styles.optionText,
                      tempFilters.availability === option.value && styles.optionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  {tempFilters.availability === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.info} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Footer con acciones */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
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
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    ...BordersAndShadows.shadows.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resetButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium as any,
  },
  resultsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  resultStats: {
    alignItems: 'center',
  },
  resultNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  resultLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
  filtersContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  filterSection: {
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },

  // Chips para especialidades
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },

  // Grid para tipos de consulta
  consultationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  consultationCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGray,
    ...BordersAndShadows.shadows.sm,
  },
  consultationCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  consultationText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.medium as any,
  },
  consultationTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },

  // Lista de opciones
  optionsList: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    overflow: 'hidden',
    ...BordersAndShadows.shadows.sm,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  optionRowActive: {
    backgroundColor: `${Colors.primary}10`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    marginLeft: Spacing.sm,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cancelButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium as any,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
});

export default MedicalFilters;
