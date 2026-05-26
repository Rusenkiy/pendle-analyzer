"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "@/lib/LanguageContext";

const LANGUAGE_LABELS = {
  en: "EN // ENGLISH",
  ua: "UA // УКРАЇНСЬКА",
  ru: "RU // РУССКИЙ",
  zh: "ZH // 中文",
} as const;

export default function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative font-mono text-[10px] w-[130px] select-none" ref={dropdownRef}>
      {/* Active Selection Button Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black border text-slate-300 font-bold uppercase py-2 px-3 flex justify-between items-center cursor-pointer transition-all duration-200 rounded-none ${
          isOpen ? "border-brand-green text-brand-green" : "border-dark-border hover:border-brand-green hover:text-white"
        }`}
      >
        <span>LANG: {language.toUpperCase()}</span>
        <span className={`text-[8px] transform transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-green" : ""}`}>
          ▼
        </span>
      </button>

      {/* Floating Options Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1 left-0 right-0 border border-dark-border bg-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          {Object.entries(LANGUAGE_LABELS).map(([langKey, label]) => {
            const isSelected = language === langKey;
            return (
              <button
                key={langKey}
                type="button"
                onClick={() => handleSelect(langKey as Language)}
                className={`w-full text-left py-2 px-3 cursor-pointer rounded-none border-b border-zinc-950 last:border-b-0 uppercase transition-colors text-[9px] ${
                  isSelected
                    ? "bg-brand-green text-black font-extrabold"
                    : "text-slate-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
