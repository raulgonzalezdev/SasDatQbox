import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from '../messages/en.json';
import es from '../messages/es.json';

const i18n = new I18n({
  en,
  es,
});

i18n.locale = Localization.getLocales()[0].languageCode;
i18n.enableFallback = true;

export default i18n;