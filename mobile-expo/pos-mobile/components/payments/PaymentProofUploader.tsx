import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useMedicalStore, PaymentMethod } from '@/store/medicalStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAppStore } from '@/store/appStore';
import * as ImagePicker from 'expo-image-picker';

interface PaymentProofUploaderProps {
  visible: boolean;
  onClose: () => void;
  appointmentId: string;
  amount: number;
}

const PaymentProofUploader: React.FC<PaymentProofUploaderProps> = ({
  visible,
  onClose,
  appointmentId,
  amount,
}) => {
  const { user } = useAppStore();
  const { paymentMethods, submitPaymentProof, addPaymentMethod, appointments } = useMedicalStore();
  const { notifyPaymentSubmitted } = useNotificationStore();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Campos específicos para pago móvil
  const [mobilePayment, setMobilePayment] = useState({
    senderBank: '',
    senderPhone: '',
    senderDocument: '', // cédula o RIF
    referenceNumber: '',
    transactionDate: new Date(),
    amount: amount,
  });
  
  // Campos específicos para transferencia bancaria
  const [bankTransfer, setBankTransfer] = useState({
    destinationAccount: '',
    referenceNumber: '',
    amount: amount,
    transactionDate: new Date(),
  });

  // Inicializar métodos de pago por defecto si no existen
  React.useEffect(() => {
    if (paymentMethods.length === 0) {
      // Agregar métodos de pago por defecto
      addPaymentMethod({
        type: 'mobile_payment',
        name: 'Pago Móvil',
        details: {
          phone_number: '+58-414-1234567'
        },
        is_active: true,
      });
      
      addPaymentMethod({
        type: 'bank_transfer',
        name: 'Transferencia Bancaria',
        details: {
          bank_name: 'Banco de Venezuela',
          account_number: '0102-1234-56-7890123456'
        },
        is_active: true,
      });
    }
  }, [paymentMethods.length, addPaymentMethod]);

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita acceso a la galería para subir el comprobante');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita acceso a la cámara para tomar una foto');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Seleccionar Imagen',
      'Elige cómo quieres agregar el comprobante',
      [
        { text: 'Tomar Foto', onPress: handleTakePhoto },
        { text: 'Desde Galería', onPress: handleImagePicker },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const validateForm = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Selecciona un método de pago');
      return false;
    }
    
    if (!proofImage) {
      Alert.alert('Error', 'Debes agregar una foto del comprobante');
      return false;
    }
    
    if (selectedPaymentMethod.type === 'mobile_payment') {
      if (!mobilePayment.senderBank.trim()) {
        Alert.alert('Error', 'Selecciona el banco de origen');
        return false;
      }
      if (!mobilePayment.senderPhone.trim()) {
        Alert.alert('Error', 'Ingresa el teléfono');
        return false;
      }
      if (!mobilePayment.senderDocument.trim()) {
        Alert.alert('Error', 'Ingresa la cédula o RIF');
        return false;
      }
      if (!mobilePayment.referenceNumber.trim()) {
        Alert.alert('Error', 'Ingresa el número de comprobante');
        return false;
      }
    }
    
    if (selectedPaymentMethod.type === 'bank_transfer') {
      if (!bankTransfer.destinationAccount.trim()) {
        Alert.alert('Error', 'Ingresa la cuenta destino');
        return false;
      }
      if (!bankTransfer.referenceNumber.trim()) {
        Alert.alert('Error', 'Ingresa el número de referencia');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmitProof = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let paymentData: any = {
        payment_method_id: selectedPaymentMethod!.id,
        amount,
        currency: 'USD',
        proof_image_url: proofImage!,
        status: 'pending' as const,
        notes,
      };

      if (selectedPaymentMethod!.type === 'mobile_payment') {
        paymentData = {
          ...paymentData,
          sender_bank: mobilePayment.senderBank,
          sender_phone: mobilePayment.senderPhone,
          sender_document: mobilePayment.senderDocument,
          reference_number: mobilePayment.referenceNumber,
          transaction_date: mobilePayment.transactionDate,
          receiver_bank: selectedPaymentMethod!.details.bank_name || 'Banco Receptor',
        };
      } else if (selectedPaymentMethod!.type === 'bank_transfer') {
        paymentData = {
          ...paymentData,
          destination_account: bankTransfer.destinationAccount,
          reference_number: bankTransfer.referenceNumber,
          transaction_date: bankTransfer.transactionDate,
          sender_bank: 'Banco Emisor', // Se puede agregar selector después
          receiver_bank: selectedPaymentMethod!.details.bank_name || 'Banco Receptor',
        };
      }
      
      submitPaymentProof(paymentData);
      
      // Buscar la cita para obtener el doctor
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment && user) {
        // Generar notificaciones
        notifyPaymentSubmitted(user.id, appointment.doctor_id, appointmentId, amount);
      }
      
      Alert.alert(
        'Comprobante Enviado',
        'Tu comprobante ha sido enviado para verificación. El doctor revisará tu pago y te notificaremos cuando sea aprobado.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el comprobante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaymentMethodSelection = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Método de Pago Utilizado</ThemedText>
      {paymentMethods.filter(pm => pm.is_active).map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethodOption,
            selectedPaymentMethod?.id === method.id && styles.selectedOption
          ]}
          onPress={() => setSelectedPaymentMethod(method)}
        >
          <Ionicons 
            name={method.type === 'mobile_payment' ? 'phone-portrait' : 'card'} 
            size={24} 
            color={selectedPaymentMethod?.id === method.id ? Colors.white : Colors.primary} 
          />
          <View style={styles.methodInfo}>
            <ThemedText style={[
              styles.methodName,
              selectedPaymentMethod?.id === method.id && styles.selectedText
            ]}>
              {method.name}
            </ThemedText>
            <ThemedText style={[
              styles.methodDetails,
              selectedPaymentMethod?.id === method.id && styles.selectedText
            ]}>
              {method.type === 'mobile_payment' 
                ? method.details.phone_number 
                : `${method.details.bank_name} - ${method.details.account_number}`
              }
            </ThemedText>
          </View>
          {selectedPaymentMethod?.id === method.id && (
            <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMobilePaymentForm = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Datos del Pago Móvil</ThemedText>
      
      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Banco de Origen *</ThemedText>
        <TextInput
          style={styles.textInput}
          value={mobilePayment.senderBank}
          onChangeText={(value) => setMobilePayment(prev => ({...prev, senderBank: value}))}
          placeholder="Ej: Banco de Venezuela"
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Teléfono *</ThemedText>
        <TextInput
          style={styles.textInput}
          value={mobilePayment.senderPhone}
          onChangeText={(value) => setMobilePayment(prev => ({...prev, senderPhone: value}))}
          placeholder="Ej: 0414-1234567"
          placeholderTextColor={Colors.darkGray}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Cédula o RIF *</ThemedText>
        <TextInput
          style={styles.textInput}
          value={mobilePayment.senderDocument}
          onChangeText={(value) => setMobilePayment(prev => ({...prev, senderDocument: value}))}
          placeholder="Ej: V-12345678"
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Número de Comprobante *</ThemedText>
        <TextInput
          style={styles.textInput}
          value={mobilePayment.referenceNumber}
          onChangeText={(value) => setMobilePayment(prev => ({...prev, referenceNumber: value}))}
          placeholder="Ej: 123456789"
          placeholderTextColor={Colors.darkGray}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Monto Pagado</ThemedText>
        <TextInput
          style={[styles.textInput, styles.readOnlyInput]}
          value={`$${amount.toFixed(2)}`}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Notas (Opcional)</ThemedText>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Comentarios adicionales..."
          placeholderTextColor={Colors.darkGray}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderBankTransferForm = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Datos de la Transferencia</ThemedText>
      
      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Cuenta Destino *</ThemedText>
        <TextInput
          style={styles.textInput}
          value={bankTransfer.destinationAccount}
          onChangeText={(value) => setBankTransfer(prev => ({...prev, destinationAccount: value}))}
          placeholder="Ej: 0102-1234-56-7890123456"
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Número de Referencia *</ThemedText>
        <TextInput
          style={styles.textInput}
          value={bankTransfer.referenceNumber}
          onChangeText={(value) => setBankTransfer(prev => ({...prev, referenceNumber: value}))}
          placeholder="Ej: 987654321"
          placeholderTextColor={Colors.darkGray}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Monto Transferido</ThemedText>
        <TextInput
          style={[styles.textInput, styles.readOnlyInput]}
          value={`$${amount.toFixed(2)}`}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>Notas (Opcional)</ThemedText>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Comentarios adicionales..."
          placeholderTextColor={Colors.darkGray}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderImageUpload = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Comprobante de Pago *</ThemedText>
      
      {proofImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: proofImage }} style={styles.proofImage} />
          <TouchableOpacity style={styles.changeImageButton} onPress={showImageOptions}>
            <Ionicons name="camera" size={20} color={Colors.white} />
            <ThemedText style={styles.changeImageText}>Cambiar</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
          <Ionicons name="camera" size={48} color={Colors.primary} />
          <ThemedText style={styles.uploadText}>Subir Comprobante</ThemedText>
          <ThemedText style={styles.uploadSubtext}>
            Toma una foto o selecciona desde tu galería
          </ThemedText>
        </TouchableOpacity>
      )}
      
      <View style={styles.uploadTips}>
        <ThemedText style={styles.tipsTitle}>Consejos para una mejor foto:</ThemedText>
        <ThemedText style={styles.tipText}>• Asegúrate de que sea legible</ThemedText>
        <ThemedText style={styles.tipText}>• Incluye toda la información</ThemedText>
        <ThemedText style={styles.tipText}>• Buena iluminación</ThemedText>
        <ThemedText style={styles.tipText}>• Sin reflejos</ThemedText>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Subir Comprobante</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.amountBanner}>
            <ThemedText style={styles.amountLabel}>Monto a Pagar</ThemedText>
            <ThemedText style={styles.amountValue}>${amount.toFixed(2)}</ThemedText>
          </View>

          {renderPaymentMethodSelection()}
          {selectedPaymentMethod?.type === 'mobile_payment' && renderMobilePaymentForm()}
          {selectedPaymentMethod?.type === 'bank_transfer' && renderBankTransferForm()}
          {selectedPaymentMethod && renderImageUpload()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedPaymentMethod || !proofImage || isSubmitting) && styles.disabledButton
            ]}
            onPress={handleSubmitProof}
            disabled={!selectedPaymentMethod || !proofImage || isSubmitting}
          >
            <ThemedText style={styles.submitButtonText}>
              {isSubmitting ? 'Enviando...' : 'Enviar Comprobante'}
            </ThemedText>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  amountBanner: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  amountLabel: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  amountValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  section: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    marginBottom: Spacing.md,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  methodInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  methodName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  methodDetails: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  selectedText: {
    color: Colors.white,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    backgroundColor: Colors.white,
  },
  readOnlyInput: {
    backgroundColor: Colors.background,
    color: Colors.darkGray,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  changeImageText: {
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium as any,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  uploadText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  uploadSubtext: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  uploadTips: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
  submitButtonText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
});

export default PaymentProofUploader;
