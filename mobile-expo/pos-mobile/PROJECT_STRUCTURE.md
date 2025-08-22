# 📁 **ESTRUCTURA COMPLETA DEL PROYECTO DOCTORBOX**
## Referencia Rápida de Archivos y Rutas

---

## 🎯 **RESUMEN EJECUTIVO**
Este documento lista **TODOS** los archivos importantes del proyecto DoctorBox MVP para que cualquier IA pueda navegar y entender la estructura completa sin perderse.

---

## 📱 **APLICACIÓN MÓVIL (React Native + Expo)**

### **🗂️ Estructura Principal**
```
mobile-expo/pos-mobile/
├── 📄 package.json                    # Dependencias del proyecto
├── 📄 tsconfig.json                   # Configuración TypeScript
├── 📄 app.json                        # Configuración Expo
├── 📄 expo-env.d.ts                   # Tipos de Expo
│
├── 📄 AI_PROJECT_PROMPT.md            # 🤖 CONTEXTO COMPLETO PARA IA
├── 📄 AI_INTERACTION_GUIDE.md         # 🤖 GUÍA DE INTERACCIÓN
├── 📄 PROJECT_STRUCTURE.md            # 📁 ESTE ARCHIVO
├── 📄 PITCH_INVERSIONISTAS.md         # 💼 PRESENTACIÓN EJECUTIVA
│
├── 📂 app/                            # 🧭 NAVEGACIÓN (Expo Router v3)
├── 📂 components/                     # 🧩 COMPONENTES REACT NATIVE
├── 📂 store/                          # 🗄️ ESTADO GLOBAL (Zustand)
├── 📂 services/                       # 🌐 APIS Y SERVICIOS
├── 📂 constants/                      # 🎨 ESTILOS Y CONSTANTES
├── 📂 hooks/                          # 🪝 HOOKS PERSONALIZADOS
├── 📂 utils/                          # 🛠️ UTILIDADES
├── 📂 config/                         # ⚙️ CONFIGURACIÓN
└── 📂 assets/                         # 🖼️ IMÁGENES Y RECURSOS
```

---

## 🧭 **NAVEGACIÓN (app/)**

### **📱 Rutas Principales**
```
app/
├── 📄 _layout.tsx                     # Layout raíz con providers
├── 📄 index.tsx                       # Splash screen + redirección
├── 📄 landing.tsx                     # Landing público (marketplace)
├── 📄 landing-old.tsx                 # Backup del landing original
│
├── 📂 auth/                           # 🔐 AUTENTICACIÓN
│   ├── 📄 _layout.tsx                 # Layout de auth
│   ├── 📄 login.tsx                   # Pantalla de login
│   └── 📄 register.tsx                # Pantalla de registro
│
└── 📂 (drawer)/                       # 🗂️ NAVEGACIÓN PRINCIPAL
    ├── 📄 _layout.tsx                 # Drawer navigation + AuthGuard
    ├── 📄 about.tsx                   # Información médica de DoctorBox
    ├── 📄 help.tsx                    # FAQ y ayuda médica
    ├── 📄 explore.tsx                 # Centro de recursos médicos
    ├── 📄 profile.tsx                 # Perfil de usuario
    └── 📄 settings.tsx                # Configuración
    │
    └── 📂 (tabs)/                     # 📋 TABS PRINCIPALES
        ├── 📄 _layout.tsx             # Tab navigation + BottomDrawer
        ├── 📄 index.tsx               # 🏠 DASHBOARD + MARKETPLACE
        ├── 📄 appointments.tsx        # 📅 Gestión de citas médicas
        ├── 📄 patients.tsx            # 👥 Pacientes/Perfil médico
        └── 📄 chat.tsx                # 💬 Chat médico completo
```

### **🎯 Rutas Clave para Demo**
- **`/`** → Splash + redirección inteligente
- **`/landing`** → Landing marketplace médico
- **`/auth/login`** → Login médico
- **`/(drawer)/(tabs)`** → Dashboard principal
- **`/(drawer)/(tabs)/index`** → **PANTALLA PRINCIPAL CON MARKETPLACE**
- **`/(drawer)/(tabs)/chat`** → Chat médico completo

