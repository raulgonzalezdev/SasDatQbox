import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useMedicalStore } from '@/store/medicalStore';
import { useNotificationStore, PaymentProof } from '@/store/notificationStore';
import { useAppStore } from '@/store/appStore';

interface PaymentValidationPanelProps {
  visible: boolean;
  onClose: () => void;
}

const PaymentValidationPanel: React.FC<PaymentValidationPanelProps> = ({ visible, onClose }) => {
  const { user } = useAppStore();
  const { 
    paymentProofs, 
    getPendingPaymentProofs, 
    verifyPayment,
    updatePaymentStatus,
    updateAppointmentStatus 
  } = useMedicalStore();
  const { notifyPaymentApproved, notifyPaymentRejected } = useNotificationStore();
  
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingProofs = getPendingPaymentProofs();

  const handleApprovePayment = (proof: PaymentProof) => {
    Alert.alert(
      'Aprobar Pago',
      '¿Estás seguro de que quieres aprobar este comprobante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aprobar', 
          onPress: () => {
            // Verificar el pago
            verifyPayment(proof.id, true);
            
            // Actualizar estado del pago en la cita
            const appointment = useMedicalStore.getState().appointments.find(apt => 
              apt.consultation_fee === proof.amount
            );
            
            if (appointment) {
              updatePaymentStatus(appointment.id, 'paid');
              updateAppointmentStatus(appointment.id, 'confirmed');
              
              // Notificar al paciente
              notifyPaymentApproved(appointment.patient_id, appointment.id);
            }
            
            Alert.alert('Éxito', 'El pago ha sido aprobado exitosamente');
          }
        },
      ]
    );
  };

  const handleRejectPayment = (proof: PaymentProof) => {
    setSelectedProof(proof);
    setShowRejectModal(true);
  };

  const confirmRejectPayment = () => {
    if (!selectedProof) return;
    
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Debes especificar una razón para el rechazo');
      return;
    }

    // Verificar el pago como rechazado
    verifyPayment(selectedProof.id, false, rejectionReason);
    
    // Buscar la cita relacionada
    const appointment = useMedicalStore.getState().appointments.find(apt => 
      apt.consultation_fee === selectedProof.amount
    );
    
    if (appointment) {
      // Notificar al paciente
      notifyPaymentRejected(appointment.patient_id, appointment.id, rejectionReason);
    }
    
    setShowRejectModal(false);
    setSelectedProof(null);
    setRejectionReason('');
    
    Alert.alert('Pago Rechazado', 'El paciente ha sido notificado sobre el rechazo');
  };

  const getPaymentMethodName = (type: string) => {
    switch (type) {
      case 'mobile_payment':
        return 'Pago Móvil';
      case 'bank_transfer':
        return 'Transferencia Bancaria';
      default:
        return 'Otro';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPaymentProof = (proof: PaymentProof) => (
    <View key={proof.id} style={styles.proofCard}>
      <View style={styles.proofHeader}>
        <View style={styles.amountSection}>
          <ThemedText style={styles.amountText}>${proof.amount.toFixed(2)}</ThemedText>
          <ThemedText style={styles.currencyText}>{proof.currency}</ThemedText>
        </View>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: Colors.warning }]}>
            <ThemedText style={styles.statusText}>Pendiente</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.proofDetails}>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Método:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {getPaymentMethodName(proof.payment_method_id)}
          </ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Referencia:</ThemedText>
          <ThemedText style={styles.detailValue}>{proof.reference_number}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Fecha:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {formatDate(proof.transaction_date)}
          </ThemedText>
        </View>
        
        {proof.sender_bank && (
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Banco:</ThemedText>
            <ThemedText style={styles.detailValue}>{proof.sender_bank}</ThemedText>
          </View>
        )}
        
        {proof.notes && (
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Notas:</ThemedText>
            <ThemedText style={styles.detailValue}>{proof.notes}</ThemedText>
          </View>
        )}
      </View>

      {proof.proof_image_url && (
        <View style={styles.imageSection}>
          <ThemedText style={styles.imageLabel}>Comprobante:</ThemedText>
          <Image source={{ uri: proof.proof_image_url }} style={styles.proofImage} />
        </View>
      )}

      <View style={styles.proofActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRejectPayment(proof)}
        >
          <Ionicons name="close-circle" size={20} color={Colors.white} />
          <ThemedText style={styles.actionButtonText}>Rechazar</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApprovePayment(proof)}
        >
          <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
          <ThemedText style={styles.actionButtonText}>Aprobar</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Validar Pagos</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {pendingProofs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="card" size={64} color={Colors.lightGray} />
                <ThemedText style={styles.emptyTitle}>Sin pagos pendientes</ThemedText>
                <ThemedText style={styles.emptyText}>
                  No hay comprobantes de pago esperando validación
                </ThemedText>
              </View>
            ) : (
              <>
                <View style={styles.summary}>
                  <ThemedText style={styles.summaryText}>
                    {pendingProofs.length} comprobante{pendingProofs.length > 1 ? 's' : ''} pendiente{pendingProofs.length > 1 ? 's' : ''}
                  </ThemedText>
                </View>
                {pendingProofs.map(renderPaymentProof)}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de rechazo */}
      <Modal visible={showRejectModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.rejectModal}>
            <ThemedText style={styles.modalTitle}>Rechazar Pago</ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Especifica la razón del rechazo para el paciente:
            </ThemedText>
            
            <TextInput
              style={styles.reasonInput}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Ej: Datos incorrectos, monto no coincide..."
              placeholderTextColor={Colors.darkGray}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedProof(null);
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRejectPayment}
              >
                <ThemedText style={styles.confirmButtonText}>Rechazar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  summary: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium as any,
  },
  proofCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.md,
  },
  proofHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  currencyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
  proofDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    fontWeight: Typography.fontWeights.medium as any,
  },
  detailValue: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    flex: 1,
    textAlign: 'right',
  },
  imageSection: {
    marginBottom: Spacing.md,
  },
  imageLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  proofActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  rejectButton: {
    backgroundColor: Colors.danger,
  },
  approveButton: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  rejectModal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: Spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  confirmButton: {
    backgroundColor: Colors.danger,
  },
  cancelButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
  },
  confirmButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.white,
  },
});

export default PaymentValidationPanel;
