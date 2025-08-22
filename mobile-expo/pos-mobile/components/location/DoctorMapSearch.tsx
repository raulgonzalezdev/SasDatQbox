import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useLocationStore, DoctorLocation } from '@/store/locationStore';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface DoctorMapSearchProps {
  onDoctorSelect?: (doctor: DoctorLocation) => void;
  showFilters?: boolean;
}

const DoctorMapSearch: React.FC<DoctorMapSearchProps> = ({
  onDoctorSelect,
  showFilters = true,
}) => {
  const {
    userLocation,
    nearbyDoctors,
    selectedDoctor,
    filters,
    isLoadingLocation,
    locationError,
    locationPermission,
    getCurrentLocation,
    selectDoctor,
    updateFilters,
  } = useLocationStore();

  const [showMap, setShowMap] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 10.4806, // Caracas por defecto
    longitude: -66.9036,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    console.log('🗺️ DoctorMapSearch montado');
    if (!locationPermission) {
      handleRequestLocation();
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      setMapRegion({
        latitude: userLocation.coordinates.latitude,
        longitude: userLocation.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [userLocation]);

  const handleRequestLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      Alert.alert(
        'Ubicación Requerida',
        'Para encontrar doctores cerca de ti, necesitamos acceso a tu ubicación.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Intentar de nuevo', onPress: handleRequestLocation },
        ]
      );
    }
  };

  const handleDoctorPress = (doctor: DoctorLocation) => {
    selectDoctor(doctor);
    if (onDoctorSelect) {
      onDoctorSelect(doctor);
    }
  };

  const renderDoctorCard = (doctor: DoctorLocation) => (
    <TouchableOpacity
      key={doctor.id}
      style={[
        styles.doctorCard,
        selectedDoctor?.id === doctor.id && styles.selectedDoctorCard,
      ]}
      onPress={() => handleDoctorPress(doctor)}
    >
      <View style={styles.doctorHeader}>
        <View style={styles.doctorAvatar}>
          <Ionicons name="person" size={24} color={Colors.white} />
        </View>
        <View style={styles.doctorInfo}>
          <ThemedText style={styles.doctorName}>{doctor.doctorName}</ThemedText>
          <ThemedText style={styles.doctorSpecialty}>{doctor.specialty}</ThemedText>
          <View style={styles.doctorMeta}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <ThemedText style={styles.ratingText}>{doctor.rating}</ThemedText>
            </View>
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={12} color={Colors.primary} />
              <ThemedText style={styles.distanceText}>
                {doctor.distance?.toFixed(1)} km
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.doctorActions}>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: doctor.isAvailable ? Colors.success : Colors.lightGray }
          ]}>
            <ThemedText style={[
              styles.availabilityText,
              { color: doctor.isAvailable ? Colors.white : Colors.darkGray }
            ]}>
              {doctor.isAvailable ? 'Disponible' : 'Ocupado'}
            </ThemedText>
          </View>
          <ThemedText style={styles.priceText}>
            ${doctor.priceRange.min}-${doctor.priceRange.max}
          </ThemedText>
        </View>
      </View>

      {/* Tipos de consulta */}
      <View style={styles.consultationTypes}>
        {doctor.consultationTypes.map((type) => (
          <View key={type} style={styles.consultationTag}>
            <Ionicons
              name={
                type === 'virtual' ? 'videocam' :
                type === 'in_person' ? 'medical' : 'home'
              }
              size={12}
              color={Colors.primary}
            />
            <ThemedText style={styles.consultationTagText}>
              {type === 'virtual' ? 'Virtual' :
               type === 'in_person' ? 'Presencial' : 'Domicilio'}
            </ThemedText>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Filtro de especialidad */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.specialty && styles.activeFilterButton,
          ]}
          onPress={() => {
            // Aquí se abriría un modal de selección de especialidades
            Alert.alert('Filtros', 'Selección de especialidad próximamente');
          }}
        >
          <Ionicons name="medical" size={16} color={
            filters.specialty ? Colors.white : Colors.primary
          } />
          <ThemedText style={[
            styles.filterButtonText,
            filters.specialty && styles.activeFilterButtonText,
          ]}>
            {filters.specialty || 'Especialidad'}
          </ThemedText>
        </TouchableOpacity>

        {/* Filtro de tipo de consulta */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.consultationType && styles.activeFilterButton,
          ]}
          onPress={() => {
            const options = [
              { label: 'Virtual', value: 'virtual' },
              { label: 'Presencial', value: 'in_person' },
              { label: 'Domicilio', value: 'home_visit' },
            ];
            Alert.alert('Tipo de Consulta', 'Selecciona el tipo de consulta', [
              ...options.map(option => ({
                text: option.label,
                onPress: () => updateFilters({ consultationType: option.value as any }),
              })),
              { text: 'Todos', onPress: () => updateFilters({ consultationType: null }) },
              { text: 'Cancelar', style: 'cancel' },
            ]);
          }}
        >
          <Ionicons
            name={
              filters.consultationType === 'virtual' ? 'videocam' :
              filters.consultationType === 'in_person' ? 'medical' :
              filters.consultationType === 'home_visit' ? 'home' : 'options'
            }
            size={16}
            color={filters.consultationType ? Colors.white : Colors.primary}
          />
          <ThemedText style={[
            styles.filterButtonText,
            filters.consultationType && styles.activeFilterButtonText,
          ]}>
            {filters.consultationType === 'virtual' ? 'Virtual' :
             filters.consultationType === 'in_person' ? 'Presencial' :
             filters.consultationType === 'home_visit' ? 'Domicilio' : 'Tipo'}
          </ThemedText>
        </TouchableOpacity>

        {/* Filtro de distancia */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            Alert.alert('Distancia Máxima', 'Selecciona la distancia máxima', [
              { text: '5 km', onPress: () => updateFilters({ maxDistance: 5 }) },
              { text: '10 km', onPress: () => updateFilters({ maxDistance: 10 }) },
              { text: '25 km', onPress: () => updateFilters({ maxDistance: 25 }) },
              { text: '50 km', onPress: () => updateFilters({ maxDistance: 50 }) },
              { text: 'Cancelar', style: 'cancel' },
            ]);
          }}
        >
          <Ionicons name="location" size={16} color={Colors.primary} />
          <ThemedText style={styles.filterButtonText}>
            {filters.maxDistance} km
          </ThemedText>
        </TouchableOpacity>

        {/* Filtro de disponibilidad */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.availability && styles.activeFilterButton,
          ]}
          onPress={() => {
            Alert.alert('Disponibilidad', 'Selecciona disponibilidad', [
              { text: 'Ahora', onPress: () => updateFilters({ availability: 'now' }) },
              { text: 'Hoy', onPress: () => updateFilters({ availability: 'today' }) },
              { text: 'Esta semana', onPress: () => updateFilters({ availability: 'this_week' }) },
              { text: 'Cualquiera', onPress: () => updateFilters({ availability: null }) },
              { text: 'Cancelar', style: 'cancel' },
            ]);
          }}
        >
          <Ionicons name="time" size={16} color={
            filters.availability ? Colors.white : Colors.primary
          } />
          <ThemedText style={[
            styles.filterButtonText,
            filters.availability && styles.activeFilterButtonText,
          ]}>
            {filters.availability === 'now' ? 'Ahora' :
             filters.availability === 'today' ? 'Hoy' :
             filters.availability === 'this_week' ? 'Semana' : 'Disponibilidad'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (isLoadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={styles.loadingText}>Obteniendo tu ubicación...</ThemedText>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="location-outline" size={48} color={Colors.lightGray} />
        <ThemedText style={styles.errorTitle}>Error de Ubicación</ThemedText>
        <ThemedText style={styles.errorText}>{locationError}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleRequestLocation}>
          <ThemedText style={styles.retryButtonText}>Intentar de nuevo</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con toggle de vista */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          Doctores Cerca de Ti ({nearbyDoctors.length})
        </ThemedText>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, showMap && styles.activeToggleButton]}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map" size={16} color={showMap ? Colors.white : Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !showMap && styles.activeToggleButton]}
            onPress={() => setShowMap(false)}
          >
            <Ionicons name="list" size={16} color={!showMap ? Colors.white : Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros */}
      {showFilters && renderFilters()}

      {/* Contenido principal */}
      {showMap ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
          >
            {/* Marcador de usuario */}
            {userLocation && (
              <Marker
                coordinate={userLocation.coordinates}
                title="Tu ubicación"
                pinColor={Colors.secondary}
              />
            )}

            {/* Marcadores de doctores */}
            {nearbyDoctors.map((doctor) => (
              <Marker
                key={doctor.id}
                coordinate={{ latitude: doctor.latitude, longitude: doctor.longitude }}
                title={doctor.doctorName}
                description={`${doctor.specialty} • $${doctor.priceRange.min}-${doctor.priceRange.max}`}
                pinColor={doctor.isAvailable ? Colors.success : Colors.lightGray}
                onPress={() => handleDoctorPress(doctor)}
              />
            ))}
          </MapView>

          {/* Lista flotante de doctores seleccionados */}
          {selectedDoctor && (
            <View style={styles.floatingCard}>
              {renderDoctorCard(selectedDoctor)}
            </View>
          )}
        </View>
      ) : (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {nearbyDoctors.length > 0 ? (
            nearbyDoctors.map(renderDoctorCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={64} color={Colors.lightGray} />
              <ThemedText style={styles.emptyTitle}>No hay doctores cerca</ThemedText>
              <ThemedText style={styles.emptyText}>
                Intenta ajustar los filtros o ampliar el radio de búsqueda
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    ...BordersAndShadows.shadows.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BordersAndShadows.borderRadius.sm,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BordersAndShadows.borderRadius.sm,
  },
  activeToggleButton: {
    backgroundColor: Colors.primary,
  },
  filtersContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BordersAndShadows.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.xs,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
  },
  activeFilterButtonText: {
    color: Colors.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  floatingCard: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.lg,
  },
  listContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  doctorCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  selectedDoctorCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  doctorMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  distanceText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  doctorActions: {
    alignItems: 'flex-end',
  },
  availabilityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.sm,
    marginBottom: Spacing.xs,
  },
  availabilityText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold as any,
  },
  priceText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  consultationTypes: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  consultationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BordersAndShadows.borderRadius.sm,
    gap: Spacing.xs,
  },
  consultationTagText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});

export default DoctorMapSearch;
