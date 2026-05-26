"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "../locales/en.json";
import ua from "../locales/ua.json";
import ru from "../locales/ru.json";
import zh from "../locales/zh.json";

export type Language = "en" | "ua" | "ru" | "zh";

const dictionaries = { en, ua, ru, zh } as const;

type DictType = typeof en;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const dict: DictType = dictionaries[language] as unknown as DictType;
    const keys = key.split(".");
    let result: unknown = dict;

    for (const k of keys) {
      if (result && typeof result === "object" && k in (result as Record<string, unknown>)) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof result !== "string") {
      return key;
    }

    let text: string = result;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
