import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HamburgerMenu } from './HamburgerMenu';

interface TabScreenWrapperProps {
  children: React.ReactNode;
}

export const TabScreenWrapper: React.FC<TabScreenWrapperProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
      <HamburgerMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