---

## 🧩 **COMPONENTES (components/)**

### **🔐 Autenticación**
```
components/auth/
├── 📄 AuthGuard.tsx                   # Protección de rutas
└── 📄 LoginScreen.tsx                 # Componente de login
```

### **📊 Dashboards por Rol**
```
components/dashboard/
├── 📄 DoctorDashboard.tsx             # Dashboard para doctores
└── 📄 PatientDashboard.tsx            # Dashboard para pacientes
```

### **📍 Sistema de Geolocalización**
```
components/location/
├── 📄 DoctorMapSearch.tsx             # 🗺️ BÚSQUEDA CON GOOGLE MAPS
└── 📄 MedicalServiceRequest.tsx       # 📋 SOLICITUD TIPO UBER
```

### **📱 Tracking en Tiempo Real**
```
components/tracking/
└── 📄 ServiceTracker.tsx              # 🚚 TRACKING COMO DELIVERY
```

### **💼 Dashboard de Inversionistas**
```
components/investor/
└── 📄 InvestorDashboard.tsx           # 📈 MÉTRICAS Y PROYECCIONES
```

### **💬 Chat Médico Completo**
```
components/chat/
├── 📄 MedicalChatInterface.tsx        # Interfaz principal de chat
├── 📄 MessageBubble.tsx               # Burbujas de mensajes
├── 📄 MessageComposer.tsx             # Compositor con attachments
├── 📄 VoiceRecorder.tsx               # Grabadora de audio
└── 📄 VoiceMessagePlayer.tsx          # Reproductor de audio
```

### **📅 Gestión de Citas**
```
components/appointments/
└── 📄 AppointmentScheduler.tsx        # Programador de citas
```

### **💳 Sistema de Pagos**
```
components/payments/
├── 📄 PaymentProofUploader.tsx        # Subida de comprobantes
└── 📄 PaymentValidationPanel.tsx      # Validación para doctores
```

### **🔔 Notificaciones**
```
components/notifications/
├── 📄 NotificationBell.tsx            # Campana con contador
└── 📄 NotificationPanel.tsx           # Panel de notificaciones
```

### **🎨 UI Base**
```
components/ui/
├── 📄 Header.tsx                      # Header principal con notificaciones
├── 📄 CustomTabBar.tsx                # Tab bar personalizada
├── 📄 BottomDrawer.tsx                # Menú central flotante
├── 📄 CustomStatusBar.tsx             # Status bar personalizada
├── 📄 LoadingSpinner.tsx              # Spinner de carga
└── 📄 ThemeToggle.tsx                 # Toggle de tema
```

---

## 🗄️ **ESTADO GLOBAL (store/)**

### **📋 Stores de Zustand**
```
store/
├── 📄 appStore.ts                     # 👤 Usuario, auth, navegación
├── 📄 locationStore.ts                # 📍 Geolocalización y doctores
├── 📄 serviceTrackingStore.ts         # 🚚 Tracking de servicios
├── 📄 chatStore.ts                    # 💬 Conversaciones médicas
├── 📄 medicalStore.ts                 # 🏥 Lógica médica y pagos
└── 📄 notificationStore.ts            # 🔔 Notificaciones
```

### **🎯 Stores Clave para Demo**
- **`appStore.ts`** → Estado de usuario y navegación
- **`locationStore.ts`** → Geolocalización y búsqueda de doctores
- **`serviceTrackingStore.ts`** → **TRACKING Y MÉTRICAS PARA INVERSIONISTAS**

---

## 🌐 **SERVICIOS Y APIS (services/)**

