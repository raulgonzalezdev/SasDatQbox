# 🤖 **AI PROJECT PROMPT - DOCTORBOX MVP**
## Documento Maestro para Contexto de IA

---

## 🎯 **CONTEXTO DEL PROYECTO**

Eres un asistente de IA especializado en desarrollo de software trabajando en **DoctorBox**, el primer marketplace médico con geolocalización de Venezuela. Este es un MVP completo tipo "Uber para servicios médicos" que conecta pacientes con doctores en tiempo real.

### **📱 VISIÓN DEL PRODUCTO**
DoctorBox es una plataforma digital que revoluciona el acceso a servicios médicos en Venezuela, permitiendo:
- **Pacientes**: Encontrar doctores cercanos por GPS, solicitar consultas (virtual/presencial/domiciliaria), hacer seguimiento en tiempo real
- **Doctores**: Recibir solicitudes, gestionar consultas, obtener pagos garantizados
- **Plataforma**: Generar ingresos por comisión (15% promedio) sin costos fijos para doctores

---

## 🏗️ **ARQUITECTURA TÉCNICA COMPLETA**

### **📱 FRONTEND - React Native + Expo**
```
mobile-expo/pos-mobile/
├── app/ (Expo Router v3)
│   ├── _layout.tsx (Root layout con providers)
│   ├── index.tsx (Splash screen con redirección)
│   ├── landing.tsx (Landing público para registro)
│   ├── landing-old.tsx (Backup del landing original)
│   │
│   ├── auth/ (Autenticación)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   └── (drawer)/ (Navegación principal protegida)
│       ├── _layout.tsx (Drawer navigation con AuthGuard)
│       ├── about.tsx (Información médica de la app)
│       ├── help.tsx (FAQ médico)
│       ├── explore.tsx (Centro de recursos médicos)
│       ├── profile.tsx
│       └── settings.tsx
│       │
│       └── (tabs)/ (Tabs principales)
│           ├── _layout.tsx (Tab navigation + BottomDrawer)
│           ├── index.tsx (Dashboard principal + Marketplace)
│           ├── appointments.tsx (Gestión de citas médicas)
│           ├── patients.tsx (Pacientes para doctores / Perfil para pacientes)
│           └── chat.tsx (Chat médico completo con video/audio/archivos)

├── components/
│   ├── auth/
│   │   ├── AuthGuard.tsx (Protección de rutas autenticadas)
│   │   └── LoginScreen.tsx
│   │
│   ├── dashboard/ (Dashboards específicos por rol)
│   │   ├── DoctorDashboard.tsx (Métricas y acciones para doctores)
│   │   └── PatientDashboard.tsx (Salud y doctores para pacientes)
│   │
│   ├── location/ (Sistema de geolocalización)
│   │   ├── DoctorMapSearch.tsx (Búsqueda con Google Maps)
│   │   └── MedicalServiceRequest.tsx (Solicitud tipo Uber)
│   │
│   ├── tracking/ (Seguimiento en tiempo real)
│   │   └── ServiceTracker.tsx (Estados del servicio como delivery)
│   │
│   ├── investor/ (Dashboard para inversionistas)
│   │   └── InvestorDashboard.tsx (KPIs, gráficos, proyecciones)
│   │
│   ├── chat/ (Sistema de comunicación médica)
│   │   ├── MedicalChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── VoiceRecorder.tsx
│   │   └── VoiceMessagePlayer.tsx
│   │
│   ├── appointments/ (Gestión de citas)
│   │   └── AppointmentScheduler.tsx
│   │
│   ├── payments/ (Sistema de pagos)
│   │   ├── PaymentProofUploader.tsx
│   │   └── PaymentValidationPanel.tsx
│   │
│   ├── notifications/ (Sistema de notificaciones)
│   │   ├── NotificationBell.tsx
│   │   └── NotificationPanel.tsx
│   │
│   └── ui/ (Componentes base)
│       ├── Header.tsx (Header principal con notificaciones)
│       ├── CustomTabBar.tsx (Tab bar personalizada)
│       ├── BottomDrawer.tsx (Menú central flotante)
│       └── CustomStatusBar.tsx

├── store/ (Estado global con Zustand + AsyncStorage)
│   ├── appStore.ts (Usuario, autenticación, navegación)
│   ├── chatStore.ts (Conversaciones médicas)
│   ├── locationStore.ts (Geolocalización y doctores)
│   ├── serviceTrackingStore.ts (Tracking de servicios)
│   ├── medicalStore.ts (Lógica médica y pagos)
│   └── notificationStore.ts (Notificaciones)

├── services/ (APIs y servicios externos)
│   ├── api.ts (Cliente HTTP)
│   ├── auth.ts (Autenticación)
│   ├── appointments.ts
│   ├── chat.ts
│   ├── patients.ts
│   └── health.ts

├── constants/
│   ├── Colors.ts
│   ├── GlobalStyles.ts (Spacing, Typography, Shadows)
│   └── api.ts

├── hooks/
│   └── useLogout.ts (Logout seguro con limpieza)

├── utils/
│   └── debugUtils.ts (Herramientas de debug)

└── config/
    ├── env.ts
    └── i18n.ts (Internacionalización ES/EN)
```

