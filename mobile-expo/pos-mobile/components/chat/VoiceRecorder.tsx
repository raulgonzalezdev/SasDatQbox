import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';

const { width: screenWidth } = Dimensions.get('window');

interface VoiceRecorderProps {
  onSendVoiceMessage: (audioFile: any) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSendVoiceMessage,
  onCancel,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [canSend, setCanSend] = useState(false);
  
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const waveAnimation = useRef(new Animated.Value(0)).current;
  
  const timerRef = useRef<NodeJS.Timeout>();
  const waveformTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      startTimer();
      startWaveformAnimation();
    } else {
      stopTimer();
      stopWaveformAnimation();
    }
    return () => {
      stopTimer();
      stopWaveformAnimation();
    };
  }, [isRecording]);

  const startTimer = () => {
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setRecordingDuration(seconds);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setRecordingTime(
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      );
      
      // Permitir envío después de 1 segundo
      if (seconds >= 1) {
        setCanSend(true);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startWaveformAnimation = () => {
    // Simular datos de forma de onda
    waveformTimer.current = setInterval(() => {
      setWaveformData(prev => {
        const newData = [...prev];
        if (newData.length >= 30) {
          newData.shift(); // Remover el primer elemento si ya hay 30
        }
        // Agregar nueva altura aleatoria para simular audio
        newData.push(Math.random() * 40 + 10);
        return newData;
      });
    }, 100);
    
    // Animación de pulso del botón de grabación
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopWaveformAnimation = () => {
    if (waveformTimer.current) {
      clearInterval(waveformTimer.current);
    }
    pulseAnimation.stopAnimation();
    pulseAnimation.setValue(1);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita acceso al micrófono');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      setWaveformData([]);
      setCanSend(false);
      
      console.log('🎤 Grabación iniciada');
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('🎤 Grabación detenida, URI:', uri);
    } catch (error) {
      console.error('Error al detener grabación:', error);
    }
  };

  const handleSendRecording = async () => {
    if (!recording || !canSend) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('🎙️ Audio grabado en URI:', uri);
      
      if (uri) {
        // Obtener información del archivo
        let fileSize = 0;
        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.exists) {
            fileSize = fileInfo.size || 0;
            console.log('📁 Tamaño del archivo:', fileSize, 'bytes');
          }
        } catch (e) {
          console.log('⚠️ No se pudo obtener información del archivo:', e);
        }

        const audioFile = {
          id: `voice_${Date.now()}`,
          uri,
          url: uri, // Asegurar que ambos campos estén disponibles
          name: `voice_message_${Date.now()}.m4a`,
          type: 'audio',
          mimeType: 'audio/m4a',
          mime_type: 'audio/m4a', // Doble formato para compatibilidad
          size: fileSize,
          duration: recordingDuration,
        };
        
        console.log('📤 Enviando archivo de audio:', audioFile);
        onSendVoiceMessage(audioFile);
      } else {
        Alert.alert('Error', 'No se pudo obtener el archivo de audio');
      }
      
      // Limpiar estado
      setRecording(null);
      setRecordingDuration(0);
      setRecordingTime('00:00');
      setWaveformData([]);
      setCanSend(false);
    } catch (error) {
      console.error('Error al enviar grabación:', error);
      Alert.alert('Error', 'No se pudo enviar la nota de voz');
    }
  };

  const handleCancelRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error al cancelar grabación:', error);
      }
    }
    
    setRecording(null);
    setIsRecording(false);
    setRecordingDuration(0);
    setRecordingTime('00:00');
    setWaveformData([]);
    setCanSend(false);
    onCancel();
  };

  const handleGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    slideAnimation.setValue(translationX);
    
    // Si se desliza más de 100px hacia la izquierda, preparar para cancelar
    if (translationX < -100) {
      scaleAnimation.setValue(0.8);
    } else {
      scaleAnimation.setValue(1);
    }
  };

  const handleGestureStateChange = (event: any) => {
    const { state, translationX } = event.nativeEvent;
    
    if (state === State.END) {
      if (translationX < -100) {
        // Cancelar grabación
        handleCancelRecording();
      } else {
        // Volver a posición original
        Animated.spring(slideAnimation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        
        Animated.spring(scaleAnimation, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const renderWaveform = () => {
    return (
      <View style={styles.waveformContainer}>
        {waveformData.map((height, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveformBar,
              {
                height,
                opacity: isRecording ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  if (!isRecording) {
    return (
      <TouchableOpacity
        style={styles.recordButton}
        onPressIn={startRecording}
        activeOpacity={0.8}
      >
        <Ionicons name="mic" size={24} color={Colors.white} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.compactRecordingInterface}>
      {/* Barra de grabación simplificada y accesible */}
      <View style={styles.recordingBarSimple}>
        {/* Tiempo e información */}
        <View style={styles.recordingInfo}>
          <View style={styles.micIcon}>
            <Ionicons name="mic" size={16} color={Colors.danger} />
          </View>
          <Text style={styles.recordingTimeText}>{recordingTime}</Text>
          <View style={styles.miniWaveform}>
            {renderWaveform()}
          </View>
        </View>
        
        {/* Botones de acción grandes y accesibles */}
        <View style={styles.recordingControls}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancelRecording}
          >
            <Ionicons name="trash" size={18} color={Colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            onPress={canSend ? handleSendRecording : undefined}
            disabled={!canSend}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={canSend ? Colors.white : Colors.darkGray} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Indicador de estado */}
      <View style={styles.statusIndicator}>
        <Text style={styles.statusText}>
          {canSend ? '✓ Listo para enviar' : '🎙️ Grabando...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recordButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  
  // Nueva interfaz compacta y accesible
  compactRecordingInterface: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  
  recordingBarSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  micIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  
  recordingTimeText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginRight: Spacing.md,
    fontFamily: 'monospace',
  },
  
  miniWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginRight: Spacing.md,
  },
  
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cancelBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  
  sendBtnDisabled: {
    backgroundColor: Colors.lightGray,
  },
  
  statusIndicator: {
    alignItems: 'center',
  },
  
  statusText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: 60, // Dar espacio al header
    ...BordersAndShadows.shadows.lg,
  },
  
  microphoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  
  compactWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginHorizontal: Spacing.md,
  },
  
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  
  waveformBar: {
    width: 2.5,
    backgroundColor: Colors.primary,
    marginHorizontal: 0.5,
    borderRadius: 1.25,
    minHeight: 8,
  },
  
  timeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.md,
  },
  
  recordingTimeCompact: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontFamily: 'monospace',
  },
  
  cancelButtonCompact: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  instructionContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  
  instructionText: {
    color: Colors.lightGray,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  
  actionArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100, // Dar espacio al teclado
  },
  
  mainRecordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.lg,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  mainRecordButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  sendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  
  sendText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    marginLeft: Spacing.xs,
  },
  
  // Estilos deprecados mantenidos para compatibilidad
  recordingTime: {
    fontSize: Typography.fontSizes.xl,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.lg,
  },
  instructionsText: {
    color: Colors.lightGray,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default VoiceRecorder;
