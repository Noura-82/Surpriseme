import { createContext, useState, useContext, ReactNode } from "react";

type LanguageType = "ar" | "en";

type LanguageContextType = {
  language: LanguageType;
  dir: "rtl" | "ltr";
  t: (ar: string, en: string) => string;
  toggleLanguage: () => void;
  fontClass: string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>("ar");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const t = (ar: string, en: string): string => {
    return language === "ar" ? ar : en;
  };

  const dir = language === "ar" ? "rtl" : "ltr";
  const fontClass = language === "ar" ? "font-arabic" : "font-english";

  return (
    <LanguageContext.Provider value={{ language, dir, t, toggleLanguage, fontClass }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
