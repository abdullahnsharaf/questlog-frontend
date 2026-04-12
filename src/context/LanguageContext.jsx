import { createContext, useContext, useState } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext(null);

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  function changeLanguage(lang) {
    setLanguage(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  const value = {
    language,
    changeLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  return useContext(LanguageContext);
}

export { LanguageProvider, useLanguage };