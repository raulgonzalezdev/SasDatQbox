import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { TabScreenWrapper } from '@/components/ui/TabScreenWrapper';

export default function ChatScreen() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';
  const [searchQuery, setSearchQuery] = useState('');

  // Datos simulados de conversaciones
  const conversations = [
    {
      id: '1',
      name: 'María González',
      lastMessage: 'Hola doctor, tengo una pregunta sobre mi medicación',
      timestamp: '09:30',
      unreadCount: 2,
      avatar: 'MG',
      isOnline: true,
      type: 'patient',
    },
    {
      id: '2',
      name: 'Dr. Carlos Rodríguez',
      lastMessage: 'Perfecto, te envío la receta actualizada',
      timestamp: 'Ayer',
      unreadCount: 0,
      avatar: 'CR',
      isOnline: false,
      type: 'doctor',
    },
    {
      id: '3',
      name: 'Juan Pérez',
      lastMessage: '¿Cuándo puedo agendar mi próxima cita?',
      timestamp: '10:15',
      unreadCount: 1,
      avatar: 'JP',
      isOnline: true,
      type: 'patient',
    },
    {
      id: '4',
      name: 'Soporte Técnico',
      lastMessage: 'Hemos resuelto el problema con tu cuenta',
      timestamp: 'Lun',
      unreadCount: 0,
      avatar: 'ST',
      isOnline: true,
      type: 'support',
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvatarColor = (type: string) => {
    switch (type) {
      case 'doctor':
        return Colors.secondary;
      case 'patient':
        return Colors.primary;
      case 'support':
        return Colors.info;
      default:
        return Colors.darkGray;
    }
  };

  return (
    <TabScreenWrapper>
      <SafeAreaView style={CommonStyles.safeArea}>
        <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
        
        <ThemedView style={CommonStyles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <ThemedText style={styles.headerTitle}>Chat</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                {isDoctor ? 'Conversaciones con pacientes' : 'Conversaciones con doctores'}
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={() => router.push('/new-chat')}
            >
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
            {/* Barra de búsqueda */}
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar conversaciones..."
                  placeholderTextColor={Colors.darkGray}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={Colors.darkGray} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Estadísticas rápidas */}
            <View style={styles.statsSection}>
              <View style={styles.statCard}>
                <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
                <ThemedText style={styles.statNumber}>{conversations.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Conversaciones</ThemedText>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="mail-unread" size={24} color={Colors.warning} />
                <ThemedText style={styles.statNumber}>
                  {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Mensajes Nuevos</ThemedText>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="radio-button-on" size={24} color={Colors.success} />
                <ThemedText style={styles.statNumber}>
                  {conversations.filter(conv => conv.isOnline).length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>En Línea</ThemedText>
              </View>
            </View>

            {/* Lista de conversaciones */}
            <View style={styles.conversationsSection}>
              <ThemedText style={styles.sectionTitle}>Conversaciones Recientes</ThemedText>
              
              {filteredConversations.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="chatbubbles-outline" size={64} color={Colors.darkGray} />
                  <ThemedText style={styles.emptyTitle}>
                    {searchQuery ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
                  </ThemedText>
                  <ThemedText style={styles.emptySubtitle}>
                    {searchQuery 
                      ? 'Intenta con otros términos de búsqueda'
                      : isDoctor 
                        ? 'Los pacientes podrán iniciar conversaciones contigo'
                        : 'Inicia una conversación con tu doctor'
                    }
                  </ThemedText>
                  {!searchQuery && (
                    <TouchableOpacity 
                      style={styles.emptyButton}
                      onPress={() => router.push('/new-chat')}
                    >
                      <ThemedText style={styles.emptyButtonText}>
                        {isDoctor ? 'Ver Pacientes' : 'Nueva Conversación'}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                filteredConversations.map((conversation) => (
                  <TouchableOpacity
                    key={conversation.id}
                    style={styles.conversationCard}
                    onPress={() => router.push(`/chat/${conversation.id}`)}
                  >
                    <View style={styles.conversationHeader}>
                      <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: conversation.avatarColor }]}>
                          <ThemedText style={styles.avatarText}>
                            {conversation.name.charAt(0).toUpperCase()}
                          </ThemedText>
                        </View>
                        {conversation.isOnline && <View style={styles.onlineIndicator} />}
                      </View>
                      <View style={styles.conversationInfo}>
                        <View style={styles.conversationHeaderRow}>
                          <ThemedText style={styles.conversationName}>{conversation.name}</ThemedText>
                          <ThemedText style={styles.conversationTime}>{conversation.lastMessageTime}</ThemedText>
                        </View>
                        <View style={styles.conversationSubheader}>
                          <ThemedText style={styles.conversationType}>{conversation.type}</ThemedText>
                          {conversation.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                              <ThemedText style={styles.unreadCount}>{conversation.unreadCount}</ThemedText>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.conversationContent}>
                      <ThemedText style={styles.lastMessage} numberOfLines={2}>
                        {conversation.lastMessage}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.conversationActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="call" size={20} color={Colors.info} />
                        <ThemedText style={styles.actionText}>Llamar</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="videocam" size={20} color={Colors.success} />
                        <ThemedText style={styles.actionText}>Video</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color={Colors.darkGray} />
                        <ThemedText style={styles.actionText}>Más</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    marginBottom: Spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...BordersAndShadows.shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  conversationsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
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
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  conversationAvatar: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  conversationName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  conversationTime: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginRight: Spacing.sm,
  },
  unreadMessage: {
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
  },
  unreadBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  unreadCount: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  quickActionsSection: {
    marginBottom: Spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
    textAlign: 'center',
  },
});