### **📡 Servicios HTTP**
```
services/
├── 📄 api.ts                          # Cliente HTTP base
├── 📄 auth.ts                         # Autenticación
├── 📄 appointments.ts                 # Citas médicas
├── 📄 chat.ts                         # Chat y mensajería
├── 📄 patients.ts                     # Gestión de pacientes
├── 📄 health.ts                       # Servicios de salud
├── 📄 businesses.ts                   # Negocios médicos
├── 📄 customers.ts                    # Clientes
├── 📄 inventory.ts                    # Inventario médico
├── 📄 products.ts                     # Productos médicos
└── 📄 subscriptions.ts                # Suscripciones
```

---

## 🎨 **ESTILOS Y CONSTANTES (constants/)**

### **📐 Diseño Global**
```
constants/
├── 📄 Colors.ts                       # Paleta de colores
├── 📄 GlobalStyles.ts                 # 🎨 ESTILOS GLOBALES PRINCIPALES
├── 📄 api.ts                          # URLs y configuración API
└── 📄 index.ts                        # Exports centralizados
```

### **🎯 Archivo Clave**
- **`GlobalStyles.ts`** → **TODOS LOS ESTILOS DEBEN USAR ESTE ARCHIVO**

---

## 🪝 **HOOKS PERSONALIZADOS (hooks/)**

### **🔧 Hooks Útiles**
```
hooks/
├── 📄 useLogout.ts                    # Logout seguro con limpieza
├── 📄 useAppointments.ts              # Gestión de citas
├── 📄 useAuth.ts                      # Autenticación
├── 📄 useBusinesses.ts                # Negocios médicos
├── 📄 useChat.ts                      # Chat médico
├── 📄 useCustomers.ts                 # Clientes
├── 📄 useInventory.ts                 # Inventario
├── 📄 usePatients.ts                  # Pacientes
├── 📄 useProducts.ts                  # Productos
└── 📄 useSubscriptions.ts             # Suscripciones
```

---

## 🛠️ **UTILIDADES (utils/)**

### **🔧 Herramientas**
```
utils/
├── 📄 debugUtils.ts                   # 🐛 Herramientas de debug
├── 📄 api-helpers.ts                  # Helpers para APIs
├── 📄 auth-helpers.ts                 # Helpers de autenticación
└── 📄 helpers.ts                      # Utilidades generales
```

---

## ⚙️ **CONFIGURACIÓN (config/)**

### **📋 Configuración**
```
config/
├── 📄 env.ts                          # Variables de entorno
└── 📄 i18n.ts                         # Internacionalización
```

---

## 🔧 **BACKEND (FastAPI + PostgreSQL)**

