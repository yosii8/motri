import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Navigation translations
import enNav from "./locales/en/navigation.json";
import amNav from "./locales/am/navigation.json";
import omNav from "./locales/om/navigation.json";

// Dashboard translations
import enDashboard from "./locales/en/Dashboard.json";
import amDashboard from "./locales/am/Dashboard.json";
import omDashboard from "./locales/om/Dashboard.json";

// Home translations
import enHome from "./locales/en/Home.json";
import amHome from "./locales/am/Home.json";
import omHome from "./locales/om/Home.json";

// ReportForm translations
import enReportForm from "./locales/en/ReportForm.json";
import amReportForm from "./locales/am/ReportForm.json";
import omReportForm from "./locales/om/ReportForm.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...enNav, ...enDashboard, ...enHome, ...enReportForm } },
      am: { translation: { ...amNav, ...amDashboard, ...amHome, ...amReportForm } },
      om: { translation: { ...omNav, ...omDashboard, ...omHome, ...omReportForm } },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
  });

export default i18n;
