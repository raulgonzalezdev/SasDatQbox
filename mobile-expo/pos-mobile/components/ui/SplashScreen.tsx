import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/GlobalStyles';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const subtitleOpacityAnim = useRef(new Animated.Value(0)).current;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Secuencia de animaciones
    const startAnimations = () => {
      // Paso 1: Fade in del fondo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(1);
        
        // Paso 2: Logo aparece con escala y rotación
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentStep(2);
          
          // Paso 3: Texto principal
          Animated.parallel([
            Animated.timing(textOpacityAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setCurrentStep(3);
            
            // Paso 4: Subtítulo
            Animated.timing(subtitleOpacityAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              setCurrentStep(4);
              
              // Paso 5: Pulse final y terminar
              Animated.sequence([
                Animated.timing(pulseAnim, {
                  toValue: 1.1,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                // Esperar un poco antes de terminar
                setTimeout(() => {
                  onFinish();
                }, 800);
              });
            });
          });
        });
      });
    };

    // Iniciar animaciones después de un pequeño delay
    const timer = setTimeout(startAnimations, 300);
    return () => clearTimeout(timer);
  }, []);

  const spinValue = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Fondo con gradiente */}
      <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark, '#0a4d8a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Efectos de fondo */}
          <View style={styles.backgroundEffects}>
            {/* Círculos decorativos */}
            <Animated.View 
              style={[
                styles.circle, 
                styles.circle1,
                { 
                  opacity: fadeAnim,
                  transform: [{ rotate: spinValue }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.circle, 
                styles.circle2,
                { 
                  opacity: fadeAnim,
                  transform: [{ rotate: spinValue }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.circle, 
                styles.circle3,
                { 
                  opacity: fadeAnim,
                  transform: [{ rotate: spinValue }]
                }
              ]} 
            />
          </View>

          {/* Contenido principal */}
          <View style={styles.content}>
            {/* Logo principal */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: logoOpacityAnim,
                  transform: [
                    { scale: Animated.multiply(scaleAnim, pulseAnim) },
                    { rotate: spinValue }
                  ],
                },
              ]}
            >
              <View style={styles.logoBackground}>
                <Ionicons 
                  name="medical" 
                  size={80} 
                  color={Colors.white} 
                />
              </View>
              
              {/* Anillo decorativo */}
              <View style={styles.logoRing} />
              <View style={styles.logoRingOuter} />
            </Animated.View>

            {/* Texto principal */}
            <Animated.View
              style={[
                styles.textContainer,
                {
                  opacity: textOpacityAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>DoctorBox</Text>
              <Text style={styles.brandLine}>Medical Excellence</Text>
            </Animated.View>

            {/* Subtítulo */}
            <Animated.View
              style={[
                styles.subtitleContainer,
                {
                  opacity: subtitleOpacityAnim,
                },
              ]}
            >
              <Text style={styles.subtitle}>
                Revolucionando la atención médica digital
              </Text>
              
              {/* Indicador de carga */}
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBar}>
                  <Animated.View 
                    style={[
                      styles.loadingProgress,
                      {
                        width: currentStep >= 1 ? '25%' : 0,
                      }
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.loadingProgress,
                      {
                        width: currentStep >= 2 ? '50%' : 0,
                      }
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.loadingProgress,
                      {
                        width: currentStep >= 3 ? '75%' : 0,
                      }
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.loadingProgress,
                      {
                        width: currentStep >= 4 ? '100%' : 0,
                      }
                    ]} 
                  />
                </View>
                
                <Text style={styles.loadingText}>
                  {currentStep === 0 && 'Iniciando...'}
                  {currentStep === 1 && 'Cargando recursos...'}
                  {currentStep === 2 && 'Configurando interfaz...'}
                  {currentStep === 3 && 'Preparando experiencia...'}
                  {currentStep === 4 && '¡Listo!'}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              { opacity: subtitleOpacityAnim }
            ]}
          >
            <Text style={styles.footerText}>
              © 2024 DatQbox • Tecnología Médica Avanzada
            </Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundEffects: {
    position: 'absolute',
    width: width,
    height: height,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: height * 0.1,
    left: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: height * 0.2,
    right: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: height * 0.3,
    right: width * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl * 2,
    position: 'relative',
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoRingOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: 42,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandLine: {
    fontSize: Typography.fontSizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: Typography.fontWeights.medium,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  loadingProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

export default SplashScreen;