### **🗂️ Estructura Backend**
```
fastapi_backend/
├── 📄 requirements.txt                # Dependencias Python
├── 📄 alembic.ini                     # Configuración migraciones
├── 📄 migration_fix.sql               # Fix de migraciones
│
├── 📂 app/                            # Aplicación principal
│   ├── 📄 main.py                     # FastAPI app
│   ├── 📄 dependencies.py             # Dependencias
│   ├── 📄 create_db.py                # Creación de DB
│   │
│   ├── 📂 api/v1/                     # APIs REST v1
│   │   ├── 📄 api.py                  # Router principal
│   │   └── 📂 endpoints/              # Endpoints específicos
│   │       ├── 📄 auth.py             # Autenticación
│   │       ├── 📄 appointments.py     # Citas médicas
│   │       ├── 📄 chat.py             # Chat médico
│   │       ├── 📄 patients.py         # Pacientes
│   │       ├── 📄 users.py            # Usuarios
│   │       ├── 📄 businesses.py       # Negocios
│   │       ├── 📄 customers.py        # Clientes
│   │       ├── 📄 dashboard.py        # Dashboard
│   │       ├── 📄 inventory.py        # Inventario
│   │       ├── 📄 product.py          # Productos
│   │       ├── 📄 stock_transfer.py   # Transferencias
│   │       └── 📄 subscription.py     # Suscripciones
│   │
│   ├── 📂 models/                     # Modelos SQLAlchemy
│   │   ├── 📄 user.py                 # Usuario base
│   │   ├── 📄 patient.py              # Paciente
│   │   ├── 📄 appointment.py          # Citas médicas
│   │   ├── 📄 chat.py                 # Mensajes
│   │   ├── 📄 conversation.py         # Conversaciones
│   │   ├── 📄 business.py             # Negocios
│   │   ├── 📄 customer.py             # Clientes
│   │   ├── 📄 inventory.py            # Inventario
│   │   ├── 📄 product.py              # Productos
│   │   └── 📄 subscription.py         # Suscripciones
│   │
│   ├── 📂 schemas/                    # Esquemas Pydantic
│   │   ├── 📄 auth.py                 # Autenticación
│   │   ├── 📄 appointment.py          # Citas
│   │   ├── 📄 patient.py              # Pacientes
│   │   ├── 📄 chat.py                 # Chat
│   │   ├── 📄 business.py             # Negocios
│   │   ├── 📄 customer.py             # Clientes
│   │   ├── 📄 dashboard.py            # Dashboard
│   │   ├── 📄 inventory.py            # Inventario
│   │   ├── 📄 product.py              # Productos
│   │   ├── 📄 subscription.py         # Suscripciones
│   │   └── 📄 user.py                 # Usuarios
│   │
│   ├── 📂 services/                   # Lógica de negocio
│   │   ├── 📄 appointment_service.py  # Servicios de citas
│   │   ├── 📄 chat_service.py         # Servicios de chat
│   │   ├── 📄 patient_service.py      # Servicios de pacientes
│   │   ├── 📄 user_service.py         # Servicios de usuarios
│   │   ├── 📄 business_service.py     # Servicios de negocios
│   │   ├── 📄 customer_service.py     # Servicios de clientes
│   │   ├── 📄 dashboard_service.py    # Servicios de dashboard
│   │   ├── 📄 inventory_service.py    # Servicios de inventario
│   │   ├── 📄 product_service.py      # Servicios de productos
│   │   └── 📄 subscription_service.py # Servicios de suscripciones
│   │
│   ├── 📂 core/                       # Configuración core
│   │   ├── 📄 config.py               # Configuración
│   │   ├── 📄 security.py             # Seguridad JWT
│   │   └── 📄 auth.py                 # Autenticación
│   │
│   ├── 📂 db/                         # Base de datos
│   │   ├── 📄 session.py              # Sesión DB
│   │   └── 📄 base.py                 # Base models
│   │
│   └── 📂 crud/                       # CRUD operations
│       └── 📄 base.py                 # CRUD base
│
├── 📂 alembic/                        # Migraciones
│   ├── 📄 env.py                      # Configuración Alembic
│   └── 📂 versions/                   # Versiones de migración
│       ├── 📄 6e74ff0b0345_initial_migration.py
│       ├── 📄 eb37a6aecf50_create_initial_schema_manually.py
│       └── 📄 1a2b3c4d5e6f_add_medical_appointment_models.py
│
└── 📂 tests/                          # Tests
    ├── 📄 conftest.py                 # Configuración tests
    └── 📄 test_api.py                 # Tests de API
```

---

## 🌐 **FRONTEND WEB (Next.js + TypeScript)**

