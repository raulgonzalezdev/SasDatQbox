# 🤖 **GUÍA DE INTERACCIÓN CON IA - DOCTORBOX**
## Ejemplos Prácticos para Mantener Contexto

---

## 🎯 **CÓMO USAR ESTOS DOCUMENTOS**

### **📋 Orden de Lectura para IA**
1. **PRIMERO**: Lee `AI_PROJECT_PROMPT.md` (contexto completo)
2. **SEGUNDO**: Lee este archivo para ejemplos específicos
3. **TERCERO**: Usa `PITCH_INVERSIONISTAS.md` para contexto de negocio
4. **CUARTO**: Explora el código siguiendo la estructura definida

---

## 💻 **EJEMPLOS DE TAREAS COMUNES**

### **🔧 1. AGREGAR NUEVA FUNCIONALIDAD**

#### **Ejemplo: Agregar filtro por precio en búsqueda de doctores**
```typescript
// CORRECTO - Sigue la arquitectura existente
// 1. Modificar locationStore.ts
interface LocationState {
  filters: {
    // ... filtros existentes
    priceRange: { min: number; max: number }; // AGREGAR ESTO
  }
}

// 2. Actualizar DoctorMapSearch.tsx
const renderPriceFilter = () => (
  <TouchableOpacity onPress={() => {
    // Usar updateFilters del store
    updateFilters({ 
      priceRange: { min: 0, max: 100 } 
    });
  }}>
    <Text>Filtro Precio</Text>
  </TouchableOpacity>
);

// 3. Aplicar filtro en searchNearbyDoctors
const filteredDoctors = mockDoctors.filter(doctor => {
  if (doctor.priceRange.min > filters.priceRange.max) return false;
  // ... resto de filtros
  return true;
});
```

#### **❌ INCORRECTO - No seguir patrones**
```typescript
// NO HAGAS ESTO
// - Crear nuevo store para algo que ya existe
// - Usar Context API cuando ya hay Zustand
// - Modificar estructura de carpetas
// - Ignorar componentes existentes
```

### **🎨 2. MODIFICAR UI/UX**

#### **Ejemplo: Cambiar estilo de botón principal**
```typescript
// CORRECTO - Usar GlobalStyles existente
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.primary,        // Usar colores definidos
    padding: Spacing.lg,                   // Usar spacing consistente
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.md,       // Usar sombras definidas
  },
  buttonText: {
    fontSize: Typography.fontSizes.md,     // Usar tipografía consistente
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  }
});
```

### **📊 3. AGREGAR MÉTRICAS O ANALYTICS**

#### **Ejemplo: Nueva métrica en dashboard de inversionistas**
```typescript
// CORRECTO - Usar serviceTrackingStore existente
// 1. Agregar a ServiceMetrics interface
interface ServiceMetrics {
  // ... métricas existentes
  conversionRate: number; // NUEVA MÉTRICA
}

// 2. Calcular en updateMetrics()
const conversionRate = (completedServices / totalRequests) * 100;
set({
  metrics: {
    ...existingMetrics,
    conversionRate
  }
});

// 3. Mostrar en InvestorDashboard.tsx
const newKpiCard = {
  title: 'Conversión',
  value: `${metrics.conversionRate.toFixed(1)}%`,
  icon: 'trending-up',
  color: Colors.success
};
```

### **🔄 4. INTEGRAR CON BACKEND**

#### **Ejemplo: Conectar API real en lugar de mocks**
```typescript
// CORRECTO - Usar servicios existentes
// 1. Modificar services/api.ts
export const doctorService = {
  async searchNearby(coordinates: Coordinates, filters: SearchFilters) {
    const response = await apiClient.post('/doctors/search', {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      ...filters
    });
    return response.data;
  }
};

// 2. Actualizar locationStore.ts
searchNearbyDoctors: async (coordinates, radius) => {
  try {
    // Reemplazar mock con API real
    const doctors = await doctorService.searchNearby(coordinates, get().filters);
    set({ nearbyDoctors: doctors });
  } catch (error) {
    console.error('Error buscando doctores:', error);
    // Fallback a datos mock si falla API
    const mockDoctors = getMockDoctors();
    set({ nearbyDoctors: mockDoctors });
  }
}
```

---

## 🎯 **PATRONES DE DESARROLLO ESPECÍFICOS**

