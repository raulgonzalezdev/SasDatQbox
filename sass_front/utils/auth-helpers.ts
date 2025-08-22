// Utilidades para manejar la autenticación

// Función para limpiar todas las cookies relacionadas con la autenticación
export const clearAuthCookies = () => {
  // Limpiar cookies específicas de autenticación
  const cookiesToClear = [
    'access_token',
    'refresh_token',
    'session',
    'auth_token',
    'token'
  ];

  cookiesToClear.forEach(cookieName => {
    // Limpiar cookie en el dominio actual
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Limpiar cookie en el subdominio
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });
};

// Función para limpiar el localStorage relacionado con la autenticación
export const clearAuthStorage = () => {
  const keysToRemove = [
    'user',
    'auth',
    'token',
    'session'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

// Función completa para limpiar todo el estado de autenticación
export const clearAllAuthData = () => {
  clearAuthCookies();
  clearAuthStorage();
};
