import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore, getCurrentUser, isUserAuthenticated } from '@/store/appStore';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { getProfile, updateProfile, logout } from '@/services/auth';
import { ApiError } from '@/services/api';
import { getCurrentSubscription } from '@/services/subscriptions';

export default function ProfileScreen() {
  const isAuthenticated = isUserAuthenticated();
  const user = getCurrentUser();
  const { updateUser, setAuthenticated } = useAppStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    planName: string;
    status: string;
    description: string;
  }>({
    planName: 'Plan Gratuito',
    status: 'Activo',
    description: 'Acceso a funciones básicas para gestionar tu negocio.'
  });
  
  // Si el usuario no está autenticado, redirigir a la pantalla de login
  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  // Cargar el perfil del usuario desde el backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        
        // Actualizar los datos del formulario
        setName(profileData.first_name + ' ' + profileData.last_name);
        setEmail(profileData.email);
        setBusinessName(profileData.businessName || user?.businessName || '');
        
        // Actualizar el usuario en el store
        updateUser({
          ...user!,
          name: profileData.first_name + ' ' + profileData.last_name,
          email: profileData.email,
          businessName: profileData.businessName || user?.businessName || '',
          isPremium: profileData.subscriptionStatus === 'active' || profileData.subscriptionStatus === 'trial'
        });

        // Cargar información de suscripción
        try {
          const subscription = await getCurrentSubscription();
          if (subscription) {
            let planName = 'Plan Premium';
            let status = subscription.status;
            let description = 'Acceso completo a todas las funcionalidades.';
            
            if (status === 'trialing') {
              status = 'Prueba';
              description = 'Período de prueba del plan premium.';
            } else if (status === 'active') {
              status = 'Activo';
            } else if (status === 'canceled') {
              status = 'Cancelado';
              description = 'Tu suscripción ha sido cancelada.';
            } else if (status === 'past_due') {
              status = 'Pago pendiente';
              description = 'Hay un problema con tu pago.';
            }
            
            setSubscriptionInfo({
              planName,
              status,
              description
            });
          }
        } catch (subError) {
          console.log('Error al cargar la suscripción:', subError);
        }
      } catch (error) {
        console.log('Error al cargar el perfil:', error);
        // Si hay un error, usamos los datos del store
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim() || !businessName.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    
    setLoading(true);
    
    try {
      // Dividir el nombre en nombre y apellido
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Actualizar el perfil en el backend
      const updatedProfile = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
        businessName
      });
      
      // Actualizar el perfil del usuario en el store
      updateUser({
        ...user!,
        name,
        email,
        businessName
      });
      
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
      }
      
      // Para propósitos de demostración, actualizamos el perfil localmente
      updateUser({
        ...user!,
        name,
        email,
        businessName
      });
      
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              setAuthenticated(false);
              router.replace('/auth/login');
            } catch (error) {
              console.log('Error al cerrar sesión:', error);
              // Si hay un error, cerramos sesión localmente
              setAuthenticated(false);
              router.replace('/auth/login');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  return (
    <>
      <CustomStatusBar />
      <Stack.Screen 
        options={{
          title: 'Mi Perfil',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.dark,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "close" : "create-outline"} 
                size={24} 
                color={Colors.dark} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <ThemedText style={styles.avatarText}>
                {name.substring(0, 1).toUpperCase()}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nombre</ThemedText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                />
              ) : (
                <ThemedText style={styles.value}>{name}</ThemedText>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Correo electrónico</ThemedText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <ThemedText style={styles.value}>{email}</ThemedText>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nombre del negocio</ThemedText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="Nombre de tu negocio"
                />
              ) : (
                <ThemedText style={styles.value}>{businessName}</ThemedText>
              )}
            </View>
            
            {isEditing && (
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <ThemedText style={styles.saveButtonText}>Guardar cambios</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionTitle}>Seguridad</ThemedText>
            
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="lock-closed-outline" size={24} color={Colors.dark} style={styles.optionIcon} />
              <ThemedText style={styles.optionText}>Cambiar contraseña</ThemedText>
              <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color={Colors.dark} style={styles.optionIcon} />
              <ThemedText style={styles.optionText}>Verificación en dos pasos</ThemedText>
              <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionTitle}>Suscripción</ThemedText>
            
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <ThemedText style={styles.planName}>{subscriptionInfo.planName}</ThemedText>
                <View style={styles.planBadge}>
                  <ThemedText style={styles.planBadgeText}>{subscriptionInfo.status}</ThemedText>
                </View>
              </View>
              
              <ThemedText style={styles.planDescription}>
                {subscriptionInfo.description}
              </ThemedText>
              
              <TouchableOpacity 
                style={styles.upgradePlanButton}
                onPress={() => router.push('/landing')}
              >
                <ThemedText style={styles.upgradePlanButtonText}>Mejorar plan</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.white} style={styles.logoutIcon} />
            <ThemedText style={styles.logoutButtonText}>Cerrar sesión</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  backButton: {
    marginLeft: Spacing.sm,
  },
  editButton: {
    marginRight: Spacing.sm,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  avatarText: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  formContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    paddingVertical: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  saveButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  optionIcon: {
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  subscriptionCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  planBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.sm,
  },
  planBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  planDescription: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.lg,
  },
  upgradePlanButton: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  upgradePlanButtonText: {
    color: Colors.dark,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.danger,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  logoutIcon: {
    marginRight: Spacing.sm,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
}); 