import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { login, UserLoginData } from '@/services/auth';
import { ApiError } from '@/services/api';
import ConnectionTest from '@/components/ui/ConnectionTest';
import SupabaseDiagnostic from '@/components/ui/SupabaseDiagnostic';
import SupabaseInfo from '@/components/ui/SupabaseInfo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [showSupabaseDiagnostic, setShowSupabaseDiagnostic] = useState(false);

  const { setUser, setAuthenticated, setHidePromotions } = useAppStore();

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      console.log('Intentando iniciar sesión con:', { email });
      
      // Datos de inicio de sesión
      const loginData: UserLoginData = {
        email,
        password
      };

      // Intentar iniciar sesión directamente con Supabase
      console.log('Usando autenticación directa con Supabase');
      const response = await login(loginData);
      console.log('Respuesta de login:', response);

      // Si llegamos aquí, el inicio de sesión fue exitoso
      // Guardar el usuario en el store
      const user = {
        id: response.user.id,
        name: response.user.first_name + ' ' + response.user.last_name,
        email: response.user.email,
        role: 'Propietario', // Esto debería venir del perfil del usuario
        businessName: 'Varas Grill', // Esto debería venir del perfil del usuario
        isPremium: true, // Esto debería determinarse según la suscripción
      };

      setUser(user);
      setAuthenticated(true);
      
      // Si el usuario es premium, ocultar las promociones
      if (user.isPremium) {
        setHidePromotions(true);
      }

      // Navegar a la pantalla principal
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Si hay un error, mostrar un mensaje
      if (error instanceof ApiError) {
        Alert.alert('Error de autenticación', error.message);
      } else if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          Alert.alert(
            'Error de conexión', 
            'No se pudo conectar con Supabase. Verifica tu conexión a internet.'
          );
        } else if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Error de autenticación', 'Credenciales incorrectas. Verifica tu email y contraseña.');
        } else {
          Alert.alert('Error', `Ocurrió un error al iniciar sesión: ${error.message}`);
        }
      } else {
        Alert.alert('Error', 'Ocurrió un error desconocido al iniciar sesión. Inténtalo de nuevo.');
      }

      // Para propósitos de demostración, permitimos el inicio de sesión con cuentas de prueba
      if (email.includes('@free.com') || email.includes('@premium.com') || email.includes('@business.com')) {
        console.log('Usando cuenta de demostración:', email);
        
        // Simular diferentes tipos de usuarios según el correo electrónico
        const isPremium = email.includes('@premium.com') || email.includes('@business.com');

        // Crear un usuario simulado
        const user = {
          id: Math.random().toString(36).substring(2, 9),
          name: 'Usuario Demo',
          email,
          role: 'Propietario',
          businessName: 'Varas Grill',
          isPremium: isPremium,
        };

        // Guardar el usuario en el store
        setUser(user);
        setAuthenticated(true);
        
        // Si el usuario es premium, ocultar las promociones
        if (isPremium) {
          setHidePromotions(true);
        }

        // Navegar a la pantalla principal
        router.replace('/(tabs)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (type: 'free' | 'premium') => {
    const demoEmail = type === 'premium' ? 'demo@premium.com' : 'demo@free.com';
    setEmail(demoEmail);
    setPassword('123456');
    
    // Iniciar sesión automáticamente después de un breve retraso
    setTimeout(() => {
      handleLogin();
    }, 500);
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Iniciar Sesión</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ThemedView style={CommonStyles.container}>
        <ScrollView 
          style={CommonStyles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="restaurant" size={60} color={Colors.white} />
            </View>
            <ThemedText style={styles.appName}>DatqboxPos</ThemedText>
            <ThemedText style={styles.appSlogan}>Tu punto de venta móvil</ThemedText>
          </View>

          <SupabaseInfo showDetails={false} />

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={Colors.darkGray} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <ThemedText style={styles.loginButtonText}>Iniciar Sesión</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <ThemedText style={styles.registerText}>¿No tienes una cuenta?</ThemedText>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <ThemedText style={styles.registerLink}>Regístrate</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <ThemedText style={styles.skipButtonText}>Continuar como invitado</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.demoAccountContainer}>
              <ThemedText style={styles.demoAccountTitle}>Cuentas de demostración:</ThemedText>
              
              <View style={styles.demoButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.demoButton, styles.demoFreeButton]} 
                  onPress={() => handleDemoLogin('free')}
                >
                  <ThemedText style={styles.demoButtonText}>Demo Gratis</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.demoButton, styles.demoPremiumButton]} 
                  onPress={() => handleDemoLogin('premium')}
                >
                  <ThemedText style={styles.demoButtonText}>Demo Premium</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.diagnosticContainer}>
              <ThemedText style={styles.diagnosticTitle}>Herramientas de diagnóstico:</ThemedText>
              
              <View style={styles.diagnosticButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.diagnosticButton, styles.apiTestButton]} 
                  onPress={() => setShowConnectionTest(true)}
                >
                  <Ionicons name="server-outline" size={16} color={Colors.white} style={styles.buttonIcon} />
                  <ThemedText style={styles.diagnosticButtonText}>Probar API</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.diagnosticButton, styles.supabaseTestButton]} 
                  onPress={() => setShowSupabaseDiagnostic(true)}
                >
                  <Ionicons name="construct-outline" size={16} color={Colors.white} style={styles.buttonIcon} />
                  <ThemedText style={styles.diagnosticButtonText}>Diagnóstico Supabase</ThemedText>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.fullDiagnosticLink}
                onPress={() => router.push('/diagnostico')}
              >
                <ThemedText style={styles.fullDiagnosticText}>
                  <Ionicons name="medkit-outline" size={14} color="#0066CC" /> Ir a pantalla de diagnóstico completo
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
      
      {/* Componente de prueba de conexión */}
      <ConnectionTest 
        visible={showConnectionTest} 
        onClose={() => setShowConnectionTest(false)} 
      />
      
      {/* Componente de diagnóstico de Supabase */}
      <SupabaseDiagnostic 
        visible={showSupabaseDiagnostic} 
        onClose={() => setShowSupabaseDiagnostic(false)} 
      />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xxxl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  appSlogan: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  inputIcon: {
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  eyeIcon: {
    paddingHorizontal: Spacing.md,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.secondary,
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  registerText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginRight: Spacing.xs,
  },
  registerLink: {
    fontSize: Typography.fontSizes.md,
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.bold,
  },
  skipButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textDecorationLine: 'underline',
  },
  demoAccountContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.md,
  },
  demoAccountTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  demoButton: {
    flex: 1,
    borderRadius: BordersAndShadows.borderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
  },
  demoFreeButton: {
    backgroundColor: Colors.secondary,
  },
  demoPremiumButton: {
    backgroundColor: Colors.primary,
  },
  demoButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Estilos para las herramientas de diagnóstico
  diagnosticContainer: {
    marginTop: 20,
    width: '100%',
  },
  diagnosticTitle: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 10,
    textAlign: 'center',
  },
  diagnosticButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diagnosticButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  apiTestButton: {
    backgroundColor: Colors.secondary,
  },
  supabaseTestButton: {
    backgroundColor: '#3ECF8E', // Color de Supabase
  },
  diagnosticButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: 5,
  },
  fullDiagnosticLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  fullDiagnosticText: {
    color: '#0066CC',
    fontSize: 14,
  },
}); 