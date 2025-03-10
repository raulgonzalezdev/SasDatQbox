import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { register, UserRegistrationData } from '@/services/auth';
import { ApiError } from '@/services/api';

// Definir los planes disponibles
const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Funcionalidades básicas',
    isPremium: false,
    color: Colors.darkGray
  },
  {
    id: 'basic',
    name: 'Básico',
    description: '$9.99/mes',
    isPremium: true,
    color: Colors.info
  },
  {
    id: 'premium',
    name: 'Premium',
    description: '$19.99/mes',
    isPremium: true,
    color: Colors.primary
  },
  {
    id: 'business',
    name: 'Empresarial',
    description: '$39.99/mes',
    isPremium: true,
    color: Colors.secondary
  }
];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].id); // Plan gratuito por defecto
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, setAuthenticated, setHidePromotions } = useAppStore();

  const handleRegister = async () => {
    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword || !businessName) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Obtener el plan seleccionado
      const plan = PLANS.find(p => p.id === selectedPlan) || PLANS[0];

      // Datos de registro
      const userData: UserRegistrationData = {
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || '',
        email,
        password,
        businessName
      };

      // Intentar registrar al usuario con el backend
      const response = await register(userData);

      // Si llegamos aquí, el registro fue exitoso
      // Guardar el usuario en el store
      const newUser = {
        id: response.user.id,
        name: response.user.first_name + ' ' + response.user.last_name,
        email: response.user.email,
        role: 'Propietario',
        businessName: response.user.businessName || businessName,
        isPremium: plan.isPremium || (response.user.subscriptionStatus === 'active' || response.user.subscriptionStatus === 'trial'),
      };

      // Guardar el usuario en el store
      setUser(newUser);
      setAuthenticated(true);
      
      // Si el usuario eligió un plan premium, ocultar las promociones
      if (newUser.isPremium) {
        setHidePromotions(true);
      }

      // Navegar a la pantalla principal
      router.replace('/(tabs)');
    } catch (error) {
      // Si hay un error, mostrar un mensaje
      if (error instanceof ApiError) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error durante el registro. Inténtalo de nuevo.');
      }

      // Para propósitos de demostración, permitimos el registro simulado
      try {
        // Obtener el plan seleccionado
        const plan = PLANS.find(p => p.id === selectedPlan) || PLANS[0];

        // Crear un usuario simulado
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          role: 'Propietario',
          businessName,
          isPremium: plan.isPremium,
        };

        // Guardar el usuario en el store
        setUser(newUser);
        setAuthenticated(true);
        
        // Si el usuario eligió un plan premium, ocultar las promociones
        if (plan.isPremium) {
          setHidePromotions(true);
        }

        // Navegar a la pantalla principal
        router.replace('/(tabs)');
      } catch (demoError) {
        console.error('Error en el registro de demostración:', demoError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Navegar a la pantalla principal sin registrarse
    router.replace('/(tabs)');
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
        <ThemedText style={styles.headerTitle}>Registro</ThemedText>
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

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color={Colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre de tu negocio"
                value={businessName}
                onChangeText={setBusinessName}
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

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={Colors.darkGray} 
                />
              </TouchableOpacity>
            </View>

            {/* Selección de plan */}
            <View style={styles.planSection}>
              <ThemedText style={styles.planSectionTitle}>Selecciona un plan</ThemedText>
              
              <View style={styles.planOptions}>
                {PLANS.map(plan => (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planOption,
                      selectedPlan === plan.id && styles.selectedPlanOption,
                      { borderColor: selectedPlan === plan.id ? plan.color : Colors.lightGray }
                    ]}
                    onPress={() => setSelectedPlan(plan.id)}
                  >
                    <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                      <Ionicons 
                        name={plan.id === 'free' ? 'gift-outline' : 'star-outline'} 
                        size={16} 
                        color={Colors.white} 
                      />
                    </View>
                    <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                    <ThemedText style={styles.planDescription}>{plan.description}</ThemedText>
                    
                    {selectedPlan === plan.id && (
                      <View style={styles.selectedPlanIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color={plan.color} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ThemedText style={styles.registerButtonText}>Registrando...</ThemedText>
              ) : (
                <ThemedText style={styles.registerButtonText}>Registrarse</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <ThemedText style={styles.loginText}>¿Ya tienes una cuenta?</ThemedText>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <ThemedText style={styles.loginLink}>Iniciar sesión</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <ThemedText style={styles.skipButtonText}>Continuar como invitado</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
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
  planSection: {
    marginBottom: Spacing.xl,
  },
  planSectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  planOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planOption: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    borderWidth: 2,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
    position: 'relative',
  },
  selectedPlanOption: {
    borderWidth: 2,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  planDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  selectedPlanIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  registerButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  loginText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginRight: Spacing.xs,
  },
  loginLink: {
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
}); 