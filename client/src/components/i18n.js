import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';

let language = localStorage.getItem('language');
if (!language) {
  language = "en-US";
}

i18n
  // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: language,
    fallbackLng: 'en-US',
    whitelist: ['en-US', 'fr-FR'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;