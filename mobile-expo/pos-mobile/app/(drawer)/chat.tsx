import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

export default function DrawerChatScreen() {
  // This drawer chat screen redirects to the main chat tab
  React.useEffect(() => {
    router.replace('/(drawer)/(tabs)/chat');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Redirecting to chat...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
