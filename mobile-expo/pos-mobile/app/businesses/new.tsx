import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { createBusiness, BusinessInput } from '@/services/businesses';
import { ApiError } from '@/services/api';

export default function NewBusinessScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  const handleCreateBusiness = async () => {
    // Validaciones básicas
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del negocio es obligatorio');
      return;
    }

    setLoading(true);

    try {
      // Crear objeto de negocio
      const businessData: BusinessInput = {
        name,
        email: email || undefined,
        phone: phone || undefined,
        website: website || undefined,
        tax_id: taxId || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
        zip_code: zipCode || undefined,
        currency: currency || 'USD',
        settings: {
          tax_percentage: 0,
          default_language: 'es',
        }
      };

      // Crear negocio
      const newBusiness = await createBusiness(businessData);

      Alert.alert(
        'Éxito',
        'Negocio creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.replace(`/businesses/${newBusiness.id}`)
          }
        ]
      );
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error al crear el negocio');
      }
      
      // Para propósitos de demostración, simular éxito
      Alert.alert(
        'Éxito (Demo)',
        'Negocio creado correctamente (simulación)',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/businesses')
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <CustomStatusBar />
      <Stack.Screen 
        options={{
          title: 'Nuevo Negocio',
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Información básica</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombre del negocio *</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre de tu negocio"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Correo electrónico</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Teléfono</ThemedText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="123-456-7890"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Sitio web</ThemedText>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="www.ejemplo.com"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Identificación fiscal</ThemedText>
            <TextInput
              style={styles.input}
              value={taxId}
              onChangeText={setTaxId}
              placeholder="RFC, NIT, etc."
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Dirección</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Dirección</ThemedText>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Calle, número, etc."
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Ciudad</ThemedText>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Ciudad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Estado/Provincia</ThemedText>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="Estado o provincia"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>País</ThemedText>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="País"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Código postal</ThemedText>
            <TextInput
              style={styles.input}
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Código postal"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Configuración</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Moneda</ThemedText>
            <TextInput
              style={styles.input}
              value={currency}
              onChangeText={setCurrency}
              placeholder="USD, EUR, MXN, etc."
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleCreateBusiness}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <ThemedText style={styles.createButtonText}>Crear Negocio</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  formSection: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
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
  createButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
}); 