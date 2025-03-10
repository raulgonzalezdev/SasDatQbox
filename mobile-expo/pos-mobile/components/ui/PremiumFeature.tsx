import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { isUserPremium, isDemoMode, shouldShowPromotions } from '@/store/appStore';

interface PremiumFeatureProps {
  children: React.ReactNode;
  featureName: string;
  forceShow?: boolean; // Si es true, siempre muestra el contenido sin restricciones
}

export function PremiumFeature({ 
  children, 
  featureName,
  forceShow = false
}: PremiumFeatureProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Verificar si el usuario tiene acceso a la característica premium
  const hasPremiumAccess = isUserPremium();
  const isDemo = isDemoMode();
  const showPromotions = shouldShowPromotions();
  
  // Si el usuario tiene acceso premium o se fuerza mostrar el contenido, mostrar el contenido normal
  if (hasPremiumAccess || forceShow) {
    return <>{children}</>;
  }
  
  // Si no se deben mostrar promociones, mostrar el contenido sin restricciones
  if (!showPromotions) {
    return <>{children}</>;
  }
  
  // Si estamos en modo demo o el usuario no es premium, mostrar el contenido con restricciones
  const handlePress = () => {
    setModalVisible(true);
  };
  
  const handleGoToPremium = () => {
    setModalVisible(false);
    // Navegar a la landing page interna
    router.push('/landing');
  };
  
  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        {children}
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={50} color={Colors.primary} />
            </View>
            
            <ThemedText style={styles.title}>Característica Premium</ThemedText>
            
            <ThemedText style={styles.description}>
              La función "{featureName}" está disponible exclusivamente para usuarios premium.
              Actualiza tu plan para desbloquear todas las funcionalidades.
            </ThemedText>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.secondaryButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleGoToPremium}
              >
                <ThemedText style={styles.primaryButtonText}>Ver planes</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...BordersAndShadows.shadows.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    flex: 1,
    marginLeft: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    flex: 1,
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.darkGray,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSizes.md,
  },
}); 