import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { ActiveCall } from '@/store/chatStore';
import { useChatStore } from '@/store/chatStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface AudioCallInterfaceProps {
  call: ActiveCall;
  onEndCall: () => void;
}

const AudioCallInterface: React.FC<AudioCallInterfaceProps> = ({
  call,
  onEndCall,
}) => {
  const { toggleMute, endCall } = useChatStore();
  const [callDuration, setCallDuration] = useState(0);
  const [pulseAnimation] = useState(new Animated.Value(1));

  // Obtener el otro participante
  const otherParticipant = call.participants.find(p => p.id !== call.participants[0]?.id) || call.participants[0];

  useEffect(() => {
    // Timer para la duración de la llamada
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Animación de pulso para el avatar
    const startPulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
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

    startPulseAnimation();

    return () => {
      clearInterval(timer);
      pulseAnimation.stopAnimation();
    };
  }, [pulseAnimation]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'Finalizar llamada',
      '¿Estás seguro de que quieres finalizar la llamada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: () => {
            endCall();
            onEndCall();
          },
        },
      ]
    );
  };

  const getCallStatusText = () => {
    switch (call.status) {
      case 'connecting':
        return 'Conectando...';
      case 'ringing':
        return 'Llamando...';
      case 'connected':
        return 'Llamada activa';
      default:
        return 'Llamada de audio';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Información del participante */}
        <View style={styles.participantInfo}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                transform: [{ scale: pulseAnimation }],
              },
            ]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {otherParticipant?.first_name?.charAt(0) || 'U'}
              </Text>
            </View>
            
            {/* Indicador de sonido */}
            <View style={styles.soundWaves}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.soundWave,
                    {
                      animationDelay: `${index * 0.1}s`,
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          <Text style={styles.participantName}>
            {otherParticipant?.first_name} {otherParticipant?.last_name}
          </Text>
          
          <Text style={styles.participantRole}>
            {otherParticipant?.role === 'doctor' ? 'Doctor' : 'Paciente'}
          </Text>
          
          <Text style={styles.callStatus}>
            {getCallStatusText()}
          </Text>
          
          {call.status === 'connected' && (
            <Text style={styles.callDuration}>
              {formatDuration(callDuration)}
            </Text>
          )}
        </View>

        {/* Indicadores de estado */}
        <View style={styles.statusIndicators}>
          {call.is_muted && (
            <View style={styles.statusIndicator}>
              <Ionicons name="mic-off" size={16} color={Colors.danger} />
              <Text style={styles.statusText}>Silenciado</Text>
            </View>
          )}
          
          <View style={styles.statusIndicator}>
            <Ionicons name="call" size={16} color={Colors.success} />
            <Text style={styles.statusText}>Audio</Text>
          </View>
        </View>

        {/* Controles de la llamada */}
        <View style={styles.controls}>
          {/* Botón de silenciar */}
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.muteButton,
              call.is_muted && styles.controlButtonActive,
            ]}
            onPress={toggleMute}
          >
            <Ionicons
              name={call.is_muted ? 'mic-off' : 'mic'}
              size={28}
              color={Colors.white}
            />
          </TouchableOpacity>

          {/* Botón de finalizar llamada */}
          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={28} color={Colors.white} />
          </TouchableOpacity>

          {/* Botón de altavoz */}
          <TouchableOpacity
            style={[styles.controlButton, styles.speakerButton]}
            onPress={() => {
              // Implementar alternar altavoz
              console.log('🔊 Alternar altavoz');
            }}
          >
            <Ionicons name="volume-high" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Opciones adicionales */}
        <View style={styles.additionalOptions}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              // Cambiar a videollamada
              console.log('📹 Cambiar a video');
            }}
          >
            <Ionicons name="videocam" size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              // Abrir teclado
              console.log('🔢 Abrir teclado');
            }}
          >
            <Ionicons name="keypad" size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Teclado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              // Abrir chat
              console.log('💬 Abrir chat');
            }}
          >
            <Ionicons name="chatbubble" size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              // Agregar participante
              console.log('👥 Agregar participante');
            }}
          >
            <Ionicons name="person-add" size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Información de calidad de la llamada */}
        <View style={styles.qualityInfo}>
          <View style={styles.qualityIndicator}>
            <View style={[styles.qualityBar, styles.qualityBarGood]} />
            <View style={[styles.qualityBar, styles.qualityBarGood]} />
            <View style={[styles.qualityBar, styles.qualityBarGood]} />
            <View style={[styles.qualityBar, styles.qualityBarMedium]} />
            <View style={[styles.qualityBar]} />
          </View>
          <Text style={styles.qualityText}>Buena conexión</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: screenWidth * 0.9,
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    ...BordersAndShadows.shadows.lg,
  },
  participantInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
    ...BordersAndShadows.shadows.md,
  },
  avatarText: {
    fontSize: Typography.fontSizes.xxxl + 10,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  soundWaves: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundWave: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.primary,
    opacity: 0.3,
  },
  participantName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  participantRole: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: Spacing.sm,
  },
  callStatus: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  callDuration: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    marginHorizontal: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  muteButton: {
    backgroundColor: Colors.darkGray,
  },
  controlButtonActive: {
    backgroundColor: Colors.danger,
  },
  endCallButton: {
    backgroundColor: Colors.danger,
    transform: [{ rotate: '135deg' }],
  },
  speakerButton: {
    backgroundColor: Colors.info,
  },
  additionalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.lg,
  },
  optionButton: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  optionText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.dark,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  qualityInfo: {
    alignItems: 'center',
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.xs,
  },
  qualityBar: {
    width: 4,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  qualityBarGood: {
    backgroundColor: Colors.success,
    height: 16,
  },
  qualityBarMedium: {
    backgroundColor: Colors.warning,
    height: 12,
  },
  qualityText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
});

export default AudioCallInterface;
