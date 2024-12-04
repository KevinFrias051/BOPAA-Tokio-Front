import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const isServer = typeof window === 'undefined';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'ja'],
    debug: true,
    interpolation: {
      escapeValue: false, 
    },
    backend: {
      loadPath: isServer 
        ? '/locales/{{lng}}/translation.json' // Server expects absolute paths
        : '/locales/{{lng}}/translation.json', // Browser can use relative paths
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'], 
    },
    load: 'languageOnly',
  });

export default i18n;
