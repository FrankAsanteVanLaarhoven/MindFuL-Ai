
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import en from './resources/en.json';
import enGB from './resources/en-gb.json';
import es from './resources/es.json';
import fr from './resources/fr.json';
import de from './resources/de.json';
import zh from './resources/zh.json';
import ja from './resources/ja.json';
import ar from './resources/ar.json';
import nl from './resources/nl.json';
import hi from './resources/hi.json';
import ur from './resources/ur.json';
import pt from './resources/pt.json';
import it from './resources/it.json';
import el from './resources/el.json';

const resources = {
  en: { translation: en },
  'en-GB': { translation: enGB },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
  nl: { translation: nl },
  hi: { translation: hi },
  ur: { translation: ur },
  pt: { translation: pt },
  it: { translation: it },
  el: { translation: el }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: false,
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    }
  });

// Set up language change listener to update document direction and language
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  
  // Update document direction for RTL languages
  if (['ar', 'ur'].includes(lng)) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
  
  // Update document language attribute
  document.documentElement.lang = lng;
});

export default i18n;