### **🗂️ Estructura Web**
```
sass_front/
├── 📄 package.json                    # Dependencias web
├── 📄 next.config.js                  # Configuración Next.js
├── 📄 tsconfig.json                   # TypeScript config
├── 📄 middleware.ts                   # Middleware Next.js
├── 📄 i18n.ts                         # Internacionalización
│
├── 📂 app/                            # Next.js App Router
│   ├── 📄 globals.css                 # Estilos globales
│   ├── 📄 fonts.ts                    # Fuentes
│   ├── 📄 layout.tsx                  # Layout raíz
│   │
│   └── 📂 [locale]/                   # Rutas internacionalizadas
│       ├── 📄 page.tsx                # Landing web
│       ├── 📄 ClientLayoutWrapper.tsx # Wrapper cliente
│       │
│       ├── 📂 auth/                   # Autenticación web
│       │   ├── 📂 callback/
│       │   └── 📂 reset_password/
│       │
│       ├── 📂 account/                # Dashboard web
│       │   ├── 📄 page.tsx            # Panel principal
│       │   ├── 📄 layout.tsx          # Layout dashboard
│       │   ├── 📂 appointments/       # Gestión citas
│       │   ├── 📂 chat/               # Chat web
│       │   ├── 📂 patients/           # Gestión pacientes
│       │   ├── 📂 consultation/       # Consultas
│       │   ├── 📂 payments/           # Pagos
│       │   └── 📂 prescriptions/      # Recetas
│       │
│       ├── 📂 signin/                 # Login web
│       │   └── 📂 signup/             # Registro web
│       │
│       ├── 📂 about/                  # Acerca de
│       ├── 📂 security/               # Seguridad
│       └── 📂 blog/                   # Blog
│
├── 📂 components/                     # Componentes React
│   ├── 📄 Providers.tsx               # Providers globales
│   ├── 📄 ThemeRegistry.tsx           # Tema MUI
│   │
│   ├── 📂 ui/                         # Componentes UI
│   │   ├── 📄 AuthChecker.tsx         # Verificación auth
│   │   ├── 📄 DashboardLayout.tsx     # Layout dashboard
│   │   ├── 📄 LoadingSpinner.tsx      # Spinner
│   │   │
│   │   ├── 📂 AuthForms/              # Formularios auth
│   │   ├── 📂 Dashboard/              # Dashboard web
│   │   ├── 📂 Footer/                 # Footer
│   │   ├── 📂 Landing/                # Landing web
│   │   ├── 📂 LogoCloud/              # Logos
│   │   ├── 📂 Navbar/                 # Navegación
│   │   └── 📂 Pricing/                # Precios
│   │
│   └── 📂 icons/                      # Iconos
│       ├── 📄 index.ts                # Exports
│       └── 📄 Logo.tsx                # Logo
│
├── 📂 hooks/                          # Hooks web
│   ├── 📄 useAuth.ts                  # Autenticación
│   ├── 📄 useAppointments.ts          # Citas
│   ├── 📄 usePatients.ts              # Pacientes
│   ├── 📄 useChat.ts                  # Chat
│   ├── 📄 useBusinesses.ts            # Negocios
│   ├── 📄 useCustomers.ts             # Clientes
│   ├── 📄 useInventory.ts             # Inventario
│   ├── 📄 useProducts.ts              # Productos
│   └── 📄 useSubscriptions.ts         # Suscripciones
│
├── 📂 stores/                         # Estado Zustand web
│   ├── 📄 appStore.ts                 # Store principal
│   ├── 📄 appointmentStore.ts         # Citas
│   ├── 📄 consultationStore.ts        # Consultas
│   ├── 📄 patientStore.ts             # Pacientes
│   └── 📄 themeStore.ts               # Tema
│
├── 📂 lib/                            # Utilidades web
│   ├── 📄 apiClient.ts                # Cliente API
│   ├── 📄 MuiRegistry.tsx             # Registro MUI
│   ├── 📄 navigation.ts               # Navegación
│   └── 📂 theme/                      # Tema
│
├── 📂 utils/                          # Utilidades
│   ├── 📄 api.ts                      # API helpers
│   ├── 📄 api-helpers.ts              # Más helpers
│   ├── 📄 auth-helpers.ts             # Auth helpers
│   └── 📄 helpers.ts                  # Helpers generales
│
└── 📂 messages/                       # Traducciones
    ├── 📄 en.json                     # Inglés
    └── 📄 es.json                     # Español
```

---

## 🎯 **ARCHIVOS CRÍTICOS PARA DEMO**

