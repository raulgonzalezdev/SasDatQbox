import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image, Alert } from 'react-native';
import { ThemedText } from '../ThemedText';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function SplashScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const progressWidth = Dimensions.get('window').width * 0.7; // 70% del ancho de la pantalla

  useEffect(() => {
    // Animación de entrada del logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de la barra de progreso
    Animated.timing(progressAnim, {
      toValue: progressWidth,
      duration: 2000, // Duración de la animación
      useNativeDriver: false,
    }).start();

    // Navegar a la pantalla de login después de 2.5 segundos
    const timer = setTimeout(() => {
      try {
        router.replace('/auth/login');
      } catch (error) {
        console.error('Error al navegar a la pantalla de login:', error);
        // Si falla, intentar navegar directamente a la pantalla principal
        try {
          router.replace('/(tabs)');
        } catch (innerError) {
          console.error('Error al navegar a la pantalla principal:', innerError);
          Alert.alert('Error', 'No se pudo iniciar la aplicación');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, progressAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Ionicons name="restaurant" size={80} color="#333333" />
        </View>
        <ThemedText style={styles.title}>Varas Grill</ThemedText>
        <ThemedText style={styles.subtitle}>Tu punto de venta móvil</ThemedText>
        
        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim,
              }
            ]} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 30,
  },
  progressContainer: {
    width: Dimensions.get('window').width * 0.7,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
}); 