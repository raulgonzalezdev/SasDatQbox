# 📱 BoxDoctor Mobile App

Aplicación móvil para el sistema de telemedicina BoxDoctor desarrollada con Expo y React Native.

## 🎯 Descripción

BoxDoctor Mobile es una aplicación completa de telemedicina que permite a médicos y pacientes gestionar citas, consultas, recetas y comunicación en tiempo real. La aplicación está diseñada para funcionar tanto en dispositivos móviles como en web.

### 🏥 Funcionalidades Principales

#### Para Médicos:
- 📅 Gestión de citas médicas
- 👥 Administración de pacientes
- 💊 Creación y gestión de recetas
- 🎥 Consultas por videollamada
- 💬 Chat con pacientes
- 📊 Dashboard médico

#### Para Pacientes:
- 📅 Agendar citas médicas
- 🎥 Consultas virtuales
- 💬 Chat con médicos
- 💊 Historial de recetas
- 💳 Pagos desde la app
- 📱 Notificaciones push

## 🚀 Configuración del Entorno

### 1. Variables de Entorno

La aplicación utiliza variables de entorno para configurar la conexión con el backend. Para configurar estas variables:

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus configuraciones (ver `CONFIGURATION.md` para detalles completos):
   ```bash
   # API Configuration
   EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8001/api/v1
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # App Configuration
   EXPO_PUBLIC_SITE_URL=https://boxdoctor.com
   EXPO_PUBLIC_DEV_URL=http://localhost:3000
   
   # Feature Flags
   EXPO_PUBLIC_DEV_MODE=true
   EXPO_PUBLIC_DEBUG_LOGS=true
   ```

### 2. Configuración por Dispositivo

#### 📱 Emulador Android
```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8001/api/v1
```

#### 🍎 Simulador iOS
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1
```

#### 📱 Dispositivo Físico
```bash
# Reemplaza 192.168.1.X con tu IP local
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.X:8001/api/v1
```

#### 🌐 Desarrollo Web
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1
```

## 🔧 Requisitos del Backend

La aplicación requiere un backend ejecutándose en el puerto `8001` con los siguientes endpoints:

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/logout` - Cierre de sesión
- `GET /api/v1/auth/me` - Obtener usuario actual
- `PUT /api/v1/auth/profile` - Actualizar perfil

### Funcionalidades Médicas
- Citas médicas (`/api/v1/appointments`)
- Pacientes (`/api/v1/patients`)
- Consultas (`/api/v1/consultations`)
- Recetas (`/api/v1/prescriptions`)
- Chat (`/api/v1/chat`)
- Pagos (`/api/v1/payments`)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar la aplicación en modo desarrollo
npm start
```

## 🚀 Desarrollo

### Comandos Disponibles

```bash
# Iniciar Expo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web
npm run web

# Ejecutar en dispositivo físico
npm run device
```

### Estructura del Proyecto

```
mobile-expo/pos-mobile/
├── app/                    # Navegación y pantallas principales
│   ├── (tabs)/            # Navegación por pestañas
│   ├── auth/              # Pantallas de autenticación
│   └── landing.tsx        # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI
│   └── forms/            # Formularios
├── config/               # Configuración
│   └── env.ts            # Variables de entorno
├── constants/            # Constantes y endpoints
│   └── api.ts            # Endpoints de la API
├── services/             # Servicios
│   └── auth.ts           # Servicio de autenticación
├── store/                # Estado global (Zustand)
│   └── appStore.ts       # Store principal
└── assets/               # Recursos estáticos
```

## 🔍 Depuración

### Logs de Configuración
Los logs de configuración se muestran automáticamente en desarrollo:

```
📱 ========================================
📱 CONFIGURACIÓN DE ENTORNO - BOXDOCTOR MOBILE
📱 ========================================
📱 Entorno de ejecución: bare
📱 Plataforma: android
🔌 API Base URL: http://10.0.2.2:8001/api/v1
🔌 Site URL: https://boxdoctor.com
🔌 Dev Mode: true
🔌 Debug Logs: true
📱 ========================================
```

### Verificar Conexión
```javascript
import { checkApiConnection } from '../config/env';

const checkConnection = async () => {
  const result = await checkApiConnection();
  console.log('Conexión API:', result);
};
```

## 🛠️ Troubleshooting

### Error de Conexión
1. Verifica que el backend esté ejecutándose en el puerto 8001
2. Confirma que la IP en `.env` sea correcta para tu dispositivo
3. Verifica que no haya firewall bloqueando la conexión

### Error de Autenticación
1. Verifica que `JWT_SECRET` coincida con el backend
2. Confirma que los endpoints de autenticación estén disponibles
3. Revisa los logs del backend para errores

### Error en Dispositivo Físico
1. Asegúrate de usar tu IP local en `EXPO_PUBLIC_API_BASE_URL`
2. Verifica que el dispositivo y el servidor estén en la misma red
3. Confirma que el puerto 8001 esté abierto

## 📱 Características Técnicas

- **Framework**: React Native con Expo
- **Navegación**: Expo Router
- **Estado**: Zustand
- **Almacenamiento**: AsyncStorage
- **Autenticación**: JWT
- **API**: RESTful con fetch
- **UI**: React Native Paper
- **Iconos**: Expo Vector Icons

## 🔐 Seguridad

- Autenticación JWT
- Tokens de acceso y refresco
- Almacenamiento seguro en AsyncStorage
- Validación de entrada en formularios
- Headers de autorización en todas las peticiones

## 📄 Documentación Adicional

- [CONFIGURATION.md](./CONFIGURATION.md) - Configuración detallada
- [API Endpoints](./constants/api.ts) - Documentación de endpoints
- [Environment Variables](./config/env.ts) - Variables de entorno

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.