### **🔧 BACKEND - FastAPI + PostgreSQL**
```
fastapi_backend/
├── app/
│   ├── main.py (FastAPI app principal)
│   ├── api/v1/ (APIs RESTful)
│   │   ├── endpoints/
│   │   │   ├── auth.py (Autenticación JWT)
│   │   │   ├── appointments.py (Gestión de citas)
│   │   │   ├── chat.py (Conversaciones médicas)
│   │   │   ├── patients.py (Gestión de pacientes)
│   │   │   ├── users.py (Usuarios y roles)
│   │   │   ├── inventory.py (Inventario médico)
│   │   │   └── dashboard.py (Métricas y analytics)
│   │
│   ├── models/ (SQLAlchemy ORM)
│   │   ├── user.py (Usuario base con roles)
│   │   ├── patient.py (Pacientes)
│   │   ├── appointment.py (Citas médicas)
│   │   ├── chat.py (Mensajes)
│   │   ├── conversation.py (Conversaciones)
│   │   └── business.py (Negocios médicos)
│   │
│   ├── schemas/ (Pydantic models)
│   │   ├── auth.py
│   │   ├── appointment.py
│   │   ├── patient.py
│   │   └── chat.py
│   │
│   ├── services/ (Lógica de negocio)
│   │   ├── appointment_service.py
│   │   ├── chat_service.py
│   │   ├── patient_service.py
│   │   └── user_service.py
│   │
│   ├── core/
│   │   ├── config.py (Configuración)
│   │   ├── security.py (JWT, hashing)
│   │   └── auth.py (Middleware de autenticación)
│   │
│   └── db/
│       ├── session.py (Conexión DB)
│       └── base.py (Base models)
│
├── alembic/ (Migraciones DB)
│   ├── versions/
│   └── env.py
│
├── requirements.txt (Dependencias Python)
└── tests/ (Tests automatizados)
```

### **🌐 FRONTEND WEB - Next.js**
```
sass_front/
├── app/ (Next.js 14 App Router)
│   ├── [locale]/ (Internacionalización)
│   │   ├── page.tsx (Landing web)
│   │   ├── about/page.tsx
│   │   ├── security/page.tsx
│   │   │
│   │   ├── auth/ (Autenticación web)
│   │   │   ├── callback/route.ts
│   │   │   └── reset_password/route.ts
│   │   │
│   │   ├── account/ (Dashboard web)
│   │   │   ├── page.tsx (Panel principal)
│   │   │   ├── appointments/ (Gestión de citas)
│   │   │   ├── chat/ (Chat web)
│   │   │   ├── patients/ (Gestión de pacientes)
│   │   │   └── payments/ (Pagos)
│   │   │
│   │   └── signin/ (Login web)
│   │       └── signup/ (Registro web)
│   │
│   ├── globals.css (Estilos globales)
│   └── layout.tsx (Layout raíz)

├── components/ui/ (Componentes React)
│   ├── Dashboard/ (Dashboard web)
│   │   ├── AppointmentsTable.tsx
│   │   ├── PatientsTable.tsx
│   │   ├── ConversationList.tsx
│   │   └── VideoCallInterface.tsx
│   │
│   ├── AuthForms/ (Formularios de auth)
│   │   ├── EmailSignIn.tsx
│   │   ├── PasswordSignIn.tsx
│   │   └── Signup.tsx
│   │
│   └── Landing/ (Componentes del landing)
│       ├── Hero.tsx
│       ├── FeaturesSection.tsx
│       ├── Testimonials.tsx
│       └── FAQ.tsx

├── lib/ (Utilidades)
│   ├── apiClient.ts (Cliente HTTP)
│   └── theme/theme.ts (Tema MUI)

├── hooks/ (Hooks personalizados)
│   ├── useAuth.ts
│   ├── useAppointments.ts
│   └── usePatients.ts

├── stores/ (Estado global)
│   ├── appStore.ts
│   ├── appointmentStore.ts
│   └── patientStore.ts

├── next.config.js (Configuración Next.js)
└── package.json (Dependencias)
```

