import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { useAppStore, isUserPremium } from '@/store/appStore';
import RoleSwitcher from '@/components/debug/RoleSwitcher';

export default function SettingsScreen() {
  const { hidePromotions, setHidePromotions } = useAppStore();
  const isPremium = isUserPremium();
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [hidePromos, setHidePromos] = useState(hidePromotions);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Aquí se implementaría la lógica para cambiar el tema de la aplicación
    Alert.alert('Información', 'Esta función estará disponible próximamente');
  };
  
  const toggleNotifications = () => {
    setNotifications(!notifications);
  };
  
  const toggleSoundEffects = () => {
    setSoundEffects(!soundEffects);
  };
  
  const toggleAutoSync = () => {
    setAutoSync(!autoSync);
  };
  
  const toggleHidePromotions = () => {
    const newValue = !hidePromos;
    setHidePromos(newValue);
    setHidePromotions(newValue);
  };
  
  const handleClearCache = () => {
    Alert.alert(
      'Limpiar caché',
      '¿Estás seguro de que deseas limpiar la caché de la aplicación? Esto no afectará tus datos guardados.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          onPress: () => {
            // Aquí se implementaría la lógica para limpiar la caché
            Alert.alert('Éxito', 'Caché limpiada correctamente');
          },
        },
      ]
    );
  };
  
  return (
    <>
      <CustomStatusBar />
      <Stack.Screen 
        options={{
          title: 'Configuración',
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
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Apariencia</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Modo oscuro</ThemedText>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: Colors.lightGray, true: Colors.secondaryLight }}
              thumbColor={darkMode ? Colors.secondary : Colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notificaciones</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Notificaciones push</ThemedText>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.secondaryLight }}
              thumbColor={notifications ? Colors.secondary : Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-medium-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Efectos de sonido</ThemedText>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={toggleSoundEffects}
              trackColor={{ false: Colors.lightGray, true: Colors.secondaryLight }}
              thumbColor={soundEffects ? Colors.secondary : Colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Datos y almacenamiento</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="sync-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Sincronización automática</ThemedText>
            </View>
            <Switch
              value={autoSync}
              onValueChange={toggleAutoSync}
              trackColor={{ false: Colors.lightGray, true: Colors.secondaryLight }}
              thumbColor={autoSync ? Colors.secondary : Colors.white}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearCache}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Limpiar caché</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contenido</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="pricetag-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingText}>Ocultar promociones</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  {isPremium ? 'Ya tienes acceso premium' : 'Oculta mensajes promocionales'}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={hidePromos}
              onValueChange={toggleHidePromotions}
              trackColor={{ false: Colors.lightGray, true: Colors.secondaryLight }}
              thumbColor={hidePromos ? Colors.secondary : Colors.white}
              disabled={isPremium}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Idioma</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingText}>Idioma de la aplicación</ThemedText>
                <ThemedText style={styles.settingSubtext}>Español</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Información</ThemedText>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/about')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Acerca de</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/help')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.dark} style={styles.settingIcon} />
              <ThemedText style={styles.settingText}>Ayuda</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
        
        {/* Debug: Cambiador de Roles */}
        <RoleSwitcher />
        
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginLeft: Spacing.sm,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: Spacing.md,
  },
  settingText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  settingSubtext: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
}); 