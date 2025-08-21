import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { useChatStore, ChatMessage, Conversation, ActiveCall } from '@/store/chatStore';
import { useAppStore } from '@/store/appStore';
import MessageBubble from './MessageBubble';
import VideoCallInterface from './VideoCallInterface';
import AudioCallInterface from './AudioCallInterface';
import MessageComposer from './MessageComposer';
import ConversationHeader from './ConversationHeader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MedicalChatInterfaceProps {
  conversationId: string;
  onBack?: () => void;
}

const MedicalChatInterface: React.FC<MedicalChatInterfaceProps> = ({
  conversationId,
  onBack,
}) => {
  const { user } = useAppStore();
  const {
    activeConversation,
    messages,
    activeCall,
    incomingCall,
    isTyping,
    drafts,
    setActiveConversation,
    addMessage,
    markMessagesAsRead,
    startCall,
    saveDraft,
    clearDraft,
  } = useChatStore();

  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Obtener conversación y mensajes
  const conversationMessages = messages[conversationId] || [];
  const conversation = activeConversation;

  useEffect(() => {
    // Marcar mensajes como leídos cuando se abre la conversación
    if (conversationId) {
      markMessagesAsRead(conversationId);
    }
  }, [conversationId, markMessagesAsRead]);

  useEffect(() => {
    // Auto-scroll al último mensaje
    if (conversationMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversationMessages.length]);

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' | 'voice' = 'text', files?: any[]) => {
    if (!content.trim() && !files?.length) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      conversation_id: conversationId,
      sender_id: user?.id || '',
      sender: {
        id: user?.id || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        role: user?.role || 'patient',
        is_online: true,
      },
      content: content.trim(),
      message_type: type,
      media_files: files?.map(file => ({
        id: `file_${Date.now()}`,
        name: file.name,
        url: file.uri,
        type: file.type,
        size: file.size,
        mime_type: file.mimeType,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addMessage(newMessage);
    clearDraft(conversationId);
    
    // Simular envío al backend aquí
    console.log('📤 Enviando mensaje:', newMessage);
  };

  const handleStartVideoCall = () => {
    Alert.alert(
      'Videollamada',
      '¿Deseas iniciar una videollamada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: () => {
            startCall(conversationId, 'video');
            setShowCallModal(true);
          },
        },
      ]
    );
  };

  const handleStartAudioCall = () => {
    Alert.alert(
      'Llamada de Audio',
      '¿Deseas iniciar una llamada de audio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: () => {
            startCall(conversationId, 'audio');
            setShowCallModal(true);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isOwnMessage = item.sender_id === user?.id;
    const showTimestamp = index === 0 || 
      new Date(item.created_at).getTime() - new Date(conversationMessages[index - 1]?.created_at).getTime() > 5 * 60 * 1000;

    return (
      <MessageBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showTimestamp={showTimestamp}
        onMediaPress={(media) => {
          // Abrir media en pantalla completa
          console.log('📱 Abrir media:', media);
        }}
      />
    );
  };

  const renderTypingIndicator = () => {
    const typingUsers = isTyping[conversationId] || [];
    const otherTypingUsers = typingUsers.filter(userId => userId !== user?.id);
    
    if (otherTypingUsers.length === 0) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
        <Text style={styles.typingText}>
          {otherTypingUsers.length === 1 ? 'Escribiendo...' : `${otherTypingUsers.length} escribiendo...`}
        </Text>
      </View>
    );
  };

  // Debug: Mostrar estado actual
  console.log('🔍 MedicalChatInterface - Debug:', {
    conversationId,
    activeConversation,
    conversationExists: !!conversation,
    messagesCount: conversationMessages.length,
  });

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={Colors.darkGray} />
          <Text style={styles.emptyTitle}>Conversación no encontrada</Text>
          <Text style={styles.emptySubtitle}>
            No se pudo cargar la conversación solicitada. ID: {conversationId}
          </Text>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              console.log('🔍 Estado completo del store:', {
                conversations: useChatStore.getState().conversations,
                activeConversation: useChatStore.getState().activeConversation,
                messages: useChatStore.getState().messages,
              });
            }}
          >
            <Text style={styles.debugButtonText}>Debug Store (Ver consola)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header de la conversación */}
      <ConversationHeader
        conversation={conversation}
        onBack={onBack}
        onVideoCall={handleStartVideoCall}
        onAudioCall={handleStartAudioCall}
        onPatientInfo={() => {
          // Navegar a información del paciente
          console.log('👤 Ver información del paciente');
        }}
      />

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={conversationMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Compositor de mensajes */}
      <MessageComposer
        conversationId={conversationId}
        onSendMessage={handleSendMessage}
        onFocusChange={setIsComposerFocused}
        draft={drafts[conversationId] || ''}
        onDraftChange={(content) => saveDraft(conversationId, content)}
        isTyping={isTyping[conversationId]?.includes(user?.id || '') || false}
      />

      {/* Interfaz de videollamada */}
      {activeCall && activeCall.type === 'video' && (
        <Modal
          visible={showCallModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <VideoCallInterface
            call={activeCall}
            onEndCall={() => setShowCallModal(false)}
          />
        </Modal>
      )}

      {/* Interfaz de llamada de audio */}
      {activeCall && activeCall.type === 'audio' && (
        <Modal
          visible={showCallModal}
          animationType="slide"
          presentationStyle="overFullScreen"
          transparent
        >
          <AudioCallInterface
            call={activeCall}
            onEndCall={() => setShowCallModal(false)}
          />
        </Modal>
      )}

      {/* Llamada entrante */}
      {incomingCall && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="overFullScreen"
          transparent
        >
          <View style={styles.incomingCallOverlay}>
            <View style={styles.incomingCallContainer}>
              <Text style={styles.incomingCallTitle}>
                {incomingCall.type === 'video' ? 'Videollamada entrante' : 'Llamada entrante'}
              </Text>
              <Text style={styles.incomingCallSubtitle}>
                {incomingCall.participants.find(p => p.id !== user?.id)?.first_name || 'Usuario'}
              </Text>
              
              <View style={styles.incomingCallActions}>
                <TouchableOpacity
                  style={[styles.callButton, styles.declineButton]}
                  onPress={() => {
                    // Rechazar llamada
                    console.log('📞 Llamada rechazada');
                  }}
                >
                  <Ionicons name="call" size={30} color={Colors.white} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.callButton, styles.acceptButton]}
                  onPress={() => {
                    // Aceptar llamada
                    setShowCallModal(true);
                    console.log('📞 Llamada aceptada');
                  }}
                >
                  <Ionicons name="call" size={30} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: Spacing.md,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  typingBubble: {
    backgroundColor: Colors.lightGray,
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.darkGray,
    marginHorizontal: 1,
  },
  dot1: {
    // Animación de typing dots se implementaría aquí
  },
  dot2: {},
  dot3: {},
  typingText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  incomingCallOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomingCallContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    margin: Spacing.xl,
    minWidth: screenWidth * 0.8,
  },
  incomingCallTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  incomingCallSubtitle: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.darkGray,
    marginBottom: Spacing.xl,
  },
  incomingCallActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  callButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  declineButton: {
    backgroundColor: Colors.danger,
  },
  debugButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.lg,
  },
  debugButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
  },
});

export default MedicalChatInterface;
