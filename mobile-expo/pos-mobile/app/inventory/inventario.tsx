import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
import { HelpModal } from '@/components/ui/HelpModal';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { PremiumFeature } from '@/components/ui/PremiumFeature';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { isUserPremium, getCurrentUser } from '@/store/appStore';
import { router } from 'expo-router';

export default function InventarioScreen() {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isPremium = isUserPremium();
  const user = getCurrentUser();
  
  // Datos simulados de productos
  const productos = [
    { id: 1, nombre: 'Hamburguesa', precio: 8.99, stock: 25, categoria: 'Comida' },
    { id: 2, nombre: 'Pizza', precio: 12.99, stock: 15, categoria: 'Comida' },
    { id: 3, nombre: 'Ensalada', precio: 6.99, stock: 20, categoria: 'Comida' },
    { id: 4, nombre: 'Refresco', precio: 2.50, stock: 50, categoria: 'Bebida' },
    { id: 5, nombre: 'Papas fritas', precio: 3.99, stock: 30, categoria: 'Acompañamiento' },
    { id: 6, nombre: 'Helado', precio: 4.50, stock: 18, categoria: 'Postre' },
  ];

  // Filtrar productos según la búsqueda
  const filteredProducts = searchQuery
    ? productos.filter(p => 
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productos;

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <Header 
        title={user?.businessName || "Varas Grill"}
        subtitle={user?.role || "Propietario"}
        onHelpPress={() => setHelpModalVisible(true)}
      />

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content}>
          {/* Indicador de Premium */}
          {isPremium && (
            <View style={styles.premiumIndicator}>
              <Ionicons name="star" size={16} color={Colors.white} />
              <ThemedText style={styles.premiumIndicatorText}>Premium</ThemedText>
            </View>
          )}
          
          {/* Buscador */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.darkGray} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Categorías */}
          <View style={CommonStyles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={CommonStyles.sectionTitle}>Categorías</ThemedText>
              
              {/* Gestión de categorías - Premium */}
              <PremiumFeature featureName="Gestión de categorías" forceShow={isPremium}>
                <TouchableOpacity style={styles.manageCategoriesButton}>
                  <Ionicons name="settings-outline" size={18} color={Colors.secondary} />
                  <ThemedText style={styles.manageCategoriesText}>Gestionar</ThemedText>
                </TouchableOpacity>
              </PremiumFeature>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              <TouchableOpacity style={[styles.categoryItem, styles.categoryItemActive]}>
                <ThemedText style={[styles.categoryText, styles.categoryTextActive]}>Todos</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <ThemedText style={styles.categoryText}>Comida</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <ThemedText style={styles.categoryText}>Bebida</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <ThemedText style={styles.categoryText}>Acompañamiento</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <ThemedText style={styles.categoryText}>Postre</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Lista de productos */}
          <View style={CommonStyles.section}>
            <View style={styles.productListHeader}>
              <ThemedText style={CommonStyles.sectionTitle}>Productos</ThemedText>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color={Colors.white} />
                <ThemedText style={styles.addButtonText}>Añadir</ThemedText>
              </TouchableOpacity>
            </View>
            
            {filteredProducts.map(producto => (
              <View key={producto.id} style={styles.productItem}>
                <View style={styles.productInfo}>
                  <ThemedText style={styles.productName}>{producto.nombre}</ThemedText>
                  <ThemedText style={styles.productCategory}>{producto.categoria}</ThemedText>
                </View>
                <View style={styles.productDetails}>
                  <ThemedText style={styles.productPrice}>${producto.precio.toFixed(2)}</ThemedText>
                  <View style={styles.stockContainer}>
                    <ThemedText style={[
                      styles.stockText,
                      producto.stock < 20 ? styles.stockLow : null
                    ]}>
                      Stock: {producto.stock}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {/* Acciones premium */}
          <PremiumFeature featureName="Gestión avanzada de inventario" forceShow={isPremium}>
            <View style={styles.premiumActionsContainer}>
              <TouchableOpacity style={styles.premiumActionButton}>
                <Ionicons name="download-outline" size={20} color={Colors.white} />
                <ThemedText style={styles.premiumActionText}>Exportar inventario</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.premiumActionButton}>
                <Ionicons name="cloud-upload-outline" size={20} color={Colors.white} />
                <ThemedText style={styles.premiumActionText}>Importar productos</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.premiumActionButton}>
                <Ionicons name="analytics-outline" size={20} color={Colors.white} />
                <ThemedText style={styles.premiumActionText}>Análisis de inventario</ThemedText>
              </TouchableOpacity>
            </View>
          </PremiumFeature>
        </ScrollView>
      </ThemedView>

      {/* Modal de ayuda */}
      <HelpModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
        screenName="menu"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  premiumIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  premiumIndicatorText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    ...BordersAndShadows.shadows.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  manageCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageCategoriesText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.secondary,
    marginLeft: Spacing.xs,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  categoryItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.circle,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  categoryItemActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  categoryText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  productListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.sm,
    marginLeft: Spacing.xs,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  productInfo: {
    flex: 2,
  },
  productName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  productCategory: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  productDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.success,
  },
  stockLow: {
    color: Colors.warning,
  },
  editButton: {
    marginLeft: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumActionsContainer: {
    marginBottom: Spacing.xl,
  },
  premiumActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  premiumActionText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSizes.md,
    marginLeft: Spacing.md,
  },
}); 