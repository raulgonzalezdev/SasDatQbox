import { StyleSheet } from 'react-native';

// Colores principales - Sistema moderno inspirado en apps premium
export const Colors = {
  // Primarios médicos profesionales
  primary: '#3366FF', // Azul médico moderno
  primaryDark: '#1A47CC', // Azul oscuro para estados activos
  primaryLight: '#5577FF', // Azul claro para gradientes
  primarySoft: '#E8EFFF', // Azul muy suave para fondos
  
  // Secundarios modernos
  secondary: '#FF6B35', // Naranja vibrante pero elegante
  secondaryLight: '#FF8A65', // Naranja claro
  secondaryDark: '#E55722', // Naranja oscuro
  secondarySoft: '#FFF4F1', // Naranja muy suave
  
  // Sistema de estados médicos
  success: '#00D4AA', // Verde médico moderno
  successLight: '#4DDDC7', // Verde claro
  successDark: '#00B894', // Verde oscuro
  successSoft: '#E8FDF9', // Verde muy suave
  
  danger: '#FF5B5B', // Rojo moderno menos agresivo
  dangerLight: '#FF8080', // Rojo claro
  dangerDark: '#E04545', // Rojo oscuro
  dangerSoft: '#FFEBEB', // Rojo muy suave
  
  warning: '#FFB800', // Amarillo dorado
  warningLight: '#FFC947', // Amarillo claro
  warningDark: '#E6A600', // Amarillo oscuro
  warningSoft: '#FFF8E1', // Amarillo muy suave
  
  info: '#00B8D4', // Cian moderno
  infoLight: '#4DD0E1', // Cian claro
  infoDark: '#00ACC1', // Cian oscuro
  infoSoft: '#E0F7FA', // Cian muy suave
  
  // Grises premium de apps modernas
  neutral: {
    900: '#0F172A', // Negro premium
    800: '#1E293B', // Gris muy oscuro
    700: '#334155', // Gris oscuro
    600: '#475569', // Gris medio oscuro
    500: '#64748B', // Gris medio
    400: '#94A3B8', // Gris medio claro
    300: '#CBD5E1', // Gris claro
    200: '#E2E8F0', // Gris muy claro
    100: '#F1F5F9', // Gris casi blanco
    50: '#F8FAFC',  // Blanco grisáceo
  },
  
  // Aliases para compatibilidad y facilidad
  dark: '#0F172A',
  darkGray: '#64748B',
  mediumGray: '#94A3B8',
  lightGray: '#E2E8F0',
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Colores médicos específicos
  medical: {
    emergency: '#FF4757', // Rojo emergencia
    urgent: '#FF6B35',    // Naranja urgente
    routine: '#3366FF',   // Azul rutina
    virtual: '#00D4AA',   // Verde virtual
    home: '#FFB800',      // Amarillo domicilio
  },
  
  // Gradientes modernos
  gradients: {
    primary: ['#3366FF', '#5577FF'],
    secondary: ['#FF6B35', '#FF8A65'],
    success: ['#00D4AA', '#4DDDC7'],
    medical: ['#3366FF', '#00D4AA'],
    sunset: ['#FF6B35', '#FFB800'],
  }
};

// Tipografía moderna con scale perfecto inspirado en apps premium
export const Typography = {
  fontSizes: {
    xs: 11,      // Micro text, badges
    sm: 13,      // Caption, meta info
    md: 15,      // Body text
    lg: 17,      // Emphasis, large body
    xl: 20,      // Small heading
    xxl: 24,     // Medium heading
    xxxl: 28,    // Large heading
    display: 34, // Display text
    hero: 42,    // Hero text
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  }
};

// Sistema de espaciado moderno con más granularidad
export const Spacing = {
  xs: 4,       // Micro spacing
  sm: 8,       // Small spacing
  md: 12,      // Medium spacing  
  lg: 16,      // Large spacing
  xl: 20,      // Extra large
  xxl: 24,     // 2X large
  xxxl: 32,    // 3X large
  xxxxl: 40,   // 4X large
  xxxxxl: 48,  // 5X large
  xxxxxxl: 56, // 6X large
  huge: 64,    // Huge spacing
};

