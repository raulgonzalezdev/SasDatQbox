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
import { Colors, Spacing, Typography } from '@/constants/GlobalStyles';

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
      await stopRecording();
      const uri = recording.getURI();
      
      if (uri) {
        const audioFile = {
          uri,
          name: `voice_message_${Date.now()}.m4a`,
          type: 'audio',
          mimeType: 'audio/m4a',
          size: 0,
          duration: recordingDuration,
        };
        
        onSendVoiceMessage(audioFile);
      }
      
      // Limpiar estado
      setRecording(null);
      setRecordingDuration(0);
      setRecordingTime('00:00');
      setWaveformData([]);
      setCanSend(false);
    } catch (error) {
      console.error('Error al enviar grabación:', error);
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
    <View style={styles.recordingContainer}>
      {/* Indicador de deslizar para cancelar */}
      <View style={styles.slideIndicator}>
        <Ionicons name="chevron-back" size={16} color={Colors.darkGray} />
        <Text style={styles.slideText}>Desliza para cancelar</Text>
      </View>

      {/* Área de grabación */}
      <View style={styles.recordingContent}>
        {/* Tiempo de grabación */}
        <Text style={styles.recordingTime}>{recordingTime}</Text>
        
        {/* Forma de onda */}
        {renderWaveform()}
        
        {/* Controles de grabación */}
        <View style={styles.recordingControls}>
          {/* Botón de cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRecording}
          >
            <Ionicons name="close" size={24} color={Colors.danger} />
          </TouchableOpacity>
          
          {/* Botón de grabación (con gesto de deslizar) */}
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleGestureStateChange}
          >
            <Animated.View
              style={[
                styles.recordingButton,
                {
                  transform: [
                    { translateX: slideAnimation },
                    { scale: Animated.multiply(scaleAnimation, pulseAnimation) },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.recordingButtonInner}
                onPress={canSend ? handleSendRecording : undefined}
                disabled={!canSend}
              >
                <Ionicons
                  name={canSend ? "send" : "mic"}
                  size={24}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
          
          {/* Botón de enviar (alternativo para cuando se puede enviar) */}
          {canSend && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendRecording}
            >
              <Ionicons name="send" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Instrucciones */}
      <Text style={styles.instructionsText}>
        {canSend ? 'Toca para enviar' : 'Mantén presionado para grabar'}
      </Text>
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
  recordingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  slideIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  slideText: {
    color: Colors.darkGray,
    fontSize: Typography.fontSizes.sm,
    marginLeft: Spacing.xs,
  },
  recordingContent: {
    alignItems: 'center',
    width: '100%',
  },
  recordingTime: {
    fontSize: Typography.fontSizes.xl,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.lg,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  waveformBar: {
    width: 3,
    backgroundColor: Colors.primary,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 200,
  },
  cancelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsText: {
    color: Colors.lightGray,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default VoiceRecorder;
