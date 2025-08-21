import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
  Animated,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import VoiceRecorder from './VoiceRecorder';

interface MessageComposerProps {
  conversationId: string;
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'voice', files?: any[]) => void;
  onFocusChange?: (focused: boolean) => void;
  draft?: string;
  onDraftChange?: (content: string) => void;
  isTyping?: boolean;
  editingMessage?: any;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onCancelEdit?: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  conversationId,
  onSendMessage,
  onFocusChange,
  draft = '',
  onDraftChange,
  isTyping = false,
  editingMessage,
  onEditMessage,
  onCancelEdit,
}) => {
  const [message, setMessage] = useState(draft);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<TextInput>(null);
  const attachmentAnimation = useRef(new Animated.Value(0)).current;
  const recordingAnimation = useRef(new Animated.Value(0)).current;

  // Manejar mensaje en edición
  React.useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      inputRef.current?.focus();
    } else {
      setMessage(draft);
    }
  }, [editingMessage, draft]);

  const handleSend = () => {
    if (message.trim()) {
      if (editingMessage) {
        // Editar mensaje existente
        onEditMessage?.(editingMessage.id, message.trim());
      } else {
        // Enviar nuevo mensaje
        onSendMessage(message.trim());
      }
      setMessage('');
      onDraftChange?.('');
    }
  };

  const handleCancelEdit = () => {
    onCancelEdit?.();
    setMessage(draft);
  };

  const handleInputChange = (text: string) => {
    setMessage(text);
    onDraftChange?.(text);
    
    // Simular indicador de "escribiendo"
    // En una implementación real, esto se enviaría al socket
    console.log('🔤 Usuario escribiendo:', text.length > 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  const showAttachmentSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Cancelar',
            '📷 Cámara',
            '🖼️ Galería',
            '📄 Documento',
            '🩺 Documento Médico',
            '📋 Receta',
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          handleAttachmentOption(buttonIndex);
        }
      );
    } else {
      // Para Android, mostrar modal personalizado
      setShowAttachmentOptions(true);
      Animated.spring(attachmentAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const hideAttachmentOptions = () => {
    Animated.spring(attachmentAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setShowAttachmentOptions(false);
    });
  };

  const handleAttachmentOption = async (optionIndex: number) => {
    if (Platform.OS === 'android' && showAttachmentOptions) {
      hideAttachmentOptions();
    }

    switch (optionIndex) {
      case 1: // Cámara
        await openCamera();
        break;
      case 2: // Galería
        await openGallery();
        break;
      case 3: // Documento
        await openDocumentPicker();
        break;
      case 4: // Documento Médico
        await openDocumentPicker(true);
        break;
      case 5: // Receta
        await createPrescription();
        break;
      default:
        break;
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesita acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onSendMessage('', asset.type === 'video' ? 'file' : 'image', [asset]);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesita acceso a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const hasVideo = result.assets.some(asset => asset.type === 'video');
      onSendMessage('', hasVideo ? 'file' : 'image', result.assets);
    }
  };

  const openDocumentPicker = async (isMedical = false) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: isMedical 
          ? ['application/pdf', 'image/*'] // Para documentos médicos, permitir PDF e imágenes
          : '*/*', // Para documentos generales, permitir todo
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        onSendMessage(
          isMedical ? 'Documento médico adjunto' : '',
          isMedical ? 'medical_document' : 'file',
          [file]
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  const createPrescription = () => {
    Alert.prompt(
      'Nueva Receta',
      'Ingrese los detalles de la receta médica:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: (prescriptionText) => {
            if (prescriptionText?.trim()) {
              onSendMessage(prescriptionText, 'prescription');
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const handleVoiceMessage = (audioFile: any) => {
    onSendMessage('Nota de voz', 'voice', [audioFile]);
    setShowVoiceRecorder(false);
  };

  const handleCancelVoice = () => {
    setShowVoiceRecorder(false);
  };

  const renderAttachmentOptions = () => {
    if (!showAttachmentOptions) return null;

    const options = [
      { icon: 'camera', label: 'Cámara', onPress: () => handleAttachmentOption(1) },
      { icon: 'image', label: 'Galería', onPress: () => handleAttachmentOption(2) },
      { icon: 'document', label: 'Documento', onPress: () => handleAttachmentOption(3) },
      { icon: 'medical', label: 'Doc. Médico', onPress: () => handleAttachmentOption(4) },
      { icon: 'receipt', label: 'Receta', onPress: () => handleAttachmentOption(5) },
    ];

    return (
      <Animated.View
        style={[
          styles.attachmentOptionsContainer,
          {
            transform: [{
              translateY: attachmentAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              })
            }],
            opacity: attachmentAnimation,
          }
        ]}
      >
        <View style={styles.attachmentOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.attachmentOption}
              onPress={option.onPress}
            >
              <Ionicons name={option.icon as any} size={24} color={Colors.primary} />
              <Text style={styles.attachmentOptionLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.closeAttachmentOptions}
          onPress={hideAttachmentOptions}
        >
          <Ionicons name="close" size={24} color={Colors.darkGray} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Opciones de adjuntos para Android */}
      {renderAttachmentOptions()}
      
      {/* Barra de edición */}
      {editingMessage && (
        <View style={styles.editingBar}>
          <View style={styles.editingInfo}>
            <Ionicons name="create-outline" size={16} color={Colors.primary} />
            <Text style={styles.editingText}>Editando mensaje</Text>
          </View>
          <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelEditButton}>
            <Ionicons name="close" size={16} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        {/* Botón de adjuntos */}
        <TouchableOpacity
          style={styles.attachButton}
          onPress={showAttachmentSheet}
        >
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>

        {/* Input de texto */}
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Colors.darkGray}
          value={message}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={message.trim() ? handleSend : undefined}
        />

        {/* Botón de nota de voz o enviar */}
        {message.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons 
              name={editingMessage ? "checkmark" : "send"} 
              size={20} 
              color={Colors.white} 
            />
          </TouchableOpacity>
        ) : !editingMessage ? (
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => setShowVoiceRecorder(true)}
          >
            <Ionicons name="mic" size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Grabador de voz mejorado */}
      {showVoiceRecorder && (
        <VoiceRecorder
          onSendVoiceMessage={handleVoiceMessage}
          onCancel={handleCancelVoice}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 60,
  },
  inputContainerFocused: {
    borderTopColor: Colors.primary,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
    ...BordersAndShadows.shadows.sm,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
    ...BordersAndShadows.shadows.sm,
  },

  
  // Opciones de adjuntos
  attachmentOptionsContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: Spacing.lg,
  },
  attachmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: 15,
    paddingVertical: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  attachmentOption: {
    alignItems: 'center',
    minWidth: 60,
  },
  attachmentOptionLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.dark,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  closeAttachmentOptions: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Estilos de edición
  editingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.lightGray,
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
  },
  editingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  cancelEditButton: {
    padding: Spacing.xs,
  },
});

export default MessageComposer;
