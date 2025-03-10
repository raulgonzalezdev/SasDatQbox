import React from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomStatusBarProps {
  backgroundColor: string;
  barStyle?: 'light-content' | 'dark-content';
}

export function CustomStatusBar({ 
  backgroundColor, 
  barStyle = 'dark-content' 
}: CustomStatusBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
      {Platform.OS === 'ios' && (
        <View style={[
          styles.statusBarFill, 
          { 
            backgroundColor,
            height: insets.top 
          }
        ]} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  statusBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
}); 