import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { ChatMessage, MediaFile } from '@/store/chatStore';

const { width: screenWidth } = Dimensions.get('window');

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showTimestamp: boolean;
  onMediaPress?: (media: MediaFile) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showTimestamp,
  onMediaPress,
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
        return <Text style={styles.messageText}>{message.content}</Text>;
      
      case 'voice':
        return (
          <View style={styles.voiceMessage}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.voiceWaveform}>
              {/* Simulación de forma de onda */}
              {Array.from({ length: 12 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: Math.random() * 20 + 10 }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.voiceDuration}>0:30</Text>
          </View>
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
              <Text style={styles.imageCaption}>{message.content}</Text>
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
        return <Text style={styles.messageText}>{message.content}</Text>;
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
        
        <View style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
          message.message_type === 'prescription' && styles.prescriptionBubble,
        ]}>
          {!isOwnMessage && (
            <Text style={styles.senderName}>
              {message.sender.first_name} {message.sender.last_name}
            </Text>
          )}
          
          {renderMessageContent()}
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timeText,
              isOwnMessage ? styles.ownTimeText : styles.otherTimeText
            ]}>
              {formatTime(message.created_at)}
            </Text>
            
            {isOwnMessage && (
              <Ionicons
                name={message.read_at ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={message.read_at ? Colors.primary : Colors.darkGray}
                style={styles.readStatus}
              />
            )}
          </View>
        </View>
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
    color: Colors.white,
    lineHeight: 20,
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
  
  // Voice message styles
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  voiceWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    marginRight: Spacing.sm,
  },
  waveBar: {
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1,
  },
  voiceDuration: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
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

export default MessageBubble;