---

## 📊 **MODELO DE NEGOCIO Y DATOS**

### **💰 ESTRUCTURA DE INGRESOS**
```typescript
// Comisiones por tipo de servicio
const COMMISSION_RATES = {
  virtual: 0.12,        // 12% consultas virtuales
  in_person: 0.10,      // 10% consultas presenciales  
  home_visit: 0.18,     // 18% visitas domiciliarias
  emergency: 0.25       // 25% emergencias
};

// Precios promedio por servicio
const AVERAGE_PRICES = {
  virtual: 35,          // $35 USD promedio
  in_person: 55,        // $55 USD promedio
  home_visit: 85,       // $85 USD promedio
  emergency: 120        // $120 USD promedio
};
```

### **📈 MÉTRICAS CLAVE (KPIs)**
```typescript
interface BusinessMetrics {
  // Métricas de usuarios
  totalDoctors: number;           // Doctores registrados
  activeDoctors: number;          // Doctores activos (>1 consulta/mes)
  totalPatients: number;          // Pacientes registrados
  activePatients: number;         // Pacientes activos

  // Métricas de servicios
  totalServices: number;          // Servicios completados
  monthlyServices: number;        // Servicios del mes actual
  averageServiceTime: number;     // Tiempo promedio por servicio (min)
  completionRate: number;         // % servicios completados vs cancelados

  // Métricas financieras
  totalRevenue: number;           // Ingresos totales doctores
  platformRevenue: number;       // Comisiones de la plataforma
  monthlyRevenue: number;         // Ingresos del mes
  averageOrderValue: number;      // Valor promedio por servicio

  // Métricas de calidad
  averageRating: number;          // Rating promedio (1-5)
  npsScore: number;              // Net Promoter Score
  retentionRate: number;         // Retención de usuarios a 30 días
}
```

### **🎯 PROYECCIONES FINANCIERAS**
```typescript
// Escenario base (24 meses)
const FINANCIAL_PROJECTIONS = {
  month6: {
    doctors: 150,
    patients: 2000,
    monthlyServices: 800,
    monthlyRevenue: 12000,        // $12K USD
    platformRevenue: 1800         // $1.8K USD (15%)
  },
  month12: {
    doctors: 500,
    patients: 8000,
    monthlyServices: 4000,
    monthlyRevenue: 60000,        // $60K USD
    platformRevenue: 9000         // $9K USD (15%)
  },
  month24: {
    doctors: 1500,
    patients: 25000,
    monthlyServices: 15000,
    monthlyRevenue: 225000,       // $225K USD
    platformRevenue: 33750        // $33.7K USD (15%)
  }
};
```

---

## 🔄 **FLUJOS DE USUARIO PRINCIPALES**