### **📱 MOBILE - Archivos Clave**
1. **`app/(drawer)/(tabs)/index.tsx`** → **PANTALLA PRINCIPAL CON MARKETPLACE**
2. **`components/location/DoctorMapSearch.tsx`** → Búsqueda con Google Maps
3. **`components/location/MedicalServiceRequest.tsx`** → Solicitud tipo Uber
4. **`components/tracking/ServiceTracker.tsx`** → Tracking tiempo real
5. **`components/investor/InvestorDashboard.tsx`** → **DASHBOARD INVERSIONISTAS**
6. **`store/serviceTrackingStore.ts`** → **MÉTRICAS Y TRACKING**
7. **`store/locationStore.ts`** → Geolocalización y doctores

### **💼 DOCUMENTACIÓN PARA INVERSIONISTAS**
1. **`AI_PROJECT_PROMPT.md`** → **CONTEXTO COMPLETO PARA IA**
2. **`PITCH_INVERSIONISTAS.md`** → **PRESENTACIÓN EJECUTIVA**
3. **`AI_INTERACTION_GUIDE.md`** → Guía de uso para IA
4. **`PROJECT_STRUCTURE.md`** → Este archivo

### **🎨 ESTILOS Y CONFIGURACIÓN**
1. **`constants/GlobalStyles.ts`** → **TODOS LOS ESTILOS**
2. **`constants/Colors.ts`** → Paleta de colores
3. **`app/_layout.tsx`** → Layout raíz con providers
4. **`components/ui/Header.tsx`** → Header principal

---

## 🚀 **FLUJO DE NAVEGACIÓN PARA DEMO**

### **📱 Secuencia de Demo Inversionistas**
```
1. app/index.tsx (Splash)
   ↓
2. app/landing.tsx (Landing marketplace)
   ↓
3. app/auth/login.tsx (Login médico)
   ↓
4. app/(drawer)/(tabs)/index.tsx (Dashboard + Marketplace)
   ↓
5. DoctorMapSearch.tsx (Búsqueda GPS)
   ↓
6. MedicalServiceRequest.tsx (Solicitud Uber)
   ↓
7. ServiceTracker.tsx (Tracking tiempo real)
   ↓
8. InvestorDashboard.tsx (Métricas ROI)
```

### **🎯 Rutas Críticas**
- **`/(drawer)/(tabs)`** → Dashboard principal
- **`/(drawer)/(tabs)/index`** → **MARKETPLACE MÉDICO**
- **`/(drawer)/(tabs)/chat`** → Chat médico completo
- **`/(drawer)/(tabs)/appointments`** → Gestión de citas

---

## 💡 **COMANDOS ÚTILES PARA IA**

### **📋 Para Leer Archivos Clave**
```bash
# Leer contexto completo
read_file("mobile-expo/pos-mobile/AI_PROJECT_PROMPT.md")

# Leer pantalla principal
read_file("mobile-expo/pos-mobile/app/(drawer)/(tabs)/index.tsx")

# Leer store de tracking (métricas)
read_file("mobile-expo/pos-mobile/store/serviceTrackingStore.ts")

# Leer estilos globales
read_file("mobile-expo/pos-mobile/constants/GlobalStyles.ts")
```

### **🔍 Para Buscar Funcionalidades**
```bash
# Buscar implementación de marketplace
grep_search("marketplace", "mobile-expo/pos-mobile/")

# Buscar métricas de inversionistas
grep_search("investor", "mobile-expo/pos-mobile/")

# Buscar geolocalización
grep_search("location", "mobile-expo/pos-mobile/")
```

---

## 🎯 **RECORDATORIO FINAL**

### **📋 Para IA - Orden de Lectura**
1. **`AI_PROJECT_PROMPT.md`** → Contexto completo del proyecto
2. **`PROJECT_STRUCTURE.md`** → Este archivo (estructura)
3. **`AI_INTERACTION_GUIDE.md`** → Ejemplos de interacción
4. **`PITCH_INVERSIONISTAS.md`** → Contexto de negocio
5. **Código específico** → Según la tarea

### **🚀 Objetivo Final**
Cada archivo en este proyecto contribuye a demostrar que **DoctorBox es la próxima gran oportunidad de inversión en HealthTech para Latinoamérica**. 

**ROI proyectado: 20x-50x en 24 meses** 💰🚀
