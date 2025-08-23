import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useMedicalLocation } from '@/hooks/useMedicalLocation';
import { DoctorLocation } from '@/store/locationStore';

interface DoctorMapSearchProps {
  onDoctorSelect: (doctor: DoctorLocation) => void;
  showFilters?: boolean;
}

const DoctorMapSearch: React.FC<DoctorMapSearchProps> = ({ 
  onDoctorSelect, 
  showFilters = true 
}) => {
  const mapRef = useRef<MapView>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [showList, setShowList] = useState(false);

  // Hook personalizado para geolocalización médica
  const {
    userLocation,
    nearbyDoctors,
    selectedDoctor,
    filters,
    isLoadingLocation,
    isSearching,
    MEDICAL_SPECIALTIES,
    searchBySpecialty,
    getSortedDoctors,
    selectDoctor,
    updateFilters,
    initializeLocation,
    getSearchStats,
    isDoctorAvailableNow,
    canDoctorVisitHome,
    getEstimatedArrivalTime,
  } = useMedicalLocation();

  // Inicializar ubicación al montar
  useEffect(() => {
    initializeLocation();
  }, []);

  // Centrar mapa cuando se obtenga ubicación
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coordinates.latitude,
        longitude: userLocation.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [userLocation]);

  // Obtener doctores ordenados
  const sortedDoctors = getSortedDoctors(sortBy);
  const stats = getSearchStats();

  // Funciones helper
  const handleDoctorPress = (doctor: DoctorLocation) => {
    console.log('🩺 Doctor seleccionado desde mapa:', doctor.doctorName);
    selectDoctor(doctor);
    onDoctorSelect(doctor);
  };

  const handleSpecialtyFilter = async (specialty: string) => {
    console.log('🔍 Filtrando por especialidad:', specialty);
    setSelectedSpecialty(specialty === selectedSpecialty ? null : specialty);
    
    if (specialty === selectedSpecialty) {
      // Remover filtro
      updateFilters({ specialty: null });
    } else {
      // Aplicar filtro
      await searchBySpecialty(specialty as any);
    }
  };

  const getMarkerColor = (doctor: DoctorLocation): string => {
    if (!isDoctorAvailableNow(doctor)) return '#gray';
    if (doctor.specialty === 'Emergencia Médica') return '#red';
    if (doctor.consultationTypes.includes('home_visit')) return '#blue';
    return '#green';
  };

  const getDoctorStatus = (doctor: DoctorLocation): { text: string; color: string } => {
    const available = isDoctorAvailableNow(doctor);
    const homeVisit = canDoctorVisitHome(doctor);
    
    if (!available) return { text: 'No disponible', color: Colors.lightGray };
    if (doctor.specialty === 'Emergencia Médica') return { text: '🚨 Emergencia', color: Colors.error };
    if (homeVisit) return { text: '🏠 Visita domiciliaria', color: Colors.info };
    return { text: '✅ Disponible', color: Colors.success };
  };

  // Loading inicial
  if (isLoadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={styles.loadingText}>Obteniendo tu ubicación...</ThemedText>
        <ThemedText style={styles.loadingSubtext}>Para encontrar doctores cercanos</ThemedText>
      </View>
    );
  }

  // Sin ubicación
  if (!userLocation) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="location-outline" size={64} color={Colors.lightGray} />
        <ThemedText style={styles.errorTitle}>Ubicación Requerida</ThemedText>
        <ThemedText style={styles.errorText}>
          Necesitamos acceso a tu ubicación para mostrar doctores cercanos
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={initializeLocation}>
          <ThemedText style={styles.retryButtonText}>Intentar de nuevo</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{stats.totalDoctors}</ThemedText>
            <ThemedText style={styles.statLabel}>Doctores</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{stats.availableNow}</ThemedText>
            <ThemedText style={styles.statLabel}>Disponibles</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{stats.averageDistance}km</ThemedText>
            <ThemedText style={styles.statLabel}>Promedio</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.viewToggle}
          onPress={() => setShowList(!showList)}
        >
          <Ionicons 
            name={showList ? "map" : "list"} 
            size={24} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Google Maps */}
      {!showList && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: userLocation.coordinates.latitude,
              longitude: userLocation.coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
          >
            {/* Círculo de búsqueda */}
            <Circle
              center={userLocation.coordinates}
              radius={filters.maxDistance * 1000} // convertir a metros
              strokeColor={Colors.primary}
              strokeWidth={2}
              fillColor={`${Colors.primary}20`}
            />

            {/* Marcadores de doctores */}
            {nearbyDoctors.map((doctor) => (
              <Marker
                key={doctor.id}
                coordinate={{
                  latitude: doctor.latitude,
                  longitude: doctor.longitude,
                }}
                pinColor={getMarkerColor(doctor)}
                onPress={() => handleDoctorPress(doctor)}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <ThemedText style={styles.calloutTitle}>{doctor.doctorName}</ThemedText>
                    <ThemedText style={styles.calloutSpecialty}>{doctor.specialty}</ThemedText>
                    <View style={styles.calloutRating}>
                      <Ionicons name="star" size={12} color={Colors.warning} />
                      <Text style={styles.calloutRatingText}>{doctor.rating}</Text>
                      <Text style={styles.calloutDistance}>• {doctor.distance?.toFixed(1)}km</Text>
                    </View>
                    <View style={styles.calloutStatus}>
                      <Text style={[styles.calloutStatusText, { color: getDoctorStatus(doctor).color }]}>
                        {getDoctorStatus(doctor).text}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* Overlay con filtros */}
          {showFilters && (
            <View style={styles.filtersOverlay}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !selectedSpecialty && styles.filterChipActive
                  ]}
                  onPress={() => handleSpecialtyFilter('')}
                >
                  <Text style={[
                    styles.filterChipText,
                    !selectedSpecialty && styles.filterChipTextActive
                  ]}>
                    Todos
                  </Text>
                </TouchableOpacity>
                
                {MEDICAL_SPECIALTIES.slice(0, 6).map((specialty) => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.filterChip,
                      selectedSpecialty === specialty && styles.filterChipActive
                    ]}
                    onPress={() => handleSpecialtyFilter(specialty)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedSpecialty === specialty && styles.filterChipTextActive
                    ]}>
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Lista de doctores */}
      {showList && (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <ThemedText style={styles.listTitle}>
              Doctores Encontrados ({sortedDoctors.length})
            </ThemedText>
            
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => {
                const options = ['distance', 'rating', 'price'] as const;
                const currentIndex = options.indexOf(sortBy);
                const nextIndex = (currentIndex + 1) % options.length;
                setSortBy(options[nextIndex]);
              }}
            >
              <Text style={styles.sortButtonText}>
                {sortBy === 'distance' ? 'Distancia' : 
                 sortBy === 'rating' ? 'Rating' : 'Precio'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.doctorsList}>
            {sortedDoctors.map((doctor) => {
              const status = getDoctorStatus(doctor);
              const eta = canDoctorVisitHome(doctor) ? getEstimatedArrivalTime(doctor) : null;
              
              return (
                <TouchableOpacity
                  key={doctor.id}
                  style={[
                    styles.doctorCard,
                    selectedDoctor?.id === doctor.id && styles.doctorCardSelected
                  ]}
                  onPress={() => handleDoctorPress(doctor)}
                >
                  <View style={styles.doctorCardContent}>
                    {/* Avatar */}
                    <View style={styles.doctorAvatar}>
                      {doctor.avatar ? (
                        <Image source={{ uri: doctor.avatar }} style={styles.avatarImage} />
                      ) : (
                        <Ionicons name="person" size={32} color={Colors.white} />
                      )}
                    </View>
                    
                    {/* Info principal */}
                    <View style={styles.doctorInfo}>
                      <View style={styles.doctorHeader}>
                        <ThemedText style={styles.doctorName}>{doctor.doctorName}</ThemedText>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color={Colors.warning} />
                          <Text style={styles.ratingText}>{doctor.rating}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                      
                      <View style={styles.doctorMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="location" size={12} color={Colors.darkGray} />
                          <Text style={styles.metaText}>{doctor.distance?.toFixed(1)} km</Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                          <Text style={[styles.metaText, { color: status.color }]}>
                            {status.text}
                          </Text>
                        </View>
                        
                        {eta && (
                          <View style={styles.metaItem}>
                            <Ionicons name="time" size={12} color={Colors.info} />
                            <Text style={styles.metaText}>~{eta} min</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>
                          ${doctor.priceRange.min} - ${doctor.priceRange.max} USD
                        </Text>
                      </View>
                    </View>
                    
                    {/* Acciones rápidas */}
                    <View style={styles.doctorActions}>
                      {doctor.consultationTypes.includes('virtual') && (
                        <TouchableOpacity style={[styles.actionButton, styles.virtualButton]}>
                          <Ionicons name="videocam" size={16} color={Colors.info} />
                        </TouchableOpacity>
                      )}
                      
                      {canDoctorVisitHome(doctor) && (
                        <TouchableOpacity style={[styles.actionButton, styles.homeButton]}>
                          <Ionicons name="home" size={16} color={Colors.success} />
                        </TouchableOpacity>
                      )}
                      
                      <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
                        <Ionicons name="chatbubbles" size={16} color={Colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Loading overlay para búsquedas */}
      {isSearching && (
        <View style={styles.searchingOverlay}>
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <ThemedText style={styles.searchingText}>Buscando doctores...</ThemedText>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Estados de carga y error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    marginTop: Spacing.lg,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
  },

  // Header con estadísticas
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
    ...BordersAndShadows.borders.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xl,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
    lineHeight: Typography.lineHeights.normal * Typography.fontSizes.sm,
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Mapa
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  filtersOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
  },
  filterChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    ...BordersAndShadows.shadows.sm,
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

  // Callouts del mapa
  calloutContainer: {
    width: 200,
    padding: Spacing.sm,
  },
  calloutTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  calloutSpecialty: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  calloutRatingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.xs,
  },
  calloutDistance: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  calloutStatus: {
    marginTop: Spacing.xs,
  },
  calloutStatusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold as any,
  },

  // Lista de doctores
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  listTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  sortButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginRight: Spacing.xs,
    fontWeight: Typography.fontWeights.medium as any,
  },
  doctorsList: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  doctorCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.sm,
    overflow: 'hidden',
  },
  doctorCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    ...BordersAndShadows.shadows.md,
  },
  doctorCardContent: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  doctorName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    flex: 1,
    marginRight: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.medium as any,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeights.medium as any,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  priceContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  priceText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeights.bold as any,
  },
  doctorActions: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  virtualButton: {
    backgroundColor: `${Colors.info}15`,
    borderColor: Colors.info,
  },
  homeButton: {
    backgroundColor: `${Colors.success}15`,
    borderColor: Colors.success,
  },
  chatButton: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },

  // Overlay de búsqueda
  searchingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.lg,
  },
  searchingText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    marginTop: Spacing.md,
    fontWeight: Typography.fontWeights.medium as any,
  },
});

export default DoctorMapSearch;