import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  darkTheme?: boolean;
  isGreenTheme?: boolean; // Keep for backward compatibility or override
}

export default function Logo({ className = "", darkTheme = false, isGreenTheme }: LogoProps) {
  const { theme, t } = useTheme();
  
  // Define fallback presets for landing page (where context might not be available or needed)
  const presets = {
    violet: { gradient: "from-violet-600 to-fuchsia-600", shadow: "shadow-violet-200" },
    emerald: { gradient: "from-emerald-600 to-teal-600", shadow: "shadow-emerald-200" }
  };

  // Use isGreenTheme override if provided (for landing page), otherwise use context theme t
  const activeTheme = isGreenTheme !== undefined 
    ? (isGreenTheme ? presets.emerald : presets.violet) 
    : t;
  
  const gradient = activeTheme.gradient;
  const shadow = activeTheme.shadow;

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md ${shadow} shrink-0`}>
        <span className="text-white font-black text-sm rotate-[-15deg]">Si</span>
      </div>
      <span className={`sm:block text-lg font-extrabold tracking-tight ${darkTheme ? 'text-white' : 'text-slate-900'}`}>
        Shiksha<span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>intel</span>
      </span>
    </div>
  );
}