// Sistema de bordes y sombras premium
export const BordersAndShadows = {
  borderRadius: {
    none: 0,
    xs: 4,      // Micro radius
    sm: 6,      // Small radius
    md: 8,      // Medium radius
    lg: 12,     // Large radius
    xl: 16,     // Extra large
    xxl: 20,    // 2X large
    xxxl: 24,   // 3X large
    full: 9999, // Fully rounded
  },
  
  // Sombras modernas inspiradas en Material Design 3 y iOS
  shadows: {
    // Sombras sutiles
    xs: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    // Sombras medias
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    // Sombras prominentes
    xl: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
    },
    // Sombras especiales
    float: {
      shadowColor: '#3366FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    glow: {
      shadowColor: '#00D4AA',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  // Bordes modernos
  borders: {
    light: {
      borderWidth: 1,
      borderColor: '#F1F5F9',
    },
    normal: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    strong: {
      borderWidth: 1,
      borderColor: '#CBD5E1',
    },
    accent: {
      borderWidth: 2,
      borderColor: '#3366FF',
    },
  },
};

// Estilos comunes modernos inspirados en apps premium
export const CommonStyles = StyleSheet.create({
  // Contenedores base
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  contentWithPadding: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  
  // Cards modernas con diferentes niveles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
    ...BordersAndShadows.borders.light,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  cardPremium: {
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.xl,
    padding: Spacing.xl,
    ...BordersAndShadows.shadows.lg,
  },
  cardFloating: {
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.xl,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.float,
  },
  
  // Headers modernos
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.dark,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xl,
  },
  headerSubtitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  
  // Tipografía mejorada con line-height perfecto
  displayText: {
    fontSize: Typography.fontSizes.display,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.dark,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.display,
    letterSpacing: Typography.letterSpacing.tight,
  },
  heroText: {
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.dark,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.hero,
    letterSpacing: Typography.letterSpacing.tight,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xxl,
  },
  subtitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeights.normal * Typography.fontSizes.lg,
  },
  bodyText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.normal,
    color: Colors.neutral[700],
    lineHeight: Typography.lineHeights.relaxed * Typography.fontSizes.md,
  },
  bodyTextLarge: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.normal,
    color: Colors.neutral[700],
    lineHeight: Typography.lineHeights.relaxed * Typography.fontSizes.lg,
  },
  captionText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.neutral[500],
    lineHeight: Typography.lineHeights.normal * Typography.fontSizes.sm,
  },
  microText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.neutral[400],
    lineHeight: Typography.lineHeights.normal * Typography.fontSizes.xs,
  },
  
  // Botones modernos inspirados en las mejores apps
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  primaryButtonLarge: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...BordersAndShadows.shadows.md,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.md,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.md,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...BordersAndShadows.borders.normal,
  },
  secondaryButtonText: {
    color: Colors.neutral[700],
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.md,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.md,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: BordersAndShadows.borderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.md,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.md,
  },
  
  // Iconos y badges modernos
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BordersAndShadows.borderRadius.lg,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.xs,
  },
  iconContainerPrimary: {
    width: 44,
    height: 44,
    borderRadius: BordersAndShadows.borderRadius.lg,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: BordersAndShadows.borderRadius.full,
    minWidth: 20,
    height: 20,
    paddingHorizontal: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xs,
  },
  
  // Layout helpers modernos
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Separadores elegantes
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  dividerThick: {
    height: Spacing.xs,
    backgroundColor: Colors.background,
    marginVertical: Spacing.lg,
  },
  
  // Elementos de lista modernos
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  listItemElevated: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.lg,
    marginBottom: Spacing.sm,
    ...BordersAndShadows.shadows.xs,
  },
}); 