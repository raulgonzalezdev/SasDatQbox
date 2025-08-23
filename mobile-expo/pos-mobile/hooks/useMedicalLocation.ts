import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLocationStore, DoctorLocation, MEDICAL_SPECIALTIES } from '@/store/locationStore';

/**
 * Hook personalizado para geolocalización médica
 * Maneja la ubicación del usuario y búsqueda de doctores cercanos
 */
export const useMedicalLocation = () => {
  const {
    userLocation,
    locationPermission,
    isLoadingLocation,
    locationError,
    nearbyDoctors,
    selectedDoctor,
    filters,
    requestLocationPermission,
    getCurrentLocation,
    searchNearbyDoctors,
    selectDoctor,
    updateFilters,
    calculateDistance,
    clearLocationData,
  } = useLocationStore();

  const [isSearching, setIsSearching] = useState(false);

  /**
   * Inicializar ubicación del usuario al montar el componente
   */
  useEffect(() => {
    initializeLocation();
  }, []);

  /**
   * Función para inicializar la ubicación
   */
  const initializeLocation = useCallback(async () => {
    console.log('🏥 Inicializando ubicación médica...');
    
    try {
      if (!locationPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Permisos de Ubicación',
            'Para encontrar doctores cercanos, necesitamos acceso a tu ubicación.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Configurar', onPress: () => requestLocationPermission() }
            ]
          );
          return;
        }
      }
      
      await getCurrentLocation();
    } catch (error) {
      console.error('❌ Error inicializando ubicación:', error);
      Alert.alert(
        'Error de Ubicación',
        'No pudimos obtener tu ubicación. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  }, [locationPermission, requestLocationPermission, getCurrentLocation]);

  /**
   * Buscar doctores con filtros específicos
   */
  const searchDoctorsWithFilters = useCallback(async (customFilters?: Partial<typeof filters>) => {
    if (!userLocation) {
      Alert.alert(
        'Ubicación Requerida',
        'Necesitamos tu ubicación para buscar doctores cercanos.',
        [{ text: 'Obtener Ubicación', onPress: initializeLocation }]
      );
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('🔍 Buscando doctores con filtros:', customFilters || filters);
      
      // Actualizar filtros si se proporcionan
      if (customFilters) {
        updateFilters(customFilters);
      }
      
      await searchNearbyDoctors(userLocation.coordinates);
      
      console.log('✅ Búsqueda completada, doctores encontrados:', nearbyDoctors.length);
    } catch (error) {
      console.error('❌ Error buscando doctores:', error);
      Alert.alert(
        'Error de Búsqueda',
        'No pudimos buscar doctores cercanos. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSearching(false);
    }
  }, [userLocation, filters, updateFilters, searchNearbyDoctors, nearbyDoctors.length, initializeLocation]);

  /**
   * Buscar doctores por especialidad específica
   */
  const searchBySpecialty = useCallback(async (specialty: typeof MEDICAL_SPECIALTIES[number]) => {
    console.log('🩺 Buscando doctores por especialidad:', specialty);
    await searchDoctorsWithFilters({ specialty });
  }, [searchDoctorsWithFilters]);

  /**
   * Buscar doctores disponibles para emergencias
   */
  const searchForEmergency = useCallback(async () => {
    console.log('🚨 Búsqueda de emergencia activada');
    await searchDoctorsWithFilters({
      specialty: 'Emergencia Médica',
      consultationType: 'home_visit',
      availability: 'now',
      maxDistance: 30, // Mayor radio para emergencias
    });
  }, [searchDoctorsWithFilters]);

  /**
   * Buscar doctores para consulta virtual
   */
  const searchForVirtualConsultation = useCallback(async () => {
    console.log('💻 Buscando doctores para consulta virtual');
    await searchDoctorsWithFilters({
      consultationType: 'virtual',
      availability: 'now',
    });
  }, [searchDoctorsWithFilters]);

  /**
   * Buscar doctores para visita domiciliaria
   */
  const searchForHomeVisit = useCallback(async () => {
    console.log('🏠 Buscando doctores para visita domiciliaria');
    await searchDoctorsWithFilters({
      consultationType: 'home_visit',
      availability: 'today',
      maxDistance: 20, // Radio más pequeño para visitas
    });
  }, [searchDoctorsWithFilters]);

  /**
   * Obtener doctores ordenados por diferentes criterios
   */
  const getSortedDoctors = useCallback((criteria: 'distance' | 'rating' | 'price') => {
    let sorted = [...nearbyDoctors];
    
    switch (criteria) {
      case 'distance':
        sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        sorted.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
    }
    
    return sorted;
  }, [nearbyDoctors]);

  /**
   * Verificar si un doctor está disponible ahora
   */
  const isDoctorAvailableNow = useCallback((doctor: DoctorLocation): boolean => {
    if (!doctor.isAvailable) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;
    
    const [startHour, startMinutes] = doctor.workingHours.start.split(':').map(Number);
    const [endHour, endMinutes] = doctor.workingHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinutes;
    const endTime = endHour * 60 + endMinutes;
    
    return currentTime >= startTime && currentTime <= endTime;
  }, []);

  /**
   * Obtener tiempo estimado de llegada para visita domiciliaria
   */
  const getEstimatedArrivalTime = useCallback((doctor: DoctorLocation): number => {
    if (!doctor.distance) return 0;
    
    // Calcular ETA basado en distancia y velocidad promedio en ciudad (25 km/h)
    const averageSpeed = 25; // km/h
    const travelTime = (doctor.distance / averageSpeed) * 60; // minutos
    const preparationTime = 15; // 15 minutos de preparación
    
    return Math.round(travelTime + preparationTime);
  }, []);

  /**
   * Verificar si el doctor puede hacer visita domiciliaria a la ubicación actual
   */
  const canDoctorVisitHome = useCallback((doctor: DoctorLocation): boolean => {
    if (!doctor.consultationTypes.includes('home_visit')) return false;
    if (!doctor.distance) return false;
    
    return doctor.distance <= doctor.serviceRadius;
  }, []);

  /**
   * Resetear búsqueda y filtros
   */
  const resetSearch = useCallback(() => {
    console.log('🔄 Reseteando búsqueda médica');
    updateFilters({
      specialty: null,
      consultationType: null,
      availability: null,
      rating: 0,
      priceRange: { min: 0, max: 200 },
      maxDistance: 25,
    });
    clearLocationData();
  }, [updateFilters, clearLocationData]);

  /**
   * Obtener estadísticas de búsqueda
   */
  const getSearchStats = useCallback(() => {
    const totalDoctors = nearbyDoctors.length;
    const availableNow = nearbyDoctors.filter(isDoctorAvailableNow).length;
    const virtualAvailable = nearbyDoctors.filter(d => d.consultationTypes.includes('virtual')).length;
    const homeVisitAvailable = nearbyDoctors.filter(d => canDoctorVisitHome(d)).length;
    const averageRating = totalDoctors > 0 ? 
      nearbyDoctors.reduce((sum, d) => sum + d.rating, 0) / totalDoctors : 0;
    const averageDistance = totalDoctors > 0 ? 
      nearbyDoctors.reduce((sum, d) => sum + (d.distance || 0), 0) / totalDoctors : 0;

    return {
      totalDoctors,
      availableNow,
      virtualAvailable,
      homeVisitAvailable,
      averageRating: Math.round(averageRating * 10) / 10,
      averageDistance: Math.round(averageDistance * 10) / 10,
    };
  }, [nearbyDoctors, isDoctorAvailableNow, canDoctorVisitHome]);

  return {
    // Estado
    userLocation,
    locationPermission,
    isLoadingLocation,
    locationError,
    nearbyDoctors,
    selectedDoctor,
    filters,
    isSearching,

    // Funciones principales
    initializeLocation,
    searchDoctorsWithFilters,
    selectDoctor,
    updateFilters,

    // Búsquedas especializadas
    searchBySpecialty,
    searchForEmergency,
    searchForVirtualConsultation,
    searchForHomeVisit,

    // Utilidades
    getSortedDoctors,
    isDoctorAvailableNow,
    getEstimatedArrivalTime,
    canDoctorVisitHome,
    calculateDistance,
    resetSearch,
    getSearchStats,

    // Constantes
    MEDICAL_SPECIALTIES,
  };
};

export default useMedicalLocation;
