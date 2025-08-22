import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { mockPatientMedicalData, mockUsers } from '@/data/mockUsers';

const PatientProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'medical' | 'medications' | 'documents'>('general');
  
  const patientData = mockUsers.patient;
  const medicalData = mockPatientMedicalData;

  const handleEmergencyCall = () => {
    Alert.alert(
      'Llamada de Emergencia',
      '¿Deseas contactar a tu doctor o servicio de emergencia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Mi Doctor', onPress: () => router.push('/(drawer)/(tabs)/chat') },
        { text: 'Emergencia 911', onPress: () => Alert.alert('Llamando', 'Contactando servicio de emergencia...') },
      ]
    );
  };

  const handleShareProfile = () => {
    Alert.alert('Compartir Perfil', 'Funcionalidad de compartir perfil médico en desarrollo');
  };

  const handleUpdateVitals = () => {
    Alert.alert('Registrar Signos Vitales', 'Funcionalidad para registrar nuevos signos vitales en desarrollo');
  };

  const renderGeneralTab = () => (
    <View>
      {/* Información personal */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Información Personal</ThemedText>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Nombre Completo</ThemedText>
              <ThemedText style={styles.infoValue}>
                {patientData.first_name} {patientData.last_name}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Fecha de Nacimiento</ThemedText>
              <ThemedText style={styles.infoValue}>
                {patientData.dateOfBirth?.toLocaleDateString('es-ES')} (39 años)
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{patientData.email}</ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Teléfono</ThemedText>
              <ThemedText style={styles.infoValue}>{patientData.phone}</ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="water" size={20} color={Colors.danger} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Tipo de Sangre</ThemedText>
              <ThemedText style={styles.infoValue}>{patientData.bloodType}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Contacto de emergencia */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Contacto de Emergencia</ThemedText>
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="alert-circle" size={24} color={Colors.danger} />
            <ThemedText style={styles.emergencyTitle}>
              {patientData.emergencyContact?.name}
            </ThemedText>
          </View>
          
          <View style={styles.emergencyInfo}>
            <ThemedText style={styles.emergencyRelation}>
              {patientData.emergencyContact?.relationship}
            </ThemedText>
            <ThemedText style={styles.emergencyPhone}>
              {patientData.emergencyContact?.phone}
            </ThemedText>
          </View>
          
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Ionicons name="call" size={20} color={Colors.white} />
            <ThemedText style={styles.emergencyButtonText}>Llamar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seguro médico */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Seguro Médico</ThemedText>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Proveedor</ThemedText>
              <ThemedText style={styles.infoValue}>{patientData.insuranceProvider}</ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="card" size={20} color={Colors.success} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Número de Póliza</ThemedText>
              <ThemedText style={styles.infoValue}>{patientData.insuranceNumber}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMedicalTab = () => (
    <View>
      {/* Historial médico */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Historial Médico</ThemedText>
        {medicalData.medicalHistory.map((condition) => (
          <View key={condition.id} style={styles.conditionCard}>
            <View style={styles.conditionHeader}>
              <ThemedText style={styles.conditionName}>{condition.condition}</ThemedText>
              <View style={[
                styles.severityBadge, 
                { backgroundColor: condition.severity === 'severe' ? Colors.danger : 
                                   condition.severity === 'moderate' ? Colors.warning : Colors.success }
              ]}>
                <ThemedText style={styles.severityText}>
                  {condition.severity === 'severe' ? 'Severo' :
                   condition.severity === 'moderate' ? 'Moderado' : 'Leve'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.conditionDetails}>
              <ThemedText style={styles.conditionDate}>
                Diagnosticado: {new Date(condition.diagnosedDate).toLocaleDateString('es-ES')}
              </ThemedText>
              <ThemedText style={styles.conditionStatus}>
                Estado: {condition.status === 'active' ? 'Activo' : 'Controlado'}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Alergias */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Alergias</ThemedText>
        {medicalData.allergies.map((allergy) => (
          <View key={allergy.id} style={styles.allergyCard}>
            <View style={styles.allergyHeader}>
              <Ionicons name="warning" size={20} color={Colors.danger} />
              <ThemedText style={styles.allergyName}>{allergy.allergen}</ThemedText>
            </View>
            <ThemedText style={styles.allergyReaction}>
              Reacción: {allergy.reaction}
            </ThemedText>
            <View style={[
              styles.severityBadge, 
              { backgroundColor: allergy.severity === 'severe' ? Colors.danger : Colors.warning }
            ]}>
              <ThemedText style={styles.severityText}>
                {allergy.severity === 'severe' ? 'Severa' : 'Moderada'}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Signos vitales */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Últimos Signos Vitales</ThemedText>
          <TouchableOpacity onPress={handleUpdateVitals}>
            <ThemedText style={styles.updateButton}>Actualizar</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Ionicons name="heart" size={24} color={Colors.danger} />
            <ThemedText style={styles.vitalValue}>{medicalData.vitalSigns.heartRate}</ThemedText>
            <ThemedText style={styles.vitalUnit}>bpm</ThemedText>
            <ThemedText style={styles.vitalLabel}>Frecuencia Cardíaca</ThemedText>
          </View>
          
          <View style={styles.vitalCard}>
            <Ionicons name="speedometer" size={24} color={Colors.primary} />
            <ThemedText style={styles.vitalValue}>{medicalData.vitalSigns.bloodPressure}</ThemedText>
            <ThemedText style={styles.vitalUnit}>mmHg</ThemedText>
            <ThemedText style={styles.vitalLabel}>Presión Arterial</ThemedText>
          </View>
          
          <View style={styles.vitalCard}>
            <Ionicons name="thermometer" size={24} color={Colors.info} />
            <ThemedText style={styles.vitalValue}>{medicalData.vitalSigns.temperature}</ThemedText>
            <ThemedText style={styles.vitalUnit}>°C</ThemedText>
            <ThemedText style={styles.vitalLabel}>Temperatura</ThemedText>
          </View>
          
          <View style={styles.vitalCard}>
            <Ionicons name="fitness" size={24} color={Colors.success} />
            <ThemedText style={styles.vitalValue}>{medicalData.vitalSigns.weight}</ThemedText>
            <ThemedText style={styles.vitalUnit}>kg</ThemedText>
            <ThemedText style={styles.vitalLabel}>Peso</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.vitalsDate}>
          Última actualización: {medicalData.vitalSigns.lastRecorded.toLocaleDateString('es-ES')}
        </ThemedText>
      </View>
    </View>
  );

  const renderMedicationsTab = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Medicamentos Actuales</ThemedText>
      {medicalData.currentMedications.map((medication) => (
        <View key={medication.id} style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <View style={styles.medicationIcon}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
            </View>
            <View style={styles.medicationInfo}>
              <ThemedText style={styles.medicationName}>{medication.name}</ThemedText>
              <ThemedText style={styles.medicationDosage}>
                {medication.dosage} - {medication.frequency}
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.reminderButton}>
              <Ionicons name="alarm" size={16} color={Colors.warning} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.medicationDetails}>
            <ThemedText style={styles.prescribedBy}>
              Prescrito por: {medication.prescribedBy}
            </ThemedText>
            <ThemedText style={styles.startDate}>
              Desde: {new Date(medication.startDate).toLocaleDateString('es-ES')}
            </ThemedText>
          </View>
          
          <View style={styles.medicationActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <ThemedText style={styles.actionText}>Tomar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="time" size={16} color={Colors.warning} />
              <ThemedText style={styles.actionText}>Recordar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="information-circle" size={16} color={Colors.info} />
              <ThemedText style={styles.actionText}>Info</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderDocumentsTab = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Documentos Médicos</ThemedText>
      
      <TouchableOpacity style={styles.documentCard}>
        <View style={styles.documentIcon}>
          <Ionicons name="document-text" size={24} color={Colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <ThemedText style={styles.documentName}>Resultados de Laboratorio</ThemedText>
          <ThemedText style={styles.documentDate}>15 Enero 2024</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.documentCard}>
        <View style={styles.documentIcon}>
          <Ionicons name="camera" size={24} color={Colors.secondary} />
        </View>
        <View style={styles.documentInfo}>
          <ThemedText style={styles.documentName}>Radiografía de Tórax</ThemedText>
          <ThemedText style={styles.documentDate}>10 Enero 2024</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.documentCard}>
        <View style={styles.documentIcon}>
          <Ionicons name="receipt" size={24} color={Colors.success} />
        </View>
        <View style={styles.documentInfo}>
          <ThemedText style={styles.documentName}>Recetas Médicas</ThemedText>
          <ThemedText style={styles.documentDate}>Varias fechas</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="cloud-upload" size={24} color={Colors.white} />
        <ThemedText style={styles.uploadText}>Subir Nuevo Documento</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const tabs = [
    { id: 'general', title: 'General', icon: 'person' },
    { id: 'medical', title: 'Médico', icon: 'medical' },
    { id: 'medications', title: 'Medicinas', icon: 'fitness' },
    { id: 'documents', title: 'Documentos', icon: 'document-text' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header del perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarSection}>
          <View style={styles.largeAvatar}>
            <ThemedText style={styles.largeAvatarText}>
              {patientData.first_name.charAt(0)}{patientData.last_name.charAt(0)}
            </ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>
              {patientData.first_name} {patientData.last_name}
            </ThemedText>
            <ThemedText style={styles.profileRole}>Paciente</ThemedText>
            <ThemedText style={styles.profileDoctor}>
              Dr. {mockUsers.doctor.first_name} {mockUsers.doctor.last_name}
            </ThemedText>
          </View>
        </View>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
          <Ionicons name="share" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs de navegación */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={20} 
                color={activeTab === tab.id ? Colors.white : Colors.darkGray} 
              />
              <ThemedText style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenido de las tabs */}
      <View style={styles.tabContent}>
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'medical' && renderMedicalTab()}
        {activeTab === 'medications' && renderMedicationsTab()}
        {activeTab === 'documents' && renderDocumentsTab()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  largeAvatarText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileRole: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  profileDoctor: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    overflow: 'hidden',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    marginBottom: Spacing.lg,
    paddingLeft: Spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    marginRight: Spacing.sm,
    backgroundColor: Colors.lightGray,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  activeTabText: {
    color: Colors.white,
  },
  tabContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
  },
  updateButton: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
  },
  emergencyCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
    ...BordersAndShadows.shadows.sm,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emergencyTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginLeft: Spacing.md,
  },
  emergencyInfo: {
    marginBottom: Spacing.md,
  },
  emergencyRelation: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  emergencyPhone: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.md,
    borderRadius: 10,
  },
  emergencyButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.sm,
  },
  conditionCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  conditionName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
  },
  severityText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  conditionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conditionDate: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  conditionStatus: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium,
  },
  allergyCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
    ...BordersAndShadows.shadows.sm,
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  allergyName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginLeft: Spacing.sm,
  },
  allergyReaction: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  vitalCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  vitalValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  vitalUnit: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  vitalLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  vitalsDate: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  medicationCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  medicationDosage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationDetails: {
    marginBottom: Spacing.md,
  },
  prescribedBy: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  startDate: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  medicationActions: {
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
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  documentDate: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 15,
    marginTop: Spacing.md,
  },
  uploadText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.sm,
  },
});

export default PatientProfileView;
