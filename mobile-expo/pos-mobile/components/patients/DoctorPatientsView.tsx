import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { mockDoctorData } from '@/data/mockUsers';

const DoctorPatientsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Datos ampliados de pacientes para el doctor
  const patients = [
    {
      id: 'pat_001',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+1 234 567 8900',
      age: 39,
      bloodType: 'O+',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      status: 'active',
      avatar: 'AM',
      riskLevel: 'medium',
      conditions: ['Hipertensión', 'Diabetes Tipo 2'],
      medications: 2,
      urgentNotes: 'Revisar presión arterial',
    },
    {
      id: 'pat_002',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+1 234 567 8901',
      age: 55,
      bloodType: 'A+',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-20',
      status: 'active',
      avatar: 'CR',
      riskLevel: 'high',
      conditions: ['Artritis', 'Hipertensión'],
      medications: 3,
      urgentNotes: 'Paciente de alto riesgo',
    },
    {
      id: 'pat_003',
      name: 'Laura Silva',
      email: 'laura.silva@email.com',
      phone: '+1 234 567 8902',
      age: 28,
      bloodType: 'B+',
      lastVisit: '2024-01-12',
      nextAppointment: null,
      status: 'inactive',
      avatar: 'LS',
      riskLevel: 'low',
      conditions: [],
      medications: 0,
      urgentNotes: null,
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.conditions.some(condition => 
      condition.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.darkGray;
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'Alto Riesgo';
      case 'medium':
        return 'Riesgo Medio';
      case 'low':
        return 'Bajo Riesgo';
      default:
        return 'Sin Evaluar';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? Colors.success : Colors.darkGray;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePatientAction = (action: string, patientId: string, patientName: string) => {
    switch (action) {
      case 'chat':
        router.push('/(drawer)/(tabs)/chat');
        break;
      case 'call':
        Alert.alert('Llamar', `¿Deseas llamar a ${patientName}?`);
        break;
      case 'medical':
        router.push(`/patient/${patientId}/medical`);
        break;
      case 'appointment':
        router.push('/(drawer)/(tabs)/appointments');
        break;
    }
  };

  // Estadísticas rápidas
  const stats = [
    {
      id: 'total',
      title: 'Total Pacientes',
      value: patients.length.toString(),
      icon: 'people',
      color: Colors.primary,
    },
    {
      id: 'active',
      title: 'Activos',
      value: patients.filter(p => p.status === 'active').length.toString(),
      icon: 'checkmark-circle',
      color: Colors.success,
    },
    {
      id: 'high_risk',
      title: 'Alto Riesgo',
      value: patients.filter(p => p.riskLevel === 'high').length.toString(),
      icon: 'warning',
      color: Colors.danger,
    },
    {
      id: 'appointments',
      title: 'Próximas Citas',
      value: patients.filter(p => p.nextAppointment).length.toString(),
      icon: 'calendar',
      color: Colors.secondary,
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header específico para doctores */}
      <View style={styles.titleSection}>
        <View style={styles.titleContent}>
          <ThemedText style={styles.pageTitle}>Mis Pacientes</ThemedText>
          <ThemedText style={styles.pageSubtitle}>
            Gestiona tu práctica médica
          </ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-patient')}
        >
          <Ionicons name="person-add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda avanzada */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, email o condición..."
            placeholderTextColor={Colors.darkGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Estadísticas médicas */}
      <View style={styles.statsSection}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            <ThemedText style={styles.statNumber}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.title}</ThemedText>
          </View>
        ))}
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.filterChip}>
            <ThemedText style={styles.filterText}>Todos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: Colors.danger }]}>
            <ThemedText style={[styles.filterText, { color: Colors.white }]}>Alto Riesgo</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: Colors.success }]}>
            <ThemedText style={[styles.filterText, { color: Colors.white }]}>Activos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: Colors.primary }]}>
            <ThemedText style={[styles.filterText, { color: Colors.white }]}>Próximas Citas</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de pacientes con información médica */}
      <View style={styles.patientsSection}>
        <ThemedText style={styles.sectionTitle}>Lista de Pacientes</ThemedText>
        
        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={Colors.darkGray} />
            <ThemedText style={styles.emptyTitle}>
              {searchQuery ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando tu primer paciente'
              }
            </ThemedText>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/add-patient')}
              >
                <ThemedText style={styles.emptyButtonText}>
                  Agregar Paciente
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={[
                styles.patientCard,
                patient.riskLevel === 'high' && styles.highRiskCard
              ]}
              onPress={() => router.push(`/patient/${patient.id}`)}
            >
              {/* Header del paciente */}
              <View style={styles.patientHeader}>
                <View style={styles.patientAvatar}>
                  <View style={styles.avatar}>
                    <ThemedText style={styles.avatarText}>{patient.avatar}</ThemedText>
                  </View>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(patient.status) }]} />
                </View>
                
                <View style={styles.patientMainInfo}>
                  <View style={styles.nameRow}>
                    <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                    <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(patient.riskLevel) }]}>
                      <ThemedText style={styles.riskText}>
                        {getRiskLevelText(patient.riskLevel)}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <ThemedText style={styles.patientAge}>
                    {patient.age} años • Tipo {patient.bloodType}
                  </ThemedText>
                </View>
              </View>

              {/* Información médica */}
              <View style={styles.medicalInfo}>
                {patient.conditions.length > 0 && (
                  <View style={styles.conditionsRow}>
                    <Ionicons name="medical" size={16} color={Colors.primary} />
                    <ThemedText style={styles.conditionsText}>
                      {patient.conditions.join(', ')}
                    </ThemedText>
                  </View>
                )}
                
                <View style={styles.medicationsRow}>
                  <Ionicons name="fitness" size={16} color={Colors.secondary} />
                  <ThemedText style={styles.medicationsText}>
                    {patient.medications} medicamentos activos
                  </ThemedText>
                </View>

                {patient.urgentNotes && (
                  <View style={styles.urgentNotes}>
                    <Ionicons name="alert-circle" size={16} color={Colors.warning} />
                    <ThemedText style={styles.urgentText}>
                      {patient.urgentNotes}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Fechas importantes */}
              <View style={styles.datesInfo}>
                <View style={styles.dateItem}>
                  <ThemedText style={styles.dateLabel}>Última visita:</ThemedText>
                  <ThemedText style={styles.dateValue}>
                    {formatDate(patient.lastVisit)}
                  </ThemedText>
                </View>
                {patient.nextAppointment && (
                  <View style={styles.dateItem}>
                    <ThemedText style={styles.dateLabel}>Próxima cita:</ThemedText>
                    <ThemedText style={[styles.dateValue, { color: Colors.primary }]}>
                      {formatDate(patient.nextAppointment)}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Acciones rápidas para doctores */}
              <View style={styles.doctorActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handlePatientAction('chat', patient.id, patient.name)}
                >
                  <Ionicons name="chatbubble" size={18} color={Colors.primary} />
                  <ThemedText style={styles.actionText}>Chat</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handlePatientAction('call', patient.id, patient.name)}
                >
                  <Ionicons name="call" size={18} color={Colors.success} />
                  <ThemedText style={styles.actionText}>Llamar</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handlePatientAction('medical', patient.id, patient.name)}
                >
                  <Ionicons name="document-text" size={18} color={Colors.info} />
                  <ThemedText style={styles.actionText}>Historial</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handlePatientAction('appointment', patient.id, patient.name)}
                >
                  <Ionicons name="calendar" size={18} color={Colors.secondary} />
                  <ThemedText style={styles.actionText}>Cita</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: 'transparent',
  },
  titleContent: {
    flex: 1,
  },
  pageTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    opacity: 0.9,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    marginBottom: Spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...BordersAndShadows.shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: Spacing.lg,
    paddingLeft: Spacing.lg,
  },
  filterChip: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  filterText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
  },
  patientsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  patientCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.md,
  },
  highRiskCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  patientAvatar: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  patientMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  patientName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
  },
  riskText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  patientAge: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  medicalInfo: {
    marginBottom: Spacing.md,
  },
  conditionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  conditionsText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  medicationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  medicationsText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.sm,
  },
  urgentNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.xs,
  },
  urgentText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.warning,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeights.medium,
    flex: 1,
  },
  datesInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  dateLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  dateValue: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
  },
  doctorActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    minWidth: 60,
  },
  actionText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.dark,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
});

export default DoctorPatientsView;
