import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Cargar traducciones desde `/public/locales`
  .use(LanguageDetector) // Detectar idioma del navegador
  .use(initReactI18next) // Conectar con react-i18next
  .init({
    fallbackLng: 'en', // Idioma por defecto
    debug: true, // Cambiar a `false` en producción
    interpolation: {
      escapeValue: false, // React ya se encarga de escapar valores
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Ruta de los archivos de traducción
    },
  });

export default i18n;
