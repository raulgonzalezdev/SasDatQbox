import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

export default function HelpScreen() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: '¿Cómo puedo registrar una venta?',
      answer: 'Para registrar una venta, ve a la sección "Ventas" desde el menú principal. Luego, pulsa el botón "+" para añadir una nueva venta. Completa los detalles del producto, cantidad y precio, y finaliza pulsando "Guardar".',
      expanded: false,
    },
    {
      id: '2',
      question: '¿Cómo puedo añadir un nuevo producto al inventario?',
      answer: 'Para añadir un nuevo producto, ve a la sección "Inventario" desde el menú principal. Pulsa el botón "+" para añadir un nuevo producto. Completa los detalles como nombre, descripción, precio y cantidad, y finaliza pulsando "Guardar".',
      expanded: false,
    },
    {
      id: '3',
      question: '¿Cómo puedo ver mis reportes de ventas?',
      answer: 'Para ver tus reportes de ventas, ve a la sección "Reportes" desde el menú principal. Allí podrás ver diferentes tipos de informes como ventas diarias, semanales o mensuales. También puedes filtrar por fechas específicas.',
      expanded: false,
    },
    {
      id: '4',
      question: '¿Cómo puedo registrar un gasto?',
      answer: 'Para registrar un gasto, ve a la sección "Gastos" desde el menú principal. Pulsa el botón "+" para añadir un nuevo gasto. Completa los detalles como concepto, monto y fecha, y finaliza pulsando "Guardar".',
      expanded: false,
    },
    {
      id: '5',
      question: '¿Cómo puedo cambiar mi contraseña?',
      answer: 'Para cambiar tu contraseña, ve a la sección "Mi Perfil" desde el menú lateral. Luego, pulsa en "Cambiar contraseña" en la sección de Seguridad. Ingresa tu contraseña actual y la nueva contraseña, y finaliza pulsando "Guardar".',
      expanded: false,
    },
  ]);
  
  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };
  
  const handleContactSupport = () => {
    Linking.openURL('mailto:soporte@tuapp.com?subject=Soporte%20Técnico');
  };
  
  return (
    <>
      <CustomStatusBar />
      <Stack.Screen 
        options={{
          title: 'Ayuda',
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
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
            <ThemedText style={styles.searchPlaceholder}>Buscar en la ayuda</ThemedText>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preguntas frecuentes</ThemedText>
          
          {faqs.map(faq => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(faq.id)}
              >
                <ThemedText style={styles.faqQuestionText}>{faq.question}</ThemedText>
                <Ionicons 
                  name={faq.expanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={Colors.darkGray} 
                />
              </TouchableOpacity>
              
              {faq.expanded && (
                <View style={styles.faqAnswer}>
                  <ThemedText style={styles.faqAnswerText}>{faq.answer}</ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Guías rápidas</ThemedText>
          
          <TouchableOpacity style={styles.guideItem}>
            <Ionicons name="document-text-outline" size={24} color={Colors.secondary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Guía de inicio rápido</ThemedText>
              <ThemedText style={styles.guideDescription}>Aprende lo básico para comenzar a usar la aplicación</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.guideItem}>
            <Ionicons name="cart-outline" size={24} color={Colors.secondary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Gestión de ventas</ThemedText>
              <ThemedText style={styles.guideDescription}>Cómo registrar y gestionar tus ventas</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.guideItem}>
            <Ionicons name="cube-outline" size={24} color={Colors.secondary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Gestión de inventario</ThemedText>
              <ThemedText style={styles.guideDescription}>Cómo administrar tu inventario de productos</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactSection}>
          <ThemedText style={styles.contactTitle}>¿Necesitas más ayuda?</ThemedText>
          <ThemedText style={styles.contactDescription}>
            Si no encuentras respuesta a tu pregunta, contáctanos directamente y te ayudaremos lo antes posible.
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="mail-outline" size={20} color={Colors.white} style={styles.contactButtonIcon} />
            <ThemedText style={styles.contactButtonText}>Contactar soporte</ThemedText>
          </TouchableOpacity>
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
  searchSection: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchPlaceholder: {
    color: Colors.darkGray,
    fontSize: Typography.fontSizes.md,
  },
  section: {
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
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  faqQuestionText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    flex: 1,
    marginRight: Spacing.md,
  },
  faqAnswer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  faqAnswerText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    lineHeight: 22,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  guideIcon: {
    marginRight: Spacing.md,
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  guideDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  contactSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  contactButtonIcon: {
    marginRight: Spacing.sm,
  },
  contactButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
}); 