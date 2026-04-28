"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

export default function Header() {
  const [dateStr, setDateStr] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    };
    setDateStr(today.toLocaleDateString('en-US', options));

    // Outside click handler for dropdown
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-[#1A233A] border-b border-[#2D3C5A] flex items-center justify-between px-8 sticky top-0 z-20">
      
      {/* Current Date */}
      <div>
        <p className="text-[#98AABA] text-sm font-medium tracking-wide">
          {dateStr || "Loading..."}
        </p>
      </div>

      {/* Right User Profile Dropdown Section */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 focus:outline-none p-1.5 rounded-2xl hover:bg-[#2D3C5A]/50 transition-colors"
        >
          {/* Avatar Name Info */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-tight">Admin User</span>
            <span className="text-xs text-[#8B9DB6]">System Administrator</span>
          </div>

          {/* Avatar Graphic */}
          <div className="w-10 h-10 rounded-full bg-[#2D3C5A] flex items-center justify-center border border-[#8B9DB6]/30 overflow-hidden text-[#F2C5D4] font-bold text-sm">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-full h-full object-cover" />
          </div>

          <FiChevronDown className={`w-4 h-4 text-[#8B9DB6] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-[#1A233A] border border-[#2D3C5A] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-[#2D3C5A]/50 mb-2">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-[#8B9DB6] truncate">admin@libraria.com</p>
            </div>
            
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-[#98AABA] hover:bg-[#2D3C5A]/50 hover:text-white transition-colors">
              <FiUser className="w-4 h-4" />
              My Profile
            </a>
            <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[#98AABA] hover:bg-[#2D3C5A]/50 hover:text-white transition-colors">
              <FiSettings className="w-4 h-4" />
              Settings
            </a>
            
            <div className="h-px bg-[#2D3C5A]/50 my-2"></div>
            
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#F2C5D4] hover:bg-[#F2C5D4]/10 transition-colors">
              <FiLogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>

    </header>
  );
}
