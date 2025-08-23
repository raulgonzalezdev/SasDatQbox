import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';

export interface DoctorLocation {
  doctorId: string;
  doctorName: string;
  specialty: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  priceRange: {
    min: number;
    max: number;
  };
  avatar?: string;
}

interface DoctorMapSearchProps {
  onDoctorSelect: (doctor: DoctorLocation) => void;
  showFilters?: boolean;
}

// Datos mock de doctores cercanos
const mockDoctors: DoctorLocation[] = [
  {
    doctorId: 'doc_001',
    doctorName: 'Dr. María González',
    specialty: 'Medicina General',
    latitude: 10.4806,
    longitude: -66.9036,
    distance: 1.2,
    rating: 4.8,
    availability: 'available',
    priceRange: { min: 45, max: 65 },
  },
  {
    doctorId: 'doc_002',
    doctorName: 'Dr. Carlos Rodríguez',
    specialty: 'Cardiología',
    latitude: 10.4850,
    longitude: -66.9100,
    distance: 2.5,
    rating: 4.9,
    availability: 'available',
    priceRange: { min: 60, max: 80 },
  },
  {
    doctorId: 'doc_003',
    doctorName: 'Dra. Ana Martínez',
    specialty: 'Pediatría',
    latitude: 10.4750,
    longitude: -66.8950,
    distance: 3.1,
    rating: 4.7,
    availability: 'busy',
    priceRange: { min: 50, max: 70 },
  },
];

const DoctorMapSearch: React.FC<DoctorMapSearchProps> = ({ 
  onDoctorSelect, 
  showFilters = false 
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorLocation[]>(mockDoctors);

  const specialties = [
    { id: 'all', name: 'Todas las especialidades' },
    { id: 'general', name: 'Medicina General' },
    { id: 'cardiology', name: 'Cardiología' },
    { id: 'pediatrics', name: 'Pediatría' },
    { id: 'dermatology', name: 'Dermatología' },
  ];

  useEffect(() => {
    let filtered = [...mockDoctors];

    // Filtrar por especialidad
    if (selectedSpecialty !== 'all') {
      const specialtyMap: Record<string, string> = {
        general: 'Medicina General',
        cardiology: 'Cardiología',
        pediatrics: 'Pediatría',
        dermatology: 'Dermatología',
      };
      filtered = filtered.filter(doc => 
        doc.specialty === specialtyMap[selectedSpecialty]
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.priceRange.min - b.priceRange.min;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [selectedSpecialty, sortBy]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return Colors.success;
      case 'busy':
        return Colors.warning;
      case 'offline':
        return Colors.lightGray;
      default:
        return Colors.lightGray;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'Ocupado';
      case 'offline':
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <View style={styles.container}>
      {/* Mapa simulado */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={Colors.primary} />
          <Text style={styles.mapText}>Mapa de Doctores Cercanos</Text>
          <Text style={styles.mapSubtext}>Funcionalidad en desarrollo</Text>
        </View>
      </View>

      {/* Filtros */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={[
                  styles.filterChip,
                  selectedSpecialty === specialty.id && styles.filterChipActive
                ]}
                onPress={() => setSelectedSpecialty(specialty.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedSpecialty === specialty.id && styles.filterChipTextActive
                ]}>
                  {specialty.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Lista de doctores */}
      <View style={styles.doctorsHeader}>
        <ThemedText style={styles.doctorsTitle}>
          Doctores Encontrados ({filteredDoctors.length})
        </ThemedText>
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
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
               sortBy === 'rating' ? 'Calificación' : 'Precio'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.doctorsList}>
        {filteredDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.doctorId}
            style={styles.doctorCard}
            onPress={() => {
              console.log('Doctor seleccionado:', doctor.doctorName);
              onDoctorSelect(doctor);
            }}
          >
            <View style={styles.doctorAvatar}>
              <Ionicons name="person" size={32} color={Colors.white} />
            </View>
            
            <View style={styles.doctorInfo}>
              <View style={styles.doctorHeader}>
                <ThemedText style={styles.doctorName}>{doctor.doctorName}</ThemedText>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.warning} />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                </View>
              </View>
              
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              
              <View style={styles.doctorMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="location" size={14} color={Colors.darkGray} />
                  <Text style={styles.metaText}>{doctor.distance} km</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <View style={[
                    styles.availabilityDot,
                    { backgroundColor: getAvailabilityColor(doctor.availability) }
                  ]} />
                  <Text style={styles.metaText}>
                    {getAvailabilityText(doctor.availability)}
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Ionicons name="card" size={14} color={Colors.darkGray} />
                  <Text style={styles.metaText}>
                    ${doctor.priceRange.min}-${doctor.priceRange.max}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.doctorActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubbles" size={20} color={Colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call" size={20} color={Colors.success} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    height: 200,
    backgroundColor: Colors.lightGray,
    margin: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  mapText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.sm,
  },
  mapSubtext: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  filterChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
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
  doctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  doctorsTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginRight: Spacing.xs,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  sortButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  doctorsList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  doctorName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.xs,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  doctorActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
});

export default DoctorMapSearch;