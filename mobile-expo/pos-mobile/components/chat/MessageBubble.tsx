import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { ChatMessage, MediaFile } from '@/store/chatStore';

const { width: screenWidth } = Dimensions.get('window');

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showTimestamp: boolean;
  onMediaPress?: (media: MediaFile) => void;
  onEditMessage?: (message: ChatMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showTimestamp,
  onMediaPress,
  onEditMessage,
  onDeleteMessage,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'text':
        return (
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {message.content}
          </Text>
        );
      
      case 'voice':
        return (
          <VoiceMessagePlayer 
            message={message}
            isOwnMessage={isOwnMessage}
          />
        );
      
      case 'image':
        return (
          <View style={styles.imageContainer}>
            {message.media_files?.map((file, index) => (
              <TouchableOpacity
                key={file.id}
                onPress={() => onMediaPress?.(file)}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: file.url }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
            {message.content && (
              <Text style={[
                styles.imageCaption,
                isOwnMessage ? styles.ownMessageText : styles.otherMessageText
              ]}>
                {message.content}
              </Text>
            )}
          </View>
        );
      
      case 'file':
      case 'medical_document':
        return (
          <View style={styles.fileMessage}>
            <View style={styles.fileHeader}>
              <Ionicons
                name={getFileIcon(message.media_files?.[0]?.type)}
                size={24}
                color={Colors.primary}
              />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>
                  {message.media_files?.[0]?.name || 'Documento'}
                </Text>
                <Text style={styles.fileSize}>
                  {formatFileSize(message.media_files?.[0]?.size || 0)}
                </Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Ionicons name="download-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {message.is_confidential && (
              <View style={styles.confidentialBadge}>
                <Ionicons name="lock-closed" size={12} color={Colors.warning} />
                <Text style={styles.confidentialText}>Confidencial</Text>
              </View>
            )}
            {message.content && (
              <Text style={styles.fileCaption}>{message.content}</Text>
            )}
          </View>
        );
      
      case 'video_call':
      case 'audio_call':
        return (
          <View style={styles.callMessage}>
            <Ionicons
              name={message.message_type === 'video_call' ? 'videocam' : 'call'}
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.callText}>
              {message.message_type === 'video_call' ? 'Videollamada' : 'Llamada de audio'}
              {message.call_duration && ` • ${formatCallDuration(message.call_duration)}`}
            </Text>
          </View>
        );
      
      case 'prescription':
        return (
          <View style={styles.prescriptionMessage}>
            <View style={styles.prescriptionHeader}>
              <Ionicons name="medical" size={20} color={Colors.success} />
              <Text style={styles.prescriptionTitle}>Receta Médica</Text>
            </View>
            <Text style={styles.prescriptionContent}>{message.content}</Text>
            <View style={styles.prescriptionFooter}>
              <Text style={styles.prescriptionDoctor}>
                Dr. {message.sender.first_name} {message.sender.last_name}
              </Text>
            </View>
          </View>
        );
      
      default:
        return (
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {message.content}
          </Text>
        );
    }
  };

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'document':
        return 'document-text-outline';
      case 'image':
        return 'image-outline';
      case 'audio':
        return 'musical-notes-outline';
      case 'video':
        return 'videocam-outline';
      default:
        return 'attach-outline';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCallDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLongPress = () => {
    if (!isOwnMessage || message.message_type !== 'text') return;
    
    Alert.alert(
      'Opciones del mensaje',
      'Selecciona una opción:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Editar', 
          onPress: () => onEditMessage?.(message) 
        },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Eliminar mensaje',
              '¿Estás seguro de que quieres eliminar este mensaje?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { 
                  text: 'Eliminar', 
                  style: 'destructive',
                  onPress: () => onDeleteMessage?.(message.id) 
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}>
      {showTimestamp && (
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>
            {new Date(message.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
      
      <View style={styles.messageRow}>
        {!isOwnMessage && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {message.sender.first_name.charAt(0)}
            </Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.bubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
            message.message_type === 'prescription' && styles.prescriptionBubble,
          ]}
          onLongPress={handleLongPress}
          activeOpacity={0.8}
        >
          {!isOwnMessage && (
            <Text style={styles.senderName}>
              {message.sender.first_name} {message.sender.last_name}
            </Text>
          )}
          
          {renderMessageContent()}
          
          <View style={styles.messageFooter}>
            <View style={styles.timeContainer}>
              {message.is_edited && (
                <Text style={[
                  styles.editedText,
                  isOwnMessage ? styles.ownTimeText : styles.otherTimeText
                ]}>
                  editado • 
                </Text>
              )}
              <Text style={[
                styles.timeText,
                isOwnMessage ? styles.ownTimeText : styles.otherTimeText
              ]}>
                {formatTime(message.created_at)}
              </Text>
            </View>
            
            {isOwnMessage && (
              <Ionicons
                name={message.read_at ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={message.read_at ? Colors.primary : Colors.darkGray}
                style={styles.readStatus}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  timestampContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  timestamp: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: screenWidth * 0.8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  bubble: {
    maxWidth: '100%',
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...BordersAndShadows.shadows.sm,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 6,
  },
  prescriptionBubble: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  senderName: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  messageText: {
    fontSize: Typography.fontSizes.md,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.white,
  },
  otherMessageText: {
    color: Colors.dark,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.xs,
  },
  timeText: {
    fontSize: Typography.fontSizes.xs,
  },
  ownTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimeText: {
    color: Colors.darkGray,
  },
  readStatus: {
    marginLeft: Spacing.xs,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editedText: {
    fontSize: Typography.fontSizes.xs - 1,
    fontStyle: 'italic',
  },
  
  // Voice message styles
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minWidth: 250,
    maxWidth: 320,
    marginVertical: Spacing.xs,
  },
  ownVoiceMessage: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: Spacing.md,
  },
  otherVoiceMessage: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  voiceAvatar: {
    marginRight: Spacing.sm,
    marginTop: Spacing.xs,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  voiceContent: {
    flex: 1,
  },
  senderName: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: Spacing.xs,
  },
  voiceControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  voiceWaveform: {
    flex: 1,
    position: 'relative',
    height: 24,
    marginRight: Spacing.md,
    justifyContent: 'center',
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  voiceDuration: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  playButtonDisabled: {
    opacity: 0.6,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedButton: {
    marginLeft: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  speedText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  
  // Image styles
  imageContainer: {
    minWidth: 200,
  },
  imageWrapper: {
    marginBottom: Spacing.xs,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  imageCaption: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  
  // File styles
  fileMessage: {
    minWidth: 250,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: Spacing.sm,
  },
  fileInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  fileName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeights.medium,
  },
  fileSize: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  downloadButton: {
    padding: Spacing.xs,
  },
  confidentialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  confidentialText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.warning,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  fileCaption: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  
  // Call styles
  callMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  callText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
  
  // Prescription styles
  prescriptionMessage: {
    minWidth: 250,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  prescriptionTitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.success,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.sm,
  },
  prescriptionContent: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  prescriptionFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.success,
    paddingTop: Spacing.sm,
  },
  prescriptionDoctor: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.success,
    fontWeight: Typography.fontWeights.medium,
  },
});

// Componente para reproducir notas de voz
interface VoiceMessagePlayerProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ message, isOwnMessage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFinished, setIsFinished] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const positionUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const hasFinishedRef = useRef(false); // Para evitar múltiples llamadas al finalizar

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAudioFinished = async () => {
    if (hasFinishedRef.current) {
      return; // Ya se procesó el fin del audio
    }
    
    hasFinishedRef.current = true;
    console.log('🔚 Audio terminó de reproducirse (procesando una sola vez)');
    
    setIsPlaying(false);
    setIsFinished(true);
    setCurrentPosition(0);
    stopPositionUpdates();
    
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(0);
      } catch (error) {
        console.error('Error al resetear posición:', error);
      }
    }
  };

  const startPositionUpdates = () => {
    stopPositionUpdates();
    hasFinishedRef.current = false; // Resetear flag al iniciar
    
    positionUpdateInterval.current = setInterval(async () => {
      if (soundRef.current && isPlaying && !hasFinishedRef.current) {
        try {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded && status.positionMillis !== undefined) {
            setCurrentPosition(status.positionMillis);
            
            // Verificar si terminó manualmente (solo si no se ha procesado ya)
            if (status.durationMillis && status.positionMillis >= status.durationMillis - 100) {
              handleAudioFinished(); // Usar función centralizada
            }
          } else if (!status.isLoaded || status.error) {
            console.log('⚠️ Audio no está cargado o tiene error, deteniendo actualizaciones');
            stopPositionUpdates();
            setIsPlaying(false);
          }
        } catch (error) {
          console.error('Error obteniendo posición:', error);
          stopPositionUpdates();
          setIsPlaying(false);
        }
      }
    }, 100);
  };

  const stopPositionUpdates = () => {
    if (positionUpdateInterval.current) {
      clearInterval(positionUpdateInterval.current);
      positionUpdateInterval.current = null;
    }
  };

  const changePlaybackSpeed = async () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    setPlaybackSpeed(nextSpeed);
    
    if (soundRef.current) {
      try {
        await soundRef.current.setRateAsync(nextSpeed, true);
      } catch (error) {
        console.error('Error cambiando velocidad:', error);
      }
    }
  };

  const playPauseAudio = async () => {
    try {
      if (!soundRef.current) {
        // Crear y cargar el audio por primera vez
        setIsLoading(true);
        
        // Obtener la URI real del archivo de audio
        const audioUri = message.media_files?.[0]?.url;
        
        if (!audioUri || audioUri.trim() === '' || audioUri === '🎙️ Nota de voz') {
          Alert.alert('Error', 'No se encontró un archivo de audio válido');
          setIsLoading(false);
          return;
        }

        console.log('🎵 Intentando reproducir audio desde:', audioUri);

        // Verificar si el archivo existe (solo para archivos locales)
        if (audioUri.startsWith('file://')) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(audioUri);
            console.log('📁 Información del archivo local:', fileInfo);
            
            if (!fileInfo.exists) {
              Alert.alert('Error', 'El archivo de audio no existe en el dispositivo. Esto puede ocurrir si grabaste el audio y luego reiniciaste la app en Expo.');
              setIsLoading(false);
              return;
            }
          } catch (fileError) {
            console.log('⚠️ No se pudo verificar el archivo local:', fileError);
            Alert.alert('Error', 'No se pudo acceder al archivo de audio');
            setIsLoading(false);
            return;
          }
        } else {
          console.log('🌐 Intentando reproducir desde URL remota:', audioUri);
        }

        // Configurar modo de audio para reproducción
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          // Usar configuración compatible
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { 
            shouldPlay: false,
            rate: playbackSpeed,
            shouldCorrectPitch: true,
          },
          (status) => {
            if (status.isLoaded) {
              if (status.durationMillis && duration === 0) {
                setDuration(status.durationMillis);
              }
              if (status.positionMillis !== undefined && !hasFinishedRef.current) {
                setCurrentPosition(status.positionMillis);
              }
              if (status.didJustFinish && !hasFinishedRef.current) {
                handleAudioFinished(); // Usar función centralizada
              }
            } else if (status.error) {
              console.error('❌ Error en el estado del audio:', status.error);
            }
          }
        );

        soundRef.current = sound;
        setIsLoading(false);
      }

      if (isPlaying) {
        // Pausar
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        stopPositionUpdates();
      } else {
        // Reproducir o continuar
        if (isFinished) {
          // Si terminó, reiniciar desde el principio
          await soundRef.current.setPositionAsync(0);
          setCurrentPosition(0);
          setIsFinished(false);
          hasFinishedRef.current = false; // Resetear flag para nueva reproducción
        }
        
        await soundRef.current.playAsync();
        setIsPlaying(true);
        startPositionUpdates();
      }
    } catch (error) {
      console.error('Error al reproducir audio:', error);
      setIsLoading(false);
      
      // Manejo específico de errores
      if (error.message?.includes('interruptionModeIOS')) {
        console.log('🔄 Reintentando con configuración simplificada...');
        try {
          // Intentar con configuración mínima
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
          });
          
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUri },
            { shouldPlay: false }
          );
          
          soundRef.current = sound;
          setIsLoading(false);
          
          // Intentar reproducir inmediatamente
          await sound.playAsync();
          setIsPlaying(true);
          return;
        } catch (retryError) {
          console.error('Error en segundo intento:', retryError);
        }
      }
      
      Alert.alert(
        'Error de Reproducción', 
        'No se pudo reproducir la nota de voz. Esto puede ocurrir en el entorno de desarrollo de Expo.'
      );
    }
  };

  // Limpiar al desmontar
  React.useEffect(() => {
    return () => {
      stopPositionUpdates();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={[styles.voiceMessage, isOwnMessage ? styles.ownVoiceMessage : styles.otherVoiceMessage]}>
      {/* Avatar del remitente (solo para mensajes de otros) */}
      {!isOwnMessage && (
        <View style={styles.voiceAvatar}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {message.sender.first_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.voiceContent}>
        {/* Información del remitente */}
        {!isOwnMessage && (
          <Text style={styles.senderName}>
            {message.sender.first_name}
          </Text>
        )}
        
        <View style={styles.voiceControls}>
          {/* Botón de play/pause */}
          <TouchableOpacity 
            style={[
              styles.playButton,
              isLoading && styles.playButtonDisabled
            ]}
            onPress={playPauseAudio}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="sync" size={20} color={Colors.white} />
            ) : (
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={20} 
                color={Colors.white} 
              />
            )}
          </TouchableOpacity>
          
          {/* Forma de onda y progreso */}
          <View style={styles.voiceWaveform}>
            {/* Barra de progreso visual */}
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: duration > 0 ? `${(currentPosition / duration) * 100}%` : '0%' }
                ]} 
              />
            </View>
            
            {/* Forma de onda simulada */}
            <View style={styles.waveformBars}>
              {Array.from({ length: 20 }).map((_, i) => {
                const progress = duration > 0 ? currentPosition / duration : 0;
                const isActive = i < (progress * 20);
                return (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      { 
                        height: Math.random() * 20 + 8,
                        backgroundColor: isActive 
                          ? (isOwnMessage ? Colors.white : Colors.primary)
                          : 'rgba(255, 255, 255, 0.3)'
                      }
                    ]}
                  />
                );
              })}
            </View>
          </View>
          
          {/* Tiempo y velocidad */}
          <View style={styles.voiceInfo}>
            <Text style={[
              styles.voiceDuration,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText
            ]}>
              {isPlaying || currentPosition > 0 
                ? formatTime(currentPosition) 
                : formatTime(duration || (message.call_duration || 0) * 1000)
              }
            </Text>
            
            {/* Botón de velocidad (solo cuando se está reproduciendo) */}
            {(isPlaying || isFinished) && (
              <TouchableOpacity 
                style={styles.speedButton}
                onPress={changePlaybackSpeed}
              >
                <Text style={[
                  styles.speedText,
                  isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                ]}>
                  {playbackSpeed}x
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
