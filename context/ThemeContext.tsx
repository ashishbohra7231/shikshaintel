"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeColor = "violet" | "indigo" | "emerald" | "amber" | "rose";

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  t: {
    primary: string;
    secondary: string;
    accent: string;
    bgLight: string;
    bgPrimary: string;
    textPrimary: string;
    textPrimaryDark: string;
    borderPrimary: string;
    gradient: string;
    shadow: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Hardcoded to violet as per user request to remove theme options completely
  const theme: ThemeColor = "violet";

  const setTheme = (newTheme: ThemeColor) => {
    // Selection disabled
  };

  const getThemeMapping = (color: ThemeColor) => {
    const mappings: Record<ThemeColor, any> = {
      violet: {
        primary: "violet",
        secondary: "fuchsia",
        accent: "indigo",
        bgLight: "bg-violet-50",
        bgPrimary: "bg-violet-500",
        textPrimary: "text-violet-600",
        textPrimaryDark: "text-violet-700",
        borderPrimary: "border-violet-200",
        gradient: "from-violet-600 to-fuchsia-600",
        shadow: "shadow-violet-200"
      },
      indigo: { primary: "indigo", secondary: "blue", accent: "violet", bgLight: "bg-indigo-50", bgPrimary: "bg-indigo-500", textPrimary: "text-indigo-600", textPrimaryDark: "text-indigo-700", borderPrimary: "border-indigo-200", gradient: "from-indigo-600 to-blue-600", shadow: "shadow-indigo-200" },
      emerald: { primary: "emerald", secondary: "teal", accent: "green", bgLight: "bg-emerald-50", bgPrimary: "bg-emerald-500", textPrimary: "text-emerald-600", textPrimaryDark: "text-emerald-700", borderPrimary: "border-emerald-200", gradient: "from-emerald-600 to-teal-600", shadow: "shadow-emerald-200" },
      amber: { primary: "amber", secondary: "orange", accent: "yellow", bgLight: "bg-amber-50", bgPrimary: "bg-amber-500", textPrimary: "text-amber-600", textPrimaryDark: "text-amber-700", borderPrimary: "border-amber-200", gradient: "from-amber-600 to-orange-600", shadow: "shadow-amber-200" },
      rose: { primary: "rose", secondary: "pink", accent: "red", bgLight: "bg-rose-50", bgPrimary: "bg-rose-500", textPrimary: "text-rose-600", textPrimaryDark: "text-rose-700", borderPrimary: "border-rose-200", gradient: "from-rose-600 to-pink-600", shadow: "shadow-rose-200" }
    };
    return mappings[color];
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, t: getThemeMapping(theme) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
