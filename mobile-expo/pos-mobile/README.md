# POS Mobile App

Aplicación móvil para el sistema de punto de venta (POS) desarrollada con Expo y React Native.

## Configuración del entorno

### Variables de entorno

La aplicación utiliza variables de entorno para configurar la conexión con Supabase y otras APIs. Para configurar estas variables:

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza los valores con tus propias credenciales:
   ```
   EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

### Configuración de Supabase para diferentes dispositivos

La URL de Supabase debe configurarse de manera diferente según el dispositivo que estés utilizando:

#### Emulador Android
```
EXPO_PUBLIC_SUPABASE_URL=http://10.0.2.2:54321
```

#### Simulador iOS
```
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
```

#### Dispositivo físico
Debes usar la dirección IP de tu computadora en la red local:
```
EXPO_PUBLIC_SUPABASE_URL=http://192.168.1.X:54321
```
Reemplaza `192.168.1.X` con la IP real de tu computadora. Puedes encontrarla con:
- Windows: Ejecuta `ipconfig` en CMD y busca "IPv4 Address"
- Mac/Linux: Ejecuta `ifconfig` en Terminal y busca "inet" (no "inet6")

También puedes usar nuestro script para encontrar tu IP local:
```bash
npm run find-ip
# o
yarn find-ip
```

#### Usando ngrok (recomendado para dispositivos físicos)
Puedes usar ngrok para exponer tu servidor Supabase local a internet y hacerlo accesible desde cualquier dispositivo:

1. Asegúrate de tener ngrok instalado (https://ngrok.com/download)
2. Configura la ruta a ngrok en `scripts/supabase-ngrok.js` (por defecto es `C:\\ngrok\\ngrok.exe`)
3. Ejecuta el script:
```bash
npm run supabase-ngrok
# o
yarn supabase-ngrok
```
4. El script iniciará ngrok, obtendrá la URL pública y actualizará automáticamente tu archivo `.env`
5. Reinicia tu aplicación Expo para que tome la nueva URL

También puedes iniciar ngrok y Expo al mismo tiempo:
```bash
npm run start-with-ngrok
# o
yarn start-with-ngrok
```

#### Supabase en la nube
Si estás usando Supabase en la nube (no localmente), usa la URL proporcionada por Supabase:
```
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
```

### Supabase

La aplicación utiliza Supabase para la autenticación y el almacenamiento de datos. Para configurar Supabase:

1. Crea una cuenta en [Supabase](https://supabase.io/)
2. Crea un nuevo proyecto
3. Obtén la URL y la clave anónima de tu proyecto
4. Configura estas credenciales en el archivo `.env`

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar la aplicación en modo desarrollo
npm start
```

## Desarrollo

### Estructura del proyecto

- `app/`: Pantallas de la aplicación (usando Expo Router)
- `components/`: Componentes reutilizables
  - `auth/`: Componentes de autenticación
  - `pos/`: Componentes del punto de venta
  - `ui/`: Componentes de interfaz de usuario
- `services/`: Servicios para interactuar con APIs y Supabase
- `config/`: Archivos de configuración
- `constants/`: Constantes utilizadas en la aplicación
- `assets/`: Recursos estáticos (imágenes, fuentes, etc.)
- `constants/`: Constantes y configuración
- `hooks/`: Hooks personalizados
- `scripts/`: Scripts de utilidad

### Autenticación

La aplicación utiliza Supabase para la autenticación. Los servicios de autenticación se encuentran en `services/auth.ts`.

### Modo de demostración

La aplicación incluye un modo de demostración que permite probar las funcionalidades sin necesidad de registrarse. Para acceder al modo de demostración, utiliza las siguientes credenciales:

- Email: `demo@free.com` (plan gratuito) o `demo@premium.com` (plan premium)
- Contraseña: `123456`

## Requisitos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- Expo Go (aplicación móvil para probar la app)

## Ejecución

Hay varias formas de ejecutar la aplicación:

### Modo estándar (LAN)

```bash
npm start
# o
yarn start
```

### Modo tunnel (para acceder desde redes externas)

```bash
npm run start-tunnel
# o
yarn start-tunnel
```

### Modo offline (sin conexión a internet)

```bash
npm run start-offline
# o
yarn start-offline
```

### Limpiar caché y reiniciar

Si tienes problemas con la aplicación, puedes limpiar la caché y reiniciar:

```bash
npm run start-clear
# o
yarn start-clear
```

### Reinicio completo

Para un reinicio completo (limpia caché, reinstala dependencias y reinicia):

```bash
npm run reset-app
# o
yarn reset-app
```

## Solución de problemas

### Error "TypeError: fetch failed"

Este error puede ocurrir cuando hay problemas de conexión con los servidores de Expo. Prueba las siguientes soluciones:

1. Ejecuta la aplicación en modo offline:
   ```bash
   npm run start-offline
   ```

2. Limpia la caché y reinicia:
   ```bash
   npm run start-clear
   ```

3. Reinicia completamente la aplicación:
   ```bash
   npm run reset-app
   ```

### Problemas con ngrok

#### Error "address already in use"

Este error ocurre cuando ya hay una instancia de ngrok ejecutándose. Para solucionarlo:

1. Cierra todas las ventanas de terminal donde se esté ejecutando ngrok
2. En Windows, abre el Administrador de tareas y finaliza cualquier proceso de ngrok
3. Intenta ejecutar el script nuevamente

#### Error "tunnel session failed"

Este error puede ocurrir si has excedido el límite de sesiones de ngrok en la cuenta gratuita. Para solucionarlo:

1. Espera unos minutos e intenta nuevamente
2. Reinicia tu computadora
3. Considera actualizar a una cuenta de pago si necesitas usar ngrok con frecuencia

#### La URL de ngrok no funciona en la aplicación

Si la aplicación no puede conectarse a la URL de ngrok:

1. Asegúrate de que la URL en el archivo `.env` comienza con `https://` (no `http://`)
2. Reinicia la aplicación Expo después de actualizar el archivo `.env`
3. Verifica que ngrok sigue ejecutándose (la ventana de terminal debe estar abierta)
4. Intenta generar una nueva URL de ngrok ejecutando el script nuevamente

### Error "Too many screens defined"

Este error puede ocurrir cuando hay rutas duplicadas en la configuración de navegación. Asegúrate de que no haya rutas duplicadas en los archivos `_layout.tsx`.

## Estructura del proyecto

- `app/`: Contiene las pantallas y la configuración de navegación
  - `(tabs)/`: Pestañas principales de la aplicación
  - `auth/`: Pantallas de autenticación
  - `pos/`: Pantallas del punto de venta
- `components/`: Componentes reutilizables
  - `auth/`: Componentes de autenticación
  - `pos/`: Componentes del punto de venta
  - `ui/`: Componentes de interfaz de usuario
- `assets/`: Recursos estáticos (imágenes, fuentes, etc.)
- `constants/`: Constantes y configuración
- `hooks/`: Hooks personalizados
- `scripts/`: Scripts de utilidad
- `config/`: Archivos de configuración

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.