### **📱 1. NAVEGACIÓN (Expo Router)**
```typescript
// SIEMPRE usar router de expo-router
import { router } from 'expo-router';

// Navegación simple
router.push('/auth/login');

// Navegación con parámetros
router.push({
  pathname: '/chat/[id]',
  params: { id: conversationId }
});

// Reemplazar (no back)
router.replace('/dashboard');
```

### **🗂️ 2. ESTADO GLOBAL (Zustand)**
```typescript
// SIEMPRE usar Zustand para estado compartido
import { useAppStore } from '@/store/appStore';

const Component = () => {
  // Obtener estado
  const { user, isAuthenticated } = useAppStore();
  
  // Obtener acciones
  const { login, logout } = useAppStore();
  
  // Usar en handlers
  const handleLogin = async () => {
    await login(credentials);
  };
};
```

### **🎨 3. ESTILOS CONSISTENTES**
```typescript
// SIEMPRE importar desde GlobalStyles
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';

// Usar constantes definidas
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,    // NO usar '#f5f5f5'
    padding: Spacing.lg,                  // NO usar 16
    borderRadius: BordersAndShadows.borderRadius.md, // NO usar 8
  },
  title: {
    fontSize: Typography.fontSizes.lg,    // NO usar 18
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,                   // NO usar '#333'
  }
});
```

### **📊 4. COMPONENTES DE GRÁFICOS**
```typescript
// Usar react-native-chart-kit como está implementado
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: Colors.white,
  backgroundGradientTo: Colors.white,
  color: (opacity = 1) => `rgba(51, 102, 255, ${opacity})`,
  // ... configuración estándar
};

// Datos siempre en formato específico
const lineData = {
  labels: ['Ene', 'Feb', 'Mar'],
  datasets: [{
    data: [20, 45, 28]
  }]
};
```

---

## 🚨 **ERRORES COMUNES A EVITAR**

### **❌ 1. NO CAMBIAR ARQUITECTURA BASE**
```typescript
// MAL - Cambiar de Zustand a Redux
import { configureStore } from '@reduxjs/toolkit';

// BIEN - Usar Zustand existente
import { useAppStore } from '@/store/appStore';
```

### **❌ 2. NO IGNORAR ESTRUCTURA DE CARPETAS**
```typescript
// MAL - Crear nueva estructura
components/
├── NewFolder/
│   └── RandomComponent.tsx

// BIEN - Usar estructura existente
components/
├── medical/           // Nueva categoría lógica
│   └── NewComponent.tsx
```

### **❌ 3. NO ROMPER PATRONES DE NAVEGACIÓN**
```typescript
// MAL - Navegación manual
navigation.navigate('Screen');

// BIEN - Usar Expo Router
router.push('/screen');
```

### **❌ 4. NO IGNORAR TIPOS EXISTENTES**
```typescript
// MAL - Crear tipos duplicados
interface MyUser {
  id: string;
  name: string;
}

// BIEN - Usar tipos existentes
import { User } from '@/store/appStore';
```

---

## 🎯 **FLUJOS DE TRABAJO ESPECÍFICOS**

### **🔄 1. AGREGAR NUEVA PANTALLA**
```typescript
// Paso 1: Crear archivo en estructura correcta
// app/(drawer)/nueva-pantalla.tsx

// Paso 2: Usar layout y componentes base
import { SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors, CommonStyles } from '@/constants/GlobalStyles';

export default function NuevaPantalla() {
  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      {/* Contenido */}
    </SafeAreaView>
  );
}

// Paso 3: Agregar navegación si es necesario
// En el componente padre:
router.push('/(drawer)/nueva-pantalla');
```

### **🔧 2. MODIFICAR STORE EXISTENTE**
```typescript
// Paso 1: Leer store actual
import { useAppStore } from '@/store/appStore';

// Paso 2: Agregar al interface existente
interface AppState {
  // ... propiedades existentes
  nuevaPropiedad: string; // AGREGAR
}

// Paso 3: Agregar al store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ... estado existente
      nuevaPropiedad: '',
      
      // ... acciones existentes
      setNuevaPropiedad: (valor: string) => set({ nuevaPropiedad: valor }),
    }),
    // ... configuración persist existente
  )
);
```

