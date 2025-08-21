import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

export default function PatientsScreen() {
  const { user } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Datos simulados de pacientes
  const patients = [
    {
      id: '1',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+1 234 567 8900',
      age: 35,
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-20',
      status: 'active',
      avatar: 'MG',
      medicalHistory: 'Hipertensión, Diabetes tipo 2',
    },
    {
      id: '2',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+1 234 567 8901',
      age: 42,
      lastVisit: '2024-01-08',
      nextAppointment: null,
      status: 'inactive',
      avatar: 'JP',
      medicalHistory: 'Asma, Alergias',
    },
    {
      id: '3',
      name: 'Laura Silva',
      email: 'laura.silva@email.com',
      phone: '+1 234 567 8902',
      age: 28,
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-18',
      status: 'active',
      avatar: 'LS',
      medicalHistory: 'Ninguna condición conocida',
    },
    {
      id: '4',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+1 234 567 8903',
      age: 55,
      lastVisit: '2024-01-05',
      nextAppointment: '2024-01-25',
      status: 'active',
      avatar: 'CR',
      medicalHistory: 'Artritis, Hipertensión',
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'inactive':
        return Colors.darkGray;
      default:
        return Colors.darkGray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      title: 'Pacientes Activos',
      value: patients.filter(p => p.status === 'active').length.toString(),
      icon: 'checkmark-circle',
      color: Colors.success,
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
    <SafeAreaView style={CommonStyles.safeArea}>
      <ThemedView style={CommonStyles.container}>
        {/* Sección de título y botón */}
        <View style={styles.titleSection}>
          <View style={styles.titleContent}>
            <ThemedText style={styles.pageTitle}>Pacientes</ThemedText>
            <ThemedText style={styles.pageSubtitle}>
              Gestiona tu lista de pacientes
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-patient')}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {/* Barra de búsqueda */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar pacientes..."
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

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                <ThemedText style={styles.statNumber}>{stat.value}</ThemedText>
                <ThemedText style={styles.statLabel}>{stat.title}</ThemedText>
              </View>
            ))}
          </View>

          {/* Lista de pacientes */}
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
                  style={styles.patientCard}
                  onPress={() => router.push(`/patient/${patient.id}`)}
                >
                  <View style={styles.patientAvatar}>
                    <View style={styles.avatar}>
                      <ThemedText style={styles.avatarText}>{patient.avatar}</ThemedText>
                    </View>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(patient.status) }]} />
                  </View>
                  
                  <View style={styles.patientContent}>
                    <View style={styles.patientHeader}>
                      <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                        <ThemedText style={styles.statusText}>
                          {getStatusText(patient.status)}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.patientInfo}>
                      <View style={styles.infoRow}>
                        <Ionicons name="mail" size={16} color={Colors.darkGray} />
                        <ThemedText style={styles.infoText}>{patient.email}</ThemedText>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="call" size={16} color={Colors.darkGray} />
                        <ThemedText style={styles.infoText}>{patient.phone}</ThemedText>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="person" size={16} color={Colors.darkGray} />
                        <ThemedText style={styles.infoText}>{patient.age} años</ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.patientFooter}>
                      <View style={styles.footerInfo}>
                        <ThemedText style={styles.footerLabel}>Última visita:</ThemedText>
                        <ThemedText style={styles.footerValue}>
                          {formatDate(patient.lastVisit)}
                        </ThemedText>
                      </View>
                      {patient.nextAppointment && (
                        <View style={styles.footerInfo}>
                          <ThemedText style={styles.footerLabel}>Próxima cita:</ThemedText>
                          <ThemedText style={[styles.footerValue, { color: Colors.secondary }]}>
                            {formatDate(patient.nextAppointment)}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.patientActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="chatbubble" size={20} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="call" size={20} color={Colors.info} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="medical" size={20} color={Colors.success} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

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
    color: Colors.white, // Cambiado a blanco
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white, // Cambiado a blanco
    opacity: 0.9, // Ligera transparencia para jerarquía
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
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
    borderRadius: 20, // Más redondeado
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    // Efecto 3D mejorado
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 20, // Más redondeadas
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    // Efecto 3D mejorado
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  patientsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
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
    paddingHorizontal: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20, // Más redondeadas
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    // Efecto 3D mejorado
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  patientContent: {
    flex: 1,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  patientName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  patientInfo: {
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  patientFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.sm,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  footerLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  footerValue: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
  },
  patientActions: {
    justifyContent: 'space-around',
    marginLeft: Spacing.md,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
});
