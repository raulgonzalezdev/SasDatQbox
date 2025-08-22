import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useUserNotifications, Notification } from '@/store/notificationStore';
import { useAppStore } from '@/store/appStore';
import { router } from 'expo-router';

interface NotificationPanelProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ visible, onClose }) => {
  const { user } = useAppStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useUserNotifications(user?.id || '');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular actualización
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment_submitted':
        return 'card';
      case 'payment_approved':
        return 'checkmark-circle';
      case 'payment_rejected':
        return 'close-circle';
      case 'appointment_confirmed':
        return 'calendar';
      case 'appointment_reminder':
        return 'alarm';
      case 'consultation_started':
        return 'medical';
      case 'prescription_ready':
        return 'document-text';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'payment_approved':
      case 'appointment_confirmed':
        return Colors.success;
      case 'payment_rejected':
        return Colors.danger;
      case 'payment_submitted':
      case 'appointment_reminder':
        return Colors.warning;
      case 'consultation_started':
      case 'prescription_ready':
        return Colors.primary;
      default:
        return Colors.darkGray;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return Colors.danger;
      case 'high':
        return Colors.warning;
      case 'normal':
        return Colors.primary;
      case 'low':
        return Colors.darkGray;
      default:
        return Colors.darkGray;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Marcar como leída
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navegar según el tipo de notificación
    if (notification.related_appointment_id) {
      switch (notification.type) {
        case 'appointment_confirmed':
        case 'appointment_reminder':
        case 'payment_submitted':
        case 'payment_approved':
        case 'payment_rejected':
          onClose();
          router.push('/(drawer)/(tabs)/appointments');
          break;
        case 'consultation_started':
        case 'prescription_ready':
          onClose();
          router.push('/(drawer)/(tabs)/chat');
          break;
        default:
          break;
      }
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.is_read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: getNotificationColor(notification.type) }
          ]}>
            <Ionicons 
              name={getNotificationIcon(notification.type)} 
              size={16} 
              color={Colors.white} 
            />
          </View>
          <View style={styles.headerText}>
            <ThemedText style={[
              styles.notificationTitle,
              !notification.is_read && styles.unreadText
            ]}>
              {notification.title}
            </ThemedText>
            <View style={styles.timeAndPriority}>
              <ThemedText style={styles.timeText}>
                {formatTimeAgo(new Date(notification.created_at))}
              </ThemedText>
              {notification.priority === 'urgent' && (
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(notification.priority) }]}>
                  <ThemedText style={styles.priorityText}>Urgente</ThemedText>
                </View>
              )}
            </View>
          </View>
          {!notification.is_read && (
            <View style={styles.unreadDot} />
          )}
        </View>
        <ThemedText style={[
          styles.notificationMessage,
          !notification.is_read && styles.unreadText
        ]}>
          {notification.message}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.headerTitle}>Notificaciones</ThemedText>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <ThemedText style={styles.unreadBadgeText}>{unreadCount}</ThemedText>
              </View>
            )}
          </View>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                <ThemedText style={styles.markAllText}>Marcar todas</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.dark} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {sortedNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={64} color={Colors.lightGray} />
              <ThemedText style={styles.emptyTitle}>Sin notificaciones</ThemedText>
              <ThemedText style={styles.emptyText}>
                Te notificaremos sobre el estado de tus pagos y citas médicas
              </ThemedText>
            </View>
          ) : (
            sortedNotifications.map(renderNotification)
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    backgroundColor: Colors.danger,
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold as any,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    marginRight: Spacing.md,
  },
  markAllText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium as any,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
    padding: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  timeAndPriority: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginRight: Spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold as any,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  notificationMessage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    lineHeight: 20,
  },
  unreadText: {
    fontWeight: Typography.fontWeights.medium as any,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationPanel;
