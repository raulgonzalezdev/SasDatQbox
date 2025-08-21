import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { Conversation } from '@/store/chatStore';
import { useAppStore } from '@/store/appStore';

interface ConversationHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onVideoCall?: () => void;
  onAudioCall?: () => void;
  onPatientInfo?: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onBack,
  onVideoCall,
  onAudioCall,
  onPatientInfo,
}) => {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

  // Obtener el otro participante (no el usuario actual)
  const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
  
  const getConversationTitle = () => {
    if (conversation.title && conversation.title !== 'Conversación médica') {
      return conversation.title;
    }
    
    if (otherParticipant) {
      return `${otherParticipant.first_name} ${otherParticipant.last_name}`;
    }
    
    return 'Conversación médica';
  };

  const getConversationSubtitle = () => {
    if (conversation.type === 'medical_consultation') {
      if (conversation.appointment_date) {
        const date = new Date(conversation.appointment_date);
        return `Cita: ${date.toLocaleDateString('es-ES')}`;
      }
      return 'Consulta médica';
    }
    
    if (conversation.type === 'appointment_discussion') {
      return 'Discusión de cita';
    }
    
    return otherParticipant?.is_online ? 'En línea' : 'Desconectado';
  };

  const getPriorityColor = () => {
    switch (conversation.medical_priority) {
      case 'urgent':
        return Colors.danger;
      case 'high':
        return Colors.warning;
      case 'medium':
        return Colors.info;
      default:
        return Colors.success;
    }
  };

  const handleMoreOptions = () => {
    const options = [
      'Ver información del paciente',
      'Historial médico',
      'Agendar nueva cita',
      'Silenciar conversación',
      'Reportar problema',
      'Cancelar',
    ];

    Alert.alert(
      'Opciones',
      'Selecciona una opción:',
      options.map((option, index) => ({
        text: option,
        style: index === options.length - 1 ? 'cancel' : 'default',
        onPress: () => {
          switch (index) {
            case 0:
              onPatientInfo?.();
              break;
            case 1:
              console.log('📋 Ver historial médico');
              break;
            case 2:
              console.log('📅 Agendar nueva cita');
              break;
            case 3:
              console.log('🔇 Silenciar conversación');
              break;
            case 4:
              console.log('⚠️ Reportar problema');
              break;
            default:
              break;
          }
        },
      }))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Botón de volver */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Información de la conversación */}
        <TouchableOpacity style={styles.conversationInfo} onPress={onPatientInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {otherParticipant?.first_name?.charAt(0) || 'M'}
              </Text>
              {otherParticipant?.is_online && <View style={styles.onlineIndicator} />}
            </View>
          </View>
          
          <View style={styles.textInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {getConversationTitle()}
            </Text>
            <View style={styles.subtitleRow}>
              {conversation.medical_priority && conversation.medical_priority !== 'low' && (
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                  <Text style={styles.priorityText}>
                    {conversation.medical_priority.toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={[styles.subtitle, conversation.medical_priority && { marginLeft: Spacing.sm }]}>
                {getConversationSubtitle()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Botones de acción */}
        <View style={styles.actions}>
          {/* Botón de llamada de audio */}
          <TouchableOpacity style={styles.actionButton} onPress={onAudioCall}>
            <Ionicons name="call" size={20} color={Colors.white} />
          </TouchableOpacity>

          {/* Botón de videollamada */}
          <TouchableOpacity style={styles.actionButton} onPress={onVideoCall}>
            <Ionicons name="videocam" size={20} color={Colors.white} />
          </TouchableOpacity>

          {/* Botón de más opciones */}
          <TouchableOpacity style={styles.actionButton} onPress={handleMoreOptions}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Información adicional para doctores */}
      {isDoctor && conversation.type === 'medical_consultation' && (
        <View style={styles.medicalInfo}>
          <View style={styles.medicalInfoItem}>
            <Ionicons name="person" size={16} color={Colors.primary} />
            <Text style={styles.medicalInfoText}>
              {otherParticipant?.role === 'patient' ? 'Paciente' : 'Colega'}
            </Text>
          </View>
          
          {conversation.appointment_date && (
            <View style={styles.medicalInfoItem}>
              <Ionicons name="calendar" size={16} color={Colors.primary} />
              <Text style={styles.medicalInfoText}>
                {new Date(conversation.appointment_date).toLocaleDateString('es-ES', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}
          
          {conversation.unread_count > 0 && (
            <View style={styles.medicalInfoItem}>
              <Ionicons name="mail-unread" size={16} color={Colors.warning} />
              <Text style={styles.medicalInfoText}>
                {conversation.unread_count} sin leer
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 0,
    ...BordersAndShadows.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 60,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  conversationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  medicalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  medicalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicalInfoText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    marginLeft: Spacing.xs,
    opacity: 0.9,
  },
});

export default ConversationHeader;
