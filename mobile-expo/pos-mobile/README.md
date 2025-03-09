# POS Mobile

Aplicación móvil para punto de venta (POS) desarrollada con React Native y Expo.

## Requisitos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- Expo Go (aplicación móvil para probar la app)

## Instalación

1. Clona el repositorio
2. Navega al directorio del proyecto:
   ```bash
   cd mobile-expo/pos-mobile
   ```
3. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

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

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
