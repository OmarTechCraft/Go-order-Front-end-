import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          "Settings": "Settings",
          "Profile": "Profile",
          "Location": "Location",
          "Language": "Language",
          "Privacy & Policy": "Privacy & Policy",
          "Terms & Conditions": "Terms & Conditions",
          "Select Language": "Select Language",
          "Select": "Select",
        },
      },
      ar: {
        translation: {
          "Settings": "الإعدادات",
          "Profile": "الملف الشخصي",
          "Location": "الموقع",
          "Language": "اللغة",
          "Privacy & Policy": "سياسة الخصوصية",
          "Terms & Conditions": "الشروط والأحكام",
          "Select Language": "اختر اللغة",
          "Select": "اختر",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