### **👤 FLUJO PACIENTE (Solicitar Servicio)**
```typescript
1. Abrir app → Dashboard paciente
2. "Encontrar Doctor" → DoctorMapSearch component
3. Ver mapa con doctores cercanos (Google Maps API)
4. Aplicar filtros (especialidad, distancia, precio)
5. Seleccionar doctor → Ver perfil y reviews
6. "Solicitar Consulta" → MedicalServiceRequest modal
7. Elegir tipo (Virtual/Presencial/Domiciliaria)
8. Completar formulario (síntomas, urgencia, horario)
9. Confirmar precio estimado
10. Enviar solicitud → Crear en serviceTrackingStore
11. Tracking automático → ServiceTracker component
12. Recibir notificaciones de estado
13. Completar servicio → Rating y pago
```

### **👨‍⚕️ FLUJO DOCTOR (Aceptar Servicio)**
```typescript
1. Recibir notificación de solicitud
2. Ver detalles del paciente y síntomas
3. Aceptar/Rechazar solicitud
4. Si acepta → Actualizar ubicación (para domiciliaria)
5. Cambiar estado a "Preparando"
6. Para domiciliaria → "En camino" → GPS tracking
7. Llegar → "Consulta iniciada"
8. Completar consulta → Generar reporte
9. Finalizar → Rating del paciente
10. Recibir pago automático (menos comisión)
```

### **📊 FLUJO INVERSIONISTA (Ver Métricas)**
```typescript
1. Dashboard principal → "Dashboard Inversionistas"
2. Ver KPIs en tiempo real (InvestorDashboard)
3. Gráficos de crecimiento (react-native-chart-kit)
4. Proyecciones financieras → Modal detallado
5. Escenarios de inversión (Conservador/Moderado/Agresivo)
6. Métricas de mercado venezolano
7. Ventajas competitivas y oportunidad
8. ROI proyectado (20x-50x en 24 meses)
```

---

## 🛠️ **TECNOLOGÍAS Y DEPENDENCIAS**

### **📱 MOBILE (React Native + Expo)**
```json
{
  "expo": "^53.0.20",
  "react-native": "0.76.5",
  "expo-router": "~5.1.4",
  "@expo/vector-icons": "^14.1.0",
  "expo-location": "^18.0.4",
  "react-native-maps": "^1.18.0",
  "expo-av": "^15.0.1",
  "zustand": "^5.0.2",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "^15.8.0",
  "expo-image-picker": "^15.0.7",
  "expo-document-picker": "^12.0.2",
  "react-native-gesture-handler": "^2.20.2"
}
```

