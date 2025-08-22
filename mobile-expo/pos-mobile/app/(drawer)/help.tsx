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
      question: '¿Cómo programar una cita médica?',
      answer: 'Para programar una cita, ve a la sección "Citas" desde el menú principal. Pulsa el botón "+" para crear una nueva cita. Selecciona el paciente, fecha, hora y tipo de consulta. Puedes enviar recordatorios automáticos al paciente.',
      expanded: false,
    },
    {
      id: '2',
      question: '¿Cómo comunicarme con mis pacientes de forma segura?',
      answer: 'Utiliza nuestro chat médico seguro desde la sección "Chat". Puedes enviar mensajes de texto, notas de voz y realizar videollamadas. Toda la comunicación está encriptada y cumple con los estándares de privacidad médica.',
      expanded: false,
    },
    {
      id: '3',
      question: '¿Cómo gestionar el historial médico de un paciente?',
      answer: 'En la sección "Pacientes", selecciona el paciente deseado. Allí podrás ver y actualizar su historial médico, alergias, medicamentos actuales, y agregar nuevas notas médicas. Todo se sincroniza automáticamente.',
      expanded: false,
    },
    {
      id: '4',
      question: '¿Cómo crear y enviar recetas digitales?',
      answer: 'Durante una consulta o desde el chat, puedes crear recetas digitales. Selecciona los medicamentos, dosis y frecuencia. La receta se enviará automáticamente al paciente y se guardará en su historial.',
      expanded: false,
    },
    {
      id: '5',
      question: '¿La app cumple con las regulaciones de privacidad médica?',
      answer: 'Sí, DoctorBox cumple con los estándares HIPAA y GDPR. Todos los datos están encriptados, tenemos auditorías de seguridad regulares y solo el personal autorizado puede acceder a la información médica.',
      expanded: false,
    },
    {
      id: '6',
      question: '¿Cómo usar las videollamadas médicas?',
      answer: 'Desde el chat con un paciente, pulsa el icono de videollamada. El paciente recibirá una notificación para unirse. Puedes compartir pantalla, tomar capturas para el expediente y grabar la consulta si es necesario.',
      expanded: false,
    },
  ]);
  
  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };
  
  const handleContactSupport = () => {
    Linking.openURL('mailto:soporte@doctorbox.com?subject=Soporte%20Médico%20DoctorBox');
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
            <Ionicons name="medical-outline" size={24} color={Colors.primary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Guía médica inicial</ThemedText>
              <ThemedText style={styles.guideDescription}>Configuración inicial para profesionales de la salud</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.guideItem}>
            <Ionicons name="people-outline" size={24} color={Colors.primary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Gestión de pacientes</ThemedText>
              <ThemedText style={styles.guideDescription}>Cómo administrar historiales y seguimientos</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.guideItem}>
            <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Comunicación segura</ThemedText>
              <ThemedText style={styles.guideDescription}>Chat médico y videollamadas profesionales</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.guideItem}>
            <Ionicons name="document-text-outline" size={24} color={Colors.primary} style={styles.guideIcon} />
            <View style={styles.guideInfo}>
              <ThemedText style={styles.guideTitle}>Recetas digitales</ThemedText>
              <ThemedText style={styles.guideDescription}>Creación y gestión de prescripciones electrónicas</ThemedText>
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