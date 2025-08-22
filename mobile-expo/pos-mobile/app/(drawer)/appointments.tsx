import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

export default function DrawerAppointmentsScreen() {
  // This drawer appointments screen redirects to the main appointments tab
  React.useEffect(() => {
    router.replace('/(drawer)/(tabs)/appointments');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Redirecting to appointments...</Text>
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
