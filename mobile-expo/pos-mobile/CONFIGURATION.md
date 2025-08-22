# 📱 Configuración de BoxDoctor Mobile

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto móvil con las siguientes variables:

```bash
# ========================================
# CONFIGURACIÓN DE ENTORNO - BOXDOCTOR MOBILE
# ========================================

# ========================================
# API CONFIGURATION
# ========================================

# URL base de la API del backend
# Para emulador Android (usar 10.0.2.2)
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8001/api/v1

# Para iOS Simulator (usar localhost)
# EXPO_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1

# Para dispositivos físicos (reemplazar con tu IP local)
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.X:8001/api/v1

# Para desarrollo web
# EXPO_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1

# ========================================
# AUTHENTICATION & SECURITY
# ========================================

# Clave secreta para JWT (debe coincidir con el backend)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Tiempo de expiración del token JWT
JWT_EXPIRES_IN=7d

# ========================================
# APP CONFIGURATION
# ========================================

# URL del sitio web principal
EXPO_PUBLIC_SITE_URL=https://boxdoctor.com

# URL para desarrollo local
EXPO_PUBLIC_DEV_URL=http://localhost:3000

# ========================================
# FEATURE FLAGS
# ========================================

# Habilitar modo de desarrollo
EXPO_PUBLIC_DEV_MODE=true

# Habilitar logs de depuración
EXPO_PUBLIC_DEBUG_LOGS=true

# ========================================
# ENVIRONMENT
# ========================================

# Entorno de ejecución
NODE_ENV=development
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

## 🔧 Configuración del Backend

### Requisitos del Backend

El backend debe estar ejecutándose en el puerto `8001` y debe tener los siguientes endpoints disponibles:

#### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/logout` - Cierre de sesión
- `GET /api/v1/auth/me` - Obtener usuario actual
- `PUT /api/v1/auth/profile` - Actualizar perfil
- `POST /api/v1/auth/refresh` - Refrescar token

#### Citas Médicas
- `GET /api/v1/appointments` - Listar citas
- `POST /api/v1/appointments` - Crear cita
- `GET /api/v1/appointments/:id` - Obtener cita
- `PUT /api/v1/appointments/:id` - Actualizar cita
- `DELETE /api/v1/appointments/:id` - Eliminar cita

#### Pacientes
- `GET /api/v1/patients` - Listar pacientes
- `POST /api/v1/patients` - Crear paciente
- `GET /api/v1/patients/:id` - Obtener paciente
- `PUT /api/v1/patients/:id` - Actualizar paciente
- `DELETE /api/v1/patients/:id` - Eliminar paciente

#### Consultas
- `GET /api/v1/consultations` - Listar consultas
- `POST /api/v1/consultations` - Crear consulta
- `GET /api/v1/consultations/:id` - Obtener consulta
- `PUT /api/v1/consultations/:id` - Actualizar consulta

#### Recetas
- `GET /api/v1/prescriptions` - Listar recetas
- `POST /api/v1/prescriptions` - Crear receta
- `GET /api/v1/prescriptions/:id` - Obtener receta
- `PUT /api/v1/prescriptions/:id` - Actualizar receta

#### Chat
- `GET /api/v1/chat/conversations` - Listar conversaciones
- `POST /api/v1/chat/conversations` - Crear conversación
- `GET /api/v1/chat/conversations/:id/messages` - Obtener mensajes
- `POST /api/v1/chat/conversations/:id/messages` - Enviar mensaje

#### Pagos
- `GET /api/v1/payments` - Listar pagos
- `POST /api/v1/payments` - Crear pago
- `GET /api/v1/payments/methods` - Listar métodos de pago
- `POST /api/v1/payments/methods` - Agregar método de pago

## 🚀 Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Ejecutar en desarrollo
```bash
# Emulador Android
npm run android

# Simulador iOS
npm run ios

# Desarrollo web
npm run web
```

## 🔍 Depuración

### Logs de Configuración
Los logs de configuración se muestran automáticamente en desarrollo cuando `EXPO_PUBLIC_DEBUG_LOGS=true`:

```
📱 ========================================
📱 CONFIGURACIÓN DE ENTORNO - BOXDOCTOR MOBILE
📱 ========================================
📱 Entorno de ejecución: bare
📱 Plataforma: android
📱 Dispositivo Android Emulator: true
📱 Dispositivo iOS Simulator: false
📱 Dispositivo Físico: false
📱 Web: false
🔌 API Base URL: http://10.0.2.2:8001/api/v1
🔌 Site URL: https://boxdoctor.com
🔌 Dev URL: http://localhost:3000
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
1. Verifica que el backend esté ejecutándose en el puerto correcto
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

## 📝 Notas Importantes

- Las variables con prefijo `EXPO_PUBLIC_` son accesibles en el cliente
- Las variables sin prefijo son solo para el servidor
- El puerto 8001 debe coincidir con tu backend
- `JWT_SECRET` debe ser el mismo que en tu backend
- Para dispositivos físicos, cambia la IP en `EXPO_PUBLIC_API_BASE_URL`
