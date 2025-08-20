import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

export default function ChatScreen() {
  const { user } = useAppStore();

  // Datos simulados de conversaciones
  const conversations = [
    {
      id: '1',
      name: 'Dr. María González',
      lastMessage: 'Hola, ¿cómo te sientes hoy?',
      timestamp: '10:30',
      unreadCount: 2,
      avatar: 'MG',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Dr. Juan Pérez',
      lastMessage: 'Te envío los resultados del análisis',
      timestamp: '09:15',
      unreadCount: 0,
      avatar: 'JP',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Soporte Técnico',
      lastMessage: 'Tu consulta ha sido resuelta',
      timestamp: 'Ayer',
      unreadCount: 1,
      avatar: 'ST',
      isOnline: true,
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    if (timestamp === 'Ayer') return timestamp;
    return timestamp;
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <ThemedText style={styles.headerTitle}>Chat</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Comunícate con tu equipo médico
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={() => router.push('/(drawer)/more/chat')}
            >
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
              <ThemedText style={styles.statNumber}>{conversations.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Conversaciones</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="mail-unread" size={24} color={Colors.warning} />
              <ThemedText style={styles.statNumber}>
                {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Mensajes Sin Leer</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color={Colors.success} />
              <ThemedText style={styles.statNumber}>
                {conversations.filter(conv => conv.isOnline).length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>En Línea</ThemedText>
            </View>
          </View>

          {/* Lista de conversaciones */}
          <View style={styles.conversationsSection}>
            <ThemedText style={styles.sectionTitle}>Conversaciones Recientes</ThemedText>
            
            {conversations.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={64} color={Colors.darkGray} />
                <ThemedText style={styles.emptyTitle}>No hay conversaciones</ThemedText>
                <ThemedText style={styles.emptySubtitle}>
                  Inicia una conversación con tu equipo médico
                </ThemedText>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => router.push('/(drawer)/more/chat')}
                >
                  <ThemedText style={styles.emptyButtonText}>
                    Nuevo Chat
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={styles.conversationCard}
                  onPress={() => router.push(`/chat/${conversation.id}`)}
                >
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <ThemedText style={styles.avatarText}>{conversation.avatar}</ThemedText>
                    </View>
                    {conversation.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <ThemedText style={styles.conversationName}>{conversation.name}</ThemedText>
                      <ThemedText style={styles.timestamp}>
                        {formatTimestamp(conversation.timestamp)}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.conversationFooter}>
                      <ThemedText style={styles.lastMessage} numberOfLines={1}>
                        {conversation.lastMessage}
                      </ThemedText>
                      {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <ThemedText style={styles.unreadCount}>
                            {conversation.unreadCount}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.conversationActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="call" size={20} color={Colors.info} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="videocam" size={20} color={Colors.secondary} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Acciones rápidas */}
          <View style={styles.quickActionsSection}>
            <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: Colors.primary }]}>
                  <Ionicons name="medical" size={24} color={Colors.white} />
                </View>
                <ThemedText style={styles.quickActionTitle}>Consulta Médica</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: Colors.secondary }]}>
                  <Ionicons name="help-circle" size={24} color={Colors.white} />
                </View>
                <ThemedText style={styles.quickActionTitle}>Soporte</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
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
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
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
    paddingHorizontal: Spacing.lg,
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
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
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
  timestamp: {
    fontSize: Typography.fontSizes.sm,
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
  unreadBadge: {
    backgroundColor: Colors.warning,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  conversationActions: {
    marginLeft: Spacing.md,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionsSection: {
    marginBottom: Spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    textAlign: 'center',
  },
});
