import { StyleSheet } from 'react-native';

// Colores principales de la aplicación
export const Colors = {
  primary: '#007AFF', // Azul primario brillante
  primaryDark: '#0056b3', // Azul oscuro para gradiente y estados presionados
  primaryLight: '#409cff', // Azul claro para gradiente
  secondary: '#FF9500', // Naranja como color de acento
  secondaryLight: '#FFB74D', // Naranja claro
  success: '#34C759', // Verde iOS
  danger: '#FF3B30', // Rojo iOS
  warning: '#FFCC00', // Amarillo iOS
  info: '#007AFF', // Igual que el primario
  dark: '#1c1c1e', // Negro casi puro para texto (iOS)
  darkGray: '#8e8e93', // Gris medio para texto secundario (iOS)
  lightGray: '#e5e5ea', // Gris claro para bordes y fondos (iOS)
  white: '#FFFFFF', // Blanco
  background: '#F2F2F7', // Fondo de sistema iOS
  tabBar: '#F7F7F7', // Color de la barra de pestañas casi blanco
};

// Tipografía
export const Typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 32,
  },
  fontWeights: {
    normal: 'normal',
    medium: '500',
    semibold: '600',
    bold: 'bold',
  },
};

// Espaciado
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Bordes y sombras
export const BordersAndShadows = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    circle: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

// Estilos comunes
export const CommonStyles = StyleSheet.create({
  // Contenedores
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  
  // Tarjetas
  card: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  
  // Textos
  sectionTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.lg,
    color: Colors.dark,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  text: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  
  // Botones
  primaryButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.circle,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  secondaryButtonText: {
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.md,
  },
  
  // Iconos
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Grids
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Elementos de lista
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
}); 