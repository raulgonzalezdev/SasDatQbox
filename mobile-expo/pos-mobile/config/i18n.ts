import { I18n } from 'i18n-js';
import { useAppStore } from '@/store/appStore';

import en from '../messages/en.json';
import es from '../messages/es.json';

const i18n = new I18n({
  en,
  es,
});

i18n.enableFallback = true;

// Set initial locale from store
i18n.locale = useAppStore.getState().currentLocale;

// Subscribe to store changes
useAppStore.subscribe((state) => {
  i18n.locale = state.currentLocale;
});

export default i18n;
