import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants/GlobalStyles';
import { ActiveCall } from '@/store/chatStore';
import { useChatStore } from '@/store/chatStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoCallInterfaceProps {
  call: ActiveCall;
  onEndCall: () => void;
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  call,
  onEndCall,
}) => {
  const { toggleMute, toggleVideo, toggleScreenShare, endCall } = useChatStore();
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Simular otros participantes
  const otherParticipant = call.participants.find(p => p.id !== call.participants[0]?.id) || call.participants[0];

  useEffect(() => {
    // Timer para la duración de la llamada
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Auto-ocultar controles después de 5 segundos
    const controlsTimer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(controlsTimer);
    };
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'Finalizar llamada',
      '¿Estás seguro de que quieres finalizar la videollamada?',
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

  const toggleControlsVisibility = () => {
    setShowControls(!showControls);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Video principal (remoto) */}
      <TouchableOpacity 
        style={styles.mainVideoContainer}
        activeOpacity={1}
        onPress={toggleControlsVisibility}
      >
        <View style={styles.remoteVideo}>
          {/* Simulación de video remoto */}
          <View style={styles.videoPlaceholder}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantAvatarText}>
                {otherParticipant?.first_name?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text style={styles.participantName}>
              {otherParticipant?.first_name} {otherParticipant?.last_name}
            </Text>
            {call.status === 'connecting' && (
              <Text style={styles.connectionStatus}>Conectando...</Text>
            )}
          </View>
        </View>
        
        {/* Video local (usuario) */}
        <View style={[styles.localVideo, !call.is_video_enabled && styles.localVideoDisabled]}>
          {call.is_video_enabled ? (
            <View style={styles.localVideoPlaceholder}>
              <Text style={styles.localVideoText}>Tú</Text>
            </View>
          ) : (
            <View style={styles.videoDisabledContainer}>
              <Ionicons name="videocam-off" size={24} color={Colors.white} />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Información de la llamada */}
      {showControls && (
        <View style={styles.callInfo}>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
          <Text style={styles.callStatus}>
            {call.status === 'connected' ? 'Videollamada activa' : 'Conectando...'}
          </Text>
        </View>
      )}

      {/* Controles de la llamada */}
      {showControls && (
        <View style={styles.controls}>
          <View style={styles.controlsRow}>
            {/* Alternar micrófono */}
            <TouchableOpacity
              style={[styles.controlButton, call.is_muted && styles.controlButtonActive]}
              onPress={toggleMute}
            >
              <Ionicons
                name={call.is_muted ? 'mic-off' : 'mic'}
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* Alternar video */}
            <TouchableOpacity
              style={[styles.controlButton, !call.is_video_enabled && styles.controlButtonActive]}
              onPress={toggleVideo}
            >
              <Ionicons
                name={call.is_video_enabled ? 'videocam' : 'videocam-off'}
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* Cambiar cámara */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                // Implementar cambio de cámara
                console.log('🔄 Cambiar cámara');
              }}
            >
              <Ionicons name="camera-reverse" size={24} color={Colors.white} />
            </TouchableOpacity>

            {/* Compartir pantalla */}
            <TouchableOpacity
              style={[styles.controlButton, call.is_screen_sharing && styles.controlButtonActive]}
              onPress={toggleScreenShare}
            >
              <Ionicons
                name={call.is_screen_sharing ? 'stop-circle' : 'desktop'}
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* Finalizar llamada */}
            <TouchableOpacity
              style={[styles.controlButton, styles.endCallButton]}
              onPress={handleEndCall}
            >
              <Ionicons name="call" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Controles secundarios */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                // Abrir chat durante la llamada
                console.log('💬 Abrir chat');
              }}
            >
              <Ionicons name="chatbubble" size={20} color={Colors.white} />
              <Text style={styles.secondaryButtonText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                // Agregar participante
                console.log('👥 Agregar participante');
              }}
            >
              <Ionicons name="person-add" size={20} color={Colors.white} />
              <Text style={styles.secondaryButtonText}>Agregar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                // Configuraciones
                console.log('⚙️ Configuraciones');
              }}
            >
              <Ionicons name="settings" size={20} color={Colors.white} />
              <Text style={styles.secondaryButtonText}>Config</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Indicadores de estado */}
      {call.is_muted && (
        <View style={styles.muteIndicator}>
          <Ionicons name="mic-off" size={16} color={Colors.danger} />
          <Text style={styles.muteText}>Micrófono silenciado</Text>
        </View>
      )}

      {call.is_screen_sharing && (
        <View style={styles.screenShareIndicator}>
          <Ionicons name="desktop" size={16} color={Colors.info} />
          <Text style={styles.screenShareText}>Compartiendo pantalla</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  mainVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
  },
  participantAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  participantAvatarText: {
    fontSize: Typography.fontSizes.xxxl,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  participantName: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.white,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: Spacing.sm,
  },
  connectionStatus: {
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  localVideoDisabled: {
    backgroundColor: Colors.darkGray,
  },
  localVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  localVideoText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  videoDisabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    alignItems: 'flex-start',
  },
  callDuration: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  callStatus: {
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  controlButtonActive: {
    backgroundColor: Colors.danger,
  },
  endCallButton: {
    backgroundColor: Colors.danger,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  muteIndicator: {
    position: 'absolute',
    top: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.9)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  muteText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
  screenShareIndicator: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 110, 253, 0.9)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  screenShareText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
});

export default VideoCallInterface;
