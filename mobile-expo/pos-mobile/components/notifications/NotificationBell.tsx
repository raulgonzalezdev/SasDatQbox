import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/GlobalStyles';
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name="notifications" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold as any,
    textAlign: 'center',
  },
});

export default NotificationBell;