### **🔧 BACKEND (FastAPI + PostgreSQL)**
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.0
python-dotenv==1.0.0
```

### **🌐 WEB (Next.js + TypeScript)**
```json
{
  "next": "15.1.6",
  "react": "19.0.0",
  "@mui/material": "^6.3.0",
  "@next/third-parties": "^15.1.6",
  "zustand": "^5.0.2",
  "next-intl": "^4.0.9",
  "typescript": "^5.7.3"
}
```

---

## 🎯 **CASOS DE USO ESPECÍFICOS**

### **🚨 CASO: EMERGENCIA MÉDICA**
```typescript
// Flujo optimizado para emergencias
const emergencyFlow = {
  priority: 'HIGH',
  autoAccept: true,           // Auto-asignar doctor más cercano
  priceMultiplier: 2.0,       // Precio x2 por urgencia
  maxResponseTime: 300,       // 5 minutos máximo respuesta
  gpsTracking: true,          // Tracking obligatorio
  directCall: true            // Llamada directa doctor-paciente
};
```

### **🏠 CASO: VISITA DOMICILIARIA**
```typescript
// Lógica específica para visitas a casa
const homeVisitFlow = {
  requiresLocation: true,      // Ubicación del paciente obligatoria
  doctorRadius: 15,           // 15km radio máximo
  priceMultiplier: 1.5,       // Precio x1.5 por traslado
  estimatedTime: 45,          // 45 min promedio
  realTimeTracking: true,     // GPS en tiempo real
  arrivalConfirmation: true   // Confirmación de llegada
};
```

### **💻 CASO: CONSULTA VIRTUAL**
```typescript
// Configuración para telemedicina
const virtualConsultFlow = {
  videoCall: true,            // Videollamada integrada
  screenSharing: false,       // Compartir pantalla (futuro)
  recordSession: true,        // Grabar consulta (opcional)
  prescriptionGeneration: true, // Generar recetas digitales
  followUpReminders: true     // Recordatorios de seguimiento
};
```

---

## 📋 **INSTRUCCIONES PARA IA**

### **🎯 AL TRABAJAR CON ESTE PROYECTO:**

1. **CONTEXTO SIEMPRE PRESENTE**:
   - Eres un marketplace médico tipo Uber para Venezuela
   - Conectas pacientes con doctores por geolocalización
   - Modelo de comisión (15% promedio) sin costos fijos
   - MVP completo funcional para demo a inversionistas

2. **ARQUITECTURA ESTABLECIDA**:
   - Frontend: React Native + Expo Router + Zustand
   - Backend: FastAPI + PostgreSQL + SQLAlchemy
   - Web: Next.js + TypeScript + MUI
   - Todas las rutas y componentes están definidos arriba

3. **PRIORIDADES DE DESARROLLO**:
   - UX/UI profesional para impresionar inversionistas
   - Funcionalidades core completas y estables
   - Métricas y analytics visibles
   - Simulaciones realistas con datos mock
   - Código limpio y escalable

4. **RESTRICCIONES IMPORTANTES**:
   - Mantener estructura de carpetas existente
   - Usar Zustand para estado global (no Redux/Context)
   - Seguir patrones de Expo Router v3
   - Estilos consistentes con GlobalStyles.ts
   - Todas las funcionalidades deben ser demostrables

5. **AL HACER CAMBIOS**:
   - Siempre leer archivos existentes antes de modificar
   - Mantener compatibilidad con código existente
   - Actualizar stores de Zustand cuando sea necesario
   - Verificar linting con read_lints tool
   - Probar funcionalidades críticas

6. **DATOS MOCK IMPORTANTES**:
   - Usar datos realistas de Venezuela (Caracas, Valencia, Maracaibo)
   - Precios en USD (economía dolarizada)
   - Nombres y especialidades médicas locales
   - Métricas financieras convincentes para inversionistas

### **🚀 OBJETIVOS FINALES**:
- **Demo impecable** para presentar a inversionistas
- **Métricas convincentes** que muestren potencial de ROI 20x-50x
- **Flujos completos** desde solicitud hasta pago
- **Diferenciación clara** vs competencia (primer marketplace médico GPS)
- **Escalabilidad evidente** en arquitectura y modelo de negocio

---

## 💡 **EJEMPLOS DE PROMPTS EFECTIVOS**

### **✅ BUENOS PROMPTS**:
```
"Necesito agregar notificaciones push cuando un doctor acepta una solicitud. 
Usar el notificationStore existente y mostrar en NotificationBell component."

"El gráfico de ingresos en InvestorDashboard necesita mostrar proyección 
a 36 meses. Modificar getRevenueProjection en serviceTrackingStore."

"Agregar filtro por rating mínimo en DoctorMapSearch. Debe integrarse 
con locationStore.updateFilters y aplicarse en searchNearbyDoctors."
```

### **❌ PROMPTS PROBLEMÁTICOS**:
```
"Cambiar toda la arquitectura a Redux" (Mantener Zustand)
"Crear nueva estructura de carpetas" (Respetar existente)
"Usar Context API para estado" (Ya está implementado Zustand)
"Cambiar a Vue.js" (Proyecto es React Native)
```

---

## 📞 **INFORMACIÓN DE CONTACTO DEL PROYECTO**

- **Proyecto**: DoctorBox - Marketplace Médico Venezuela
- **Tipo**: MVP para presentación a inversionistas
- **Stack**: React Native + FastAPI + Next.js
- **Modelo**: Comisión por transacción (B2B2C)
- **Mercado**: Venezuela (28M habitantes, 45K doctores)
- **Objetivo**: Demostrar viabilidad técnica y potencial ROI

---

**🎯 RECUERDA: Este es un MVP completo y funcional diseñado para impresionar inversionistas y demostrar el potencial de un marketplace médico revolucionario en Venezuela. Cada funcionalidad debe ser profesional, estable y demostrativa del valor de negocio.**
