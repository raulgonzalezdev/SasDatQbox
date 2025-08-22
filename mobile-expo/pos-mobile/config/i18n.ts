import { I18n } from 'i18n-js';

import en from '../messages/en.json';
import es from '../messages/es.json';

// Crear instancia de i18n con configuración robusta
const i18n = new I18n({
  en,
  es,
});

// Configuración inicial segura
i18n.enableFallback = true;
i18n.defaultLocale = 'es';
i18n.locale = 'es';

// Función para traducción segura
export const safeTranslate = (key: string, options?: any): any => {
  try {
    console.log(`🌐 Traduciendo "${key}" con locale "${i18n.locale}"`);
    const result = i18n.t(key, options);
    console.log(`✅ Resultado de traducción:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error traduciendo "${key}":`, error);
    // Fallback: devolver la clave si no se puede traducir
    return key;
  }
};

// Función para traducción de objetos complejos
export const safeTranslateObject = (key: string, fallback: any[] = []): any[] => {
  try {
    console.log(`🌐 Traduciendo objeto "${key}" con locale "${i18n.locale}"`);
    const result = i18n.t(key, { returnObjects: true });
    console.log(`✅ Resultado de traducción de objeto:`, result);
    
    // Verificar que sea un array válido
    if (Array.isArray(result)) {
      return result;
    } else {
      console.warn(`⚠️ El resultado de "${key}" no es un array:`, result);
      return fallback;
    }
  } catch (error) {
    console.error(`❌ Error traduciendo objeto "${key}":`, error);
    return fallback;
  }
};

// Función para actualizar el locale
export const updateI18nLocale = (locale: 'es' | 'en') => {
  try {
    console.log('🌐 Actualizando locale a:', locale);
    i18n.locale = locale;
    console.log('✅ Locale actualizado correctamente');
  } catch (error) {
    console.error('❌ Error actualizando locale:', error);
  }
};

export default i18n;