### **📊 3. AGREGAR NUEVA MÉTRICA**
```typescript
// Paso 1: Modificar ServiceMetrics en serviceTrackingStore.ts
interface ServiceMetrics {
  // ... métricas existentes
  nuevaMetrica: number;
}

// Paso 2: Calcular en updateMetrics()
updateMetrics: () => {
  // ... cálculos existentes
  const nuevaMetrica = calculateNuevaMetrica();
  
  set({
    metrics: {
      ...existingMetrics,
      nuevaMetrica
    }
  });
}

// Paso 3: Mostrar en InvestorDashboard.tsx
const kpiCards = [
  // ... cards existentes
  {
    title: 'Nueva Métrica',
    value: metrics.nuevaMetrica.toString(),
    icon: 'analytics',
    color: Colors.info
  }
];
```

---

## 📋 **CHECKLIST ANTES DE HACER CAMBIOS**

### **✅ VERIFICACIONES OBLIGATORIAS**
- [ ] ¿Lei el contexto completo en `AI_PROJECT_PROMPT.md`?
- [ ] ¿El cambio respeta la arquitectura existente?
- [ ] ¿Estoy usando los stores de Zustand correctos?
- [ ] ¿Los estilos usan `GlobalStyles.ts`?
- [ ] ¿La navegación usa Expo Router?
- [ ] ¿Los tipos están definidos correctamente?
- [ ] ¿El cambio es compatible con código existente?

### **✅ DESPUÉS DEL CAMBIO**
- [ ] ¿El código compila sin errores?
- [ ] ¿Los lints están limpios? (`read_lints`)
- [ ] ¿La funcionalidad es demostrable?
- [ ] ¿Se mantiene la UX profesional?
- [ ] ¿Las métricas se actualizan si es necesario?

---

## 🎪 **CASOS DE USO PARA DEMO INVERSIONISTAS**

### **🎯 1. DEMOSTRAR FLUJO COMPLETO**
```typescript
// Secuencia para impresionar inversionistas
const demoSequence = [
  'Abrir app como paciente',
  'Buscar doctor en mapa',
  'Solicitar visita domiciliaria',
  'Mostrar tracking en tiempo real',
  'Simular llegada del doctor',
  'Completar servicio con rating',
  'Mostrar dashboard de inversionistas',
  'Ver métricas y proyecciones',
  'Demostrar ROI potencial'
];
```

### **📊 2. MÉTRICAS IMPRESIONANTES**
```typescript
// Datos que convencen a inversionistas
const convincingMetrics = {
  marketSize: '28M habitantes Venezuela',
  competition: 'Cero competencia directa',
  growthRate: '15% mensual proyectado',
  commissionModel: '15% sin costos fijos',
  roi: '20x-50x en 24 meses',
  technology: 'React Native + FastAPI + PostgreSQL'
};
```

---

## 💡 **PROMPTS RECOMENDADOS PARA IA**

### **🎯 DESARROLLO DE FEATURES**
```
"Necesito agregar [funcionalidad específica] siguiendo la arquitectura 
de DoctorBox. Usar [store específico] y mantener compatibilidad con 
[componente existente]. El objetivo es [propósito para inversionistas]."
```

### **🐛 DEBUGGING**
```
"Hay un error en [componente específico] de DoctorBox. El error es 
[descripción]. Necesito mantener la funcionalidad [requerimiento] 
y asegurar que [flujo de demo] siga funcionando."
```

### **📊 MÉTRICAS Y ANALYTICS**
```
"Agregar nueva métrica [nombre] al dashboard de inversionistas de DoctorBox. 
Debe calcularse desde [fuente de datos] y mostrarse en [ubicación]. 
El objetivo es demostrar [valor de negocio]."
```

### **🎨 MEJORAS DE UI/UX**
```
"Mejorar la UI de [componente] en DoctorBox para impresionar inversionistas. 
Mantener el estilo de GlobalStyles.ts y asegurar que [flujo específico] 
se vea profesional y pulido."
```

---

## 🎯 **OBJETIVOS FINALES RECORDATORIOS**

### **💼 PARA INVERSIONISTAS**
- Demo fluido y profesional
- Métricas convincentes visibles
- ROI claro y demostrable
- Diferenciación vs competencia evidente
- Potencial de escala obvio

### **🛠️ PARA DESARROLLO**
- Código limpio y escalable
- Arquitectura sólida y consistente
- Funcionalidades core completas
- UX/UI nivel producción
- Performance optimizada

### **📊 PARA NEGOCIO**
- Modelo de ingresos claro
- Métricas de tracción reales
- Proyecciones financieras sólidas
- Ventajas competitivas definidas
- Estrategia de crecimiento evidente

---

**🚀 RECUERDA: Cada línea de código debe contribuir a demostrar que DoctorBox es la próxima gran oportunidad de inversión en HealthTech para Latinoamérica.**
