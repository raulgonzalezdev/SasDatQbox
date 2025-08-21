import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';

export default function AboutScreen() {
  const appVersion = '1.0.0';
  
  const handleOpenWebsite = () => {
    Linking.openURL('https://www.datqbox.com');
  };
  
  const handleOpenPrivacyPolicy = () => {
    Linking.openURL('https://www.datqbox.com/privacy');
  };
  
  const handleOpenTerms = () => {
    Linking.openURL('https://www.datqbox.com/terms');
  };
  
  return (
    <>
   
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="storefront" size={60} color={Colors.secondary} />
          </View>
          <ThemedText style={styles.appName}>DatqboxPos</ThemedText>
          <ThemedText style={styles.appVersion}>Versión {appVersion}</ThemedText>
          <ThemedText style={styles.appDescription}>
            La solución completa para la gestión de tu negocio
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Acerca de nosotros</ThemedText>
          <ThemedText style={styles.sectionText}>
            DatqboxPos es una aplicación diseñada para ayudar a pequeños y medianos negocios a gestionar sus ventas, inventario, gastos y reportes de manera sencilla y eficiente.
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Nuestro objetivo es proporcionar herramientas accesibles que permitan a los emprendedores y dueños de negocios tomar mejores decisiones basadas en datos reales y actualizados.
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Características principales</ThemedText>
          
          <View style={styles.featureItem}>
            <Ionicons name="cart" size={24} color={Colors.secondary} style={styles.featureIcon} />
            <View>
              <ThemedText style={styles.featureTitle}>Gestión de ventas</ThemedText>
              <ThemedText style={styles.featureDescription}>Registra y gestiona tus ventas diarias</ThemedText>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="cube" size={24} color={Colors.secondary} style={styles.featureIcon} />
            <View>
              <ThemedText style={styles.featureTitle}>Control de inventario</ThemedText>
              <ThemedText style={styles.featureDescription}>Administra tu stock de productos</ThemedText>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="cash" size={24} color={Colors.secondary} style={styles.featureIcon} />
            <View>
              <ThemedText style={styles.featureTitle}>Registro de gastos</ThemedText>
              <ThemedText style={styles.featureDescription}>Controla los gastos de tu negocio</ThemedText>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="bar-chart" size={24} color={Colors.secondary} style={styles.featureIcon} />
            <View>
              <ThemedText style={styles.featureTitle}>Reportes detallados</ThemedText>
              <ThemedText style={styles.featureDescription}>Visualiza el rendimiento de tu negocio</ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Información legal</ThemedText>
          
          <TouchableOpacity 
            style={styles.legalItem}
            onPress={handleOpenPrivacyPolicy}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color={Colors.dark} style={styles.legalIcon} />
            <ThemedText style={styles.legalText}>Política de privacidad</ThemedText>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.legalItem}
            onPress={handleOpenTerms}
          >
            <Ionicons name="document-text-outline" size={24} color={Colors.dark} style={styles.legalIcon} />
            <ThemedText style={styles.legalText}>Términos y condiciones</ThemedText>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactSection}>
          <ThemedText style={styles.contactTitle}>Contáctanos</ThemedText>
          
          <View style={styles.contactInfo}>
            <Ionicons name="mail-outline" size={20} color={Colors.dark} style={styles.contactIcon} />
            <ThemedText style={styles.contactText}>soporte@datqbox.com</ThemedText>
          </View>
          
          <View style={styles.contactInfo}>
            <Ionicons name="globe-outline" size={20} color={Colors.dark} style={styles.contactIcon} />
            <TouchableOpacity onPress={handleOpenWebsite}>
              <ThemedText style={[styles.contactText, styles.contactLink]}>www.datqbox.com</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={24} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <ThemedText style={styles.copyright}>
            © {new Date().getFullYear()} DatqboxPos. Todos los derechos reservados.
          </ThemedText>
        </View>
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
  header: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.md,
  },
  appName: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  appDescription: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    marginRight: Spacing.md,
  },
  featureTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  legalIcon: {
    marginRight: Spacing.md,
  },
  legalText: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  contactSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  contactTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  contactIcon: {
    marginRight: Spacing.sm,
  },
  contactText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  contactLink: {
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  copyright: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
  },
}); 