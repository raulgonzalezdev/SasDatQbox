import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BordersAndShadows, CommonStyles } from '@/constants/GlobalStyles';
import { useUserNotifications } from '@/store/notificationStore';
import { useAppStore } from '@/store/appStore';

interface NotificationBellProps {
  onPress: () => void;
  size?: number;
  color?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  onPress, 
  size = 24, 
  color = Colors.white 
}) => {
  const { user } = useAppStore();
  const { unreadCount } = useUserNotifications(user?.id || '');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
        <Ionicons 
          name={unreadCount > 0 ? "notifications" : "notifications-outline"} 
          size={size} 
          color={color} 
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BordersAndShadows.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.xs,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.danger,
    borderRadius: BordersAndShadows.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...BordersAndShadows.shadows.sm,
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xs,
  },
});

export default NotificationBell;
