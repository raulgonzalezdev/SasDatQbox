import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { getBusinesses, Business } from '@/services/businesses';
import { ApiError } from '@/services/api';

export default function BusinessesScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar los negocios');
      }
      
      // Para propósitos de demostración, cargar datos de ejemplo
      setBusinesses([
        {
          id: '1',
          owner_id: 'user1',
          name: 'Varas Grill',
          logo_url: 'https://example.com/logo.png',
          email: 'info@varasgrill.com',
          phone: '123-456-7890',
          currency: 'USD',
          settings: {
            tax_percentage: 7,
            default_language: 'es',
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          owner_id: 'user1',
          name: 'Café Delicioso',
          logo_url: 'https://example.com/logo2.png',
          email: 'info@cafedelicioso.com',
          phone: '123-456-7891',
          currency: 'USD',
          settings: {
            tax_percentage: 6,
            default_language: 'es',
          },
          created_at: new Date(),
          updated_at: new Date(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBusiness = () => {
    router.push('/businesses/new');
  };

  const handleSelectBusiness = (business: Business) => {
    router.push(`/businesses/${business.id}`);
  };

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <TouchableOpacity 
      style={styles.businessCard}
      onPress={() => handleSelectBusiness(item)}
    >
      <View style={styles.businessLogo}>
        {item.logo_url ? (
          <Ionicons name="business" size={30} color={Colors.white} />
        ) : (
          <ThemedText style={styles.businessInitial}>
            {item.name.substring(0, 1).toUpperCase()}
          </ThemedText>
        )}
      </View>
      <View style={styles.businessInfo}>
        <ThemedText style={styles.businessName}>{item.name}</ThemedText>
        <ThemedText style={styles.businessEmail}>{item.email || 'Sin correo'}</ThemedText>
        <ThemedText style={styles.businessPhone}>{item.phone || 'Sin teléfono'}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.darkGray} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <CustomStatusBar />
      <Stack.Screen 
        options={{
          title: 'Mis Negocios',
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
              style={styles.addButton}
              onPress={handleAddBusiness}
            >
              <Ionicons name="add" size={24} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <ThemedText style={styles.loadingText}>Cargando negocios...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.danger} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadBusinesses}
          >
            <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
          </TouchableOpacity>
        </View>
      ) : businesses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={60} color={Colors.darkGray} />
          <ThemedText style={styles.emptyText}>No tienes negocios registrados</ThemedText>
          <TouchableOpacity 
            style={styles.addBusinessButton}
            onPress={handleAddBusiness}
          >
            <ThemedText style={styles.addBusinessButtonText}>Agregar negocio</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={businesses}
          renderItem={renderBusinessItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  addButton: {
    marginRight: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addBusinessButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  addBusinessButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  listContent: {
    padding: Spacing.md,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  businessLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  businessInitial: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  businessEmail: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  businessPhone: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
}); 