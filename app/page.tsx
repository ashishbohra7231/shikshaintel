"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ChatBot from "@/components/ChatBot";
import { 
  FiClipboard, 
  FiBell, 
  FiBarChart2, 
  FiUsers, 
  FiBookOpen, 
  FiHome, 
  FiCheck,
  FiMenu,
  FiX,
  FiDroplet
} from "react-icons/fi";

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGreenTheme, setIsGreenTheme] = useState(false);

  const t = {
    primary: isGreenTheme ? "emerald" : "violet",
    secondary: isGreenTheme ? "teal" : "fuchsia",
    accent: isGreenTheme ? "cyan" : "indigo",
    gradient: isGreenTheme 
      ? "from-emerald-600 via-teal-600 to-cyan-600" 
      : "from-violet-600 via-fuchsia-600 to-indigo-600",
    btnPrimary: isGreenTheme
      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
      : "bg-gradient-to-r from-violet-600 to-fuchsia-600",
    btnHover: isGreenTheme ? "hover:bg-emerald-700" : "hover:bg-violet-700",
    shadowPrimary: isGreenTheme ? "shadow-emerald-200/80" : "shadow-violet-200/80",
    textPrimary: isGreenTheme ? "text-emerald-600" : "text-violet-600",
    textPrimaryDark: isGreenTheme ? "text-emerald-700" : "text-violet-700",
    bgPrimaryLight: isGreenTheme ? "bg-emerald-50" : "bg-violet-50",
    borderPrimaryLight: isGreenTheme ? "border-emerald-200" : "border-violet-200",
    bgPrimary: isGreenTheme ? "bg-emerald-500" : "bg-violet-500",
    orb1: isGreenTheme ? "bg-emerald-100/60" : "bg-violet-100/60",
    orb2: isGreenTheme ? "bg-teal-100/50" : "bg-fuchsia-100/50",
    orb3: isGreenTheme ? "bg-cyan-100/40" : "bg-indigo-100/40",
  };

  const testimonials = [
    {
      quote: "Shikshaintel saved me 3 hours every single day. I no longer manually text students about their dues — the system handles everything.",
      name: "Rajesh Sharma",
      role: "Owner, Apex Study Hub, Delhi",
      initials: "RS",
      color: "bg-violet-500"
    },
    {
      quote: "Adding students, assigning seats, and collecting fees used to be chaos. Now it's just a few taps. Best investment I made for my library.",
      name: "Priya Verma",
      role: "Manager, Knowledge Point, Pune",
      initials: "PV",
      color: "bg-fuchsia-500"
    },
    {
      quote: "The revenue dashboard shows me exactly which branch is performing and which needs attention. I feel like I finally have real control.",
      name: "Amit Tiwari",
      role: "Director, Galaxy Library Chain, Lucknow",
      initials: "AT",
      color: "bg-indigo-500"
    }
  ];

  const features = [
    {
      icon: <FiClipboard className="w-6 h-6" />,
      title: "Live Seat Mapping",
      description: "Visualize your entire floor plan in real-time. Assign students instantly and track every seat's status with zero effort.",
      accent: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      large: true
    },
    {
      icon: <FiBell className="w-6 h-6" />,
      title: "Smart Renewal Alerts",
      description: "Automated reminders before plans expire. Students never miss a renewal, you never lose revenue.",
      accent: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
      large: false
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Revenue Analytics",
      description: "Deep financial insights across all your branches in a single view.",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      large: false
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Multi-Branch Management",
      description: "Run multiple library locations from one single account. See everything, everywhere.",
      accent: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      large: false
    }
  ];

  return (
    <div className="min-h-screen font-sans text-slate-800 scroll-smooth antialiased overflow-x-hidden">
      
      {/* ───────────── NAVIGATION ───────────── */}
      <header className="fixed w-full top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-4 px-2 sm:px-4">
        <nav className="w-full max-w-6xl bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between relative">
          
          {/* Logo */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo isGreenTheme={isGreenTheme} />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-500">
            <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-violet-600 transition-colors">How It Works</a>
            <a href="#testimonials" className={`hover:${t.textPrimary} transition-colors`}>Reviews</a>
            <a href="#pricing" className={`hover:${t.textPrimary} transition-colors`}>Pricing</a>
            <button 
              onClick={() => setIsGreenTheme(!isGreenTheme)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${t.borderPrimaryLight} ${t.bgPrimaryLight} ${t.textPrimary} text-[11px] font-bold transition-all hover:scale-105 active:scale-95`}
            >
              <FiDroplet className={isGreenTheme ? "fill-emerald-500" : "fill-violet-500"} />
              {isGreenTheme ? "Emerald Theme" : "Violet Theme"}
            </button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-slate-600 font-semibold px-4 py-2 text-sm hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className={`bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-sm ${t.btnHover} transition-all active:scale-95 shadow-sm`}>
              Get Started →
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-200/70 rounded-2xl p-4 flex flex-col gap-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col gap-4 text-sm font-semibold text-slate-600">
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1 hover:text-violet-600">Features</a>
                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1 hover:text-violet-600">How It Works</a>
                <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className={`px-2 py-1 hover:${t.textPrimary}`}>Reviews</a>
                <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className={`px-2 py-1 hover:${t.textPrimary}`}>Pricing</a>
                <button 
                  onClick={() => {
                    setIsGreenTheme(!isGreenTheme);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${t.borderPrimaryLight} ${t.bgPrimaryLight} ${t.textPrimary} text-sm font-bold transition-all`}
                >
                  <FiDroplet className={isGreenTheme ? "fill-emerald-500" : "fill-violet-500"} />
                  Switch to {isGreenTheme ? "Violet" : "Green"} Theme
                </button>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" className="text-center text-slate-600 font-bold px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className={`text-center bg-slate-900 text-white font-bold px-4 py-3 rounded-xl ${t.btnHover} transition-colors shadow-sm`}>
                  Get Started →
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-24 px-6 overflow-hidden bg-gradient-to-b from-white via-white to-white">
        
        {/* Background decorative orbs */}
        <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] ${t.orb1} rounded-full blur-[140px] pointer-events-none`} />
        <div className={`absolute top-1/3 right-0 w-[500px] h-[500px] ${t.orb2} rounded-full blur-[120px] pointer-events-none`} />
        <div className={`absolute bottom-0 left-1/3 w-[400px] h-[400px] ${t.orb3} rounded-full blur-[100px] pointer-events-none`} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* Pill badge */}
          <div className={`${t.bgPrimaryLight} border ${t.borderPrimaryLight} ${t.textPrimaryDark} rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm inline-flex items-center gap-2`}>
            <span className={`w-2 h-2 ${t.bgPrimary} rounded-full animate-pulse inline-block`}></span>
            Trusted by 500+ Library Owners Across India
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            The &nbsp;<span className={`text-transparent bg-clip-text bg-gradient-to-r ${t.gradient}`}>Smart Platform</span>&nbsp; Built for Library Owners
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Automate seat assignments, rent collection, and student renewals — all from one beautiful dashboard. Stop managing spreadsheets. Start running your library.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/auth/register" className={`${t.btnPrimary} text-white font-black px-10 py-4 rounded-2xl text-[15px] hover:opacity-90 transition-all active:scale-95 shadow-xl ${t.shadowPrimary} w-full sm:w-auto`}>
              Start For Free
            </Link>
            <Link href="/auth/login" className="bg-white text-slate-700 font-bold px-10 py-4 rounded-2xl text-[15px] border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 shadow-sm w-full sm:w-auto">
              Sign In to Dashboard →
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-semibold">No credit card required · Free setup · Cancel anytime</p>
        </div>

        {/* Hero Dashboard Mockup */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-16">
          
          {/* Floating notification cards */}
          <div className="absolute -left-8 top-16 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 w-48 z-20 hidden lg:block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-black text-slate-600">Expiring Today</p>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">3 students expire today. Send reminders?</p>
            <div className="mt-2 bg-rose-50 text-rose-600 text-[9px] font-black px-2 py-1 rounded-lg w-fit">Send Alert</div>
          </div>

          <div className="absolute -right-8 top-28 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 w-44 z-20 hidden lg:block">
            <p className="text-[10px] font-black text-slate-500 mb-1">New Enrollment</p>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 ${t.bgPrimary} rounded-full flex items-center justify-center text-white text-[8px] font-black`}>AK</div>
              <div>
                <p className="text-[10px] font-black text-slate-800">Ankit Kumar</p>
                <p className="text-[8px] text-emerald-500 font-bold">Seat #A14 Assigned</p>
              </div>
            </div>
          </div>

          <div className={`bg-white/90 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/60 shadow-[0_30px_90px_-20px_rgba(${isGreenTheme ? '16,185,129' : '109,40,217'},0.2)] p-3`}>
            <div className="bg-[#F8FAFC] rounded-[2rem] border border-slate-100 overflow-hidden">

              {/* Mock App Top Bar */}
              <div className="h-12 bg-white border-b border-slate-100 flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="w-40 h-5 bg-slate-100 rounded-md"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-24 h-6 bg-slate-100 rounded-lg`}></div>
                  <div className={`w-6 h-6 ${isGreenTheme ? 'bg-emerald-100' : 'bg-violet-100'} rounded-full flex items-center justify-center`}>
                    <div className={`w-2 h-2 ${isGreenTheme ? 'bg-emerald-400' : 'bg-violet-400'} rounded-full`}></div>
                  </div>
                  <div className={`w-6 h-6 ${isGreenTheme ? 'bg-emerald-600' : 'bg-violet-600'} rounded-full`}></div>
                </div>
              </div>

              {/* Mock App Body */}
              <div className="flex h-[320px] md:h-[400px]">

                {/* Sidebar */}
                <div className="hidden md:flex w-44 bg-white border-r border-slate-100 py-4 flex-col gap-1 flex-shrink-0">
                  <div className="px-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-md"></div>
                      <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  {[
                    { label: 'Dashboard', active: true, dot: isGreenTheme ? 'bg-emerald-500' : 'bg-violet-500' },
                    { label: 'Students', active: false, dot: 'bg-slate-300' },
                    { label: 'Seat Map', active: false, dot: 'bg-slate-300' },
                    { label: 'Revenue', active: false, dot: 'bg-slate-300' },
                    { label: 'Alerts', active: false, dot: 'bg-rose-300', badge: '3' },
                    { label: 'Settings', active: false, dot: 'bg-slate-300' },
                  ].map((item, i) => (
                    <div key={i} className={`mx-2 px-3 py-2 rounded-xl flex items-center justify-between ${item.active ? (isGreenTheme ? 'bg-emerald-50' : 'bg-violet-50') : ''}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-sm ${item.dot}`}></div>
                        <span className={`text-[10px] font-bold ${item.active ? (isGreenTheme ? 'text-emerald-700' : 'text-violet-700') : 'text-slate-400'}`}>{item.label}</span>
                      </div>
                      {item.badge && <span className="text-[8px] bg-rose-100 text-rose-600 font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                    </div>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
                  
                  {/* Page Title + Date */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3.5 w-28 bg-slate-800 rounded mb-1.5"></div>
                      <div className="h-2 w-36 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className={`h-7 w-20 ${isGreenTheme ? 'bg-emerald-600' : 'bg-violet-600'} rounded-xl`}></div>
                      <div className="h-7 w-7 bg-slate-100 rounded-xl border border-slate-200"></div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Students', val: '1,248', sub: '+12 this week', color: isGreenTheme ? 'text-emerald-700' : 'text-violet-700', bg: isGreenTheme ? 'bg-emerald-50' : 'bg-violet-50', border: isGreenTheme ? 'border-emerald-100' : 'border-violet-100', trend: 'up' },
                      { label: 'Active Seats', val: '860 / 1,200', sub: '72% occupancy', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: 'up' },
                      { label: 'Monthly Revenue', val: '₹62,400', sub: '↑ 8% vs last month', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', trend: 'up' },
                      { label: 'Expiring Soon', val: '18 students', sub: '3 expire today', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100', trend: 'warn' },
                    ].map((card, i) => (
                      <div key={i} className={`${card.bg} border ${card.border} rounded-2xl p-3 flex flex-col gap-1`}>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wide">{card.label}</p>
                        <p className={`text-[13px] font-black ${card.color} leading-tight`}>{card.val}</p>
                        <p className={`text-[8px] font-semibold ${card.trend === 'warn' ? 'text-rose-500' : 'text-emerald-600'}`}>{card.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Grid: Chart + Table */}
                  <div className="flex gap-3 flex-1 min-h-0">
                    
                    {/* Revenue Chart */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-[10px] font-black text-slate-800">Revenue Overview</p>
                          <p className="text-[8px] text-slate-400 font-medium">Last 12 months</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded ${isGreenTheme ? 'bg-emerald-500' : 'bg-violet-500'}`}></div><span className="text-[8px] text-slate-400 font-medium">2025</span></div>
                          <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded ${isGreenTheme ? 'bg-emerald-100' : 'bg-violet-100'}`}></div><span className="text-[8px] text-slate-400 font-medium">2024</span></div>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end gap-1.5 pb-2 relative">
                        {/* Y-axis lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pb-2 pointer-events-none">
                          {[0,1,2].map(i => <div key={i} className="w-full h-px bg-slate-50"></div>)}
                        </div>
                        {[45, 62, 48, 75, 58, 85, 70, 90, 78, 95, 82, 100].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 relative z-10">
                            <div className={`w-full rounded-t-md ${i === 11 ? (isGreenTheme ? 'bg-emerald-600 shadow-sm shadow-emerald-200' : 'bg-violet-600 shadow-sm shadow-violet-200') : (isGreenTheme ? 'bg-emerald-200' : 'bg-violet-200')}`} style={{ height: `${h}%` }}></div>
                            {i % 3 === 0 && <div className="h-1.5 w-3 bg-slate-200 rounded mt-0.5"></div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Students Table */}
                    <div className="hidden lg:flex w-52 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex-col flex-shrink-0">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-black text-slate-800">Recent Students</p>
                        <div className="h-2 w-8 bg-violet-100 rounded"></div>
                      </div>
                      <div className="space-y-2 flex-1 overflow-hidden">
                        {[
                          { initials: 'RK', name: 'Rohit K.', seat: 'A-12', status: 'Active', color: isGreenTheme ? 'bg-emerald-500' : 'bg-violet-500' },
                          { initials: 'SG', name: 'Sneha G.', seat: 'B-05', status: 'Active', color: 'bg-emerald-500' },
                          { initials: 'AM', name: 'Ankit M.', seat: 'A-07', status: 'Expiring', color: 'bg-amber-500' },
                          { initials: 'PD', name: 'Priya D.', seat: 'C-19', status: 'Active', color: isGreenTheme ? 'bg-teal-500' : 'bg-fuchsia-500' },
                          { initials: 'VK', name: 'Vijay K.', seat: 'B-14', status: 'Expired', color: 'bg-rose-500' },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-2 py-1">
                            <div className={`w-5 h-5 ${s.color} rounded-full flex items-center justify-center text-white text-[7px] font-black flex-shrink-0`}>{s.initials}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black text-slate-800 truncate">{s.name}</p>
                                <span className={`text-[7px] font-black px-1 py-0.5 rounded ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : s.status === 'Expiring' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{s.status}</span>
                              </div>
                              <p className="text-[8px] text-slate-400 font-medium">Seat {s.seat}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <div className={`absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 bg-white border ${isGreenTheme ? 'border-emerald-100' : 'border-violet-100'} shadow-lg rounded-full px-4 md:px-6 py-2 flex items-center gap-2 text-[10px] md:text-[12px] font-bold text-slate-700 whitespace-nowrap`}>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Live Dashboard — Your data, real-time
          </div>
        </div>
      </section>
  
{/* ───────────── FEATURES BENTO GRID ───────────── */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-[10px] font-black ${t.textPrimary} uppercase tracking-[0.3em] mb-4 block`}>Core Platform</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Built specifically for Indian library owners, not generic business software.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <div className={`lg:col-span-2 bg-gradient-to-br ${isGreenTheme ? 'from-emerald-900 to-teal-950 border-emerald-800/50' : 'from-violet-900 to-indigo-950 border-violet-800/50'} rounded-[2.5rem] p-10 text-white relative overflow-hidden group border`}>
              <div className={`absolute top-0 right-0 w-64 h-64 ${isGreenTheme ? 'bg-emerald-500/20 group-hover:bg-emerald-500/30' : 'bg-violet-500/20 group-hover:bg-violet-500/30'} rounded-full blur-[80px] transition-all duration-700`}></div>
              <div className="relative z-10">
                <div className={`w-14 h-14 ${isGreenTheme ? 'bg-emerald-700/60 text-emerald-300' : 'bg-violet-700/60 text-violet-300'} rounded-2xl flex items-center justify-center mb-6`}>
                  <FiBookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Real-Time Seat Mapping</h3>
                <p className="text-violet-200/80 text-lg leading-relaxed max-w-md">Design your exact floor layout. Know who is sitting where. Instantly see which seats are free, occupied, or reserved — without any phone calls.</p>
              </div>
              {/* Mini seat grid visual */}
              <div className="relative z-10 mt-8 grid grid-cols-8 gap-2 max-w-sm">
                {Array.from({length: 32}).map((_, i) => (
                  <div key={i} className={`w-full aspect-square rounded-md ${[2, 5, 9, 13, 18, 22, 25].includes(i) ? 'bg-emerald-400 shadow-sm shadow-emerald-300' : i === 15 ? 'bg-rose-400 shadow-sm shadow-rose-300' : (isGreenTheme ? 'bg-emerald-700/50' : 'bg-violet-700/50')}`}></div>
                ))}
              </div>
            </div>

            {/* Renewal Alerts Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all group">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 transition-transform">
                <FiBell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Smart Renewal Alerts</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Automated expiry reminders sent to students before their plan ends — so you never lose a renewal due to forgetfulness.</p>
              <div className="mt-6 space-y-2">
                {['Rahul S. - Expires in 2 days', 'Anjali K. - Expires tomorrow', 'Mohit G. - Expires today'].map((s, i) => (
                  <div key={i} className={`flex items-center gap-2 text-[11px] font-bold px-3 py-2 rounded-xl ${i === 2 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-rose-400' : 'bg-amber-400'}`}></div>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Analytics Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <FiBarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Revenue Analytics</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">Know exactly how much each branch earns every month. Compare performance across locations at a glance.</p>
              <div className="flex items-end gap-1 h-16">
                {[35, 50, 42, 70, 55, 85, 72, 95].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-md ${i === 7 ? 'bg-emerald-500' : 'bg-emerald-100'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>

            {/* Multi-Branch Card */}
            <div className={`bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md ${isGreenTheme ? 'hover:border-emerald-100' : 'hover:border-blue-100'} transition-all group`}>
              <div className={`w-12 h-12 ${isGreenTheme ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-blue-50 border-blue-100 text-blue-500'} border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <FiHome className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Multi-Branch Control</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">Manage 1 library or 10 from a single account. Every branch, every student, one dashboard.</p>
              <div className="space-y-2">
                {['Branch A — Sector 12', 'Branch B — MG Road', 'Branch C — Civil Lines'].map((b, i) => (
                  <div key={i} className={`flex items-center justify-between text-[11px] font-bold px-3 py-2 ${isGreenTheme ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'} rounded-xl`}>
                    <span>{b}</span>
                    <span className="text-emerald-600">● Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Management */}
            <div className={`bg-gradient-to-br ${isGreenTheme ? 'from-teal-600 to-emerald-700 border-teal-500/30' : 'from-fuchsia-600 to-violet-700 border-fuchsia-500/30'} rounded-[2.5rem] p-8 text-white relative overflow-hidden group border`}>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px]"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white">
                  <FiUsers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-3">Student Profiles</h3>
                <p className={`${isGreenTheme ? 'text-emerald-100' : 'text-fuchsia-100'} text-sm leading-relaxed`}>Complete profile for every student — contact details, plan history, payment status, assigned seat. Everything in one place.</p>
                <div className="mt-6 flex">
                  {['bg-fuchsia-400', 'bg-violet-400', 'bg-indigo-400', 'bg-blue-400'].map((c, i) => (
                    <div key={i} className={`w-9 h-9 ${isGreenTheme ? (i % 2 === 0 ? 'bg-emerald-400' : 'bg-teal-400') : c} rounded-full border-2 border-white flex items-center justify-center text-[11px] font-black text-white -ml-2 first:ml-0 shadow-md`}>
                      {['RK', 'AM', 'SV', '+12'][i]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className={`text-[10px] font-black ${t.textPrimary} uppercase tracking-[0.3em] mb-4 block`}>Simple Workflow</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Up and running in minutes</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-16">No technical knowledge required. If you can use WhatsApp, you can use Shikshaintel.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Library", desc: "Set up your library profile in under 2 minutes. Add your branch name, address, and seat layout.", icon: "🏛️" },
              { step: "02", title: "Add Your Students", desc: "Import students manually or via CSV. Assign each to a seat and select their subscription plan.", icon: "🎓" },
              { step: "03", title: "Automate & Grow", desc: "Let Shikshaintel handle renewal reminders, payment tracking, and performance reports for you.", icon: "🚀" }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-violet-100 hover:bg-violet-50/30 transition-colors group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className={`text-[10px] font-black ${t.textPrimary} uppercase tracking-widest mb-2`}>{item.step}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-slate-300 text-2xl font-black z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ───────────── TESTIMONIALS ───────────── */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-[10px] font-black ${t.textPrimary} uppercase tracking-[0.3em] mb-4 block`}>Reviews</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Library owners love it.</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Real feedback from real operators who switched to Shikshaintel.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {testimonials.map((t, i) => (
              <div
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`p-8 rounded-[2rem] border cursor-pointer transition-all duration-300 ${activeTestimonial === i ? `${isGreenTheme ? 'border-emerald-200 bg-emerald-50 shadow-emerald-100' : 'border-violet-200 bg-violet-50 shadow-violet-100'} shadow-lg` : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
              >
                <div className="flex gap-1 text-amber-400 mb-5 text-sm">★★★★★</div>
                <p className="text-slate-700 text-[15px] leading-relaxed font-medium mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${isGreenTheme ? (i % 3 === 0 ? 'bg-emerald-500' : i % 3 === 1 ? 'bg-teal-500' : 'bg-cyan-500') : t.color} rounded-full flex items-center justify-center text-white font-black text-xs`}>{t.initials}</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-[11px] font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PRICING ───────────── */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-white to-violet-50/50">
        <div className="max-w-3xl mx-auto text-center">
          <span className={`text-[10px] font-black ${t.textPrimary} uppercase tracking-[0.3em] mb-4 block`}>Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">One plan. Unlimited potential.</h2>
          <p className="text-slate-500 text-lg mb-16">No confusing tiers. Full access from day one.</p>

          <div className="relative">
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${isGreenTheme ? 'from-emerald-200 to-teal-200' : 'from-violet-200 to-fuchsia-200'} rounded-[3rem] blur-2xl opacity-40 scale-105`}></div>
            
            <div className={`relative bg-white rounded-[2.5rem] border ${isGreenTheme ? 'border-emerald-100' : 'border-violet-100'} p-10 md:p-14 shadow-[0_20px_60px_-10px_rgba(${isGreenTheme ? '16,185,129' : '109,40,217'},0.15)]`}>
              <div className={`inline-block bg-gradient-to-r ${isGreenTheme ? 'from-emerald-100 to-teal-100 text-emerald-700' : 'from-violet-100 to-fuchsia-100 text-violet-700'} font-black px-5 py-2 rounded-full text-[11px] uppercase tracking-widest mb-8`}>Pro Membership — Most Popular</div>
              
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter">₹999</span>
                <span className="text-slate-400 font-semibold text-lg">/month</span>
              </div>
              <p className="text-slate-500 font-medium mb-10">Per library. Includes all branches and unlimited students.</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
                {[
                  'Unlimited Students & Seats',
                  'Live Seat Map Dashboard',
                  'Automated Renewal Alerts',
                  'Revenue Analytics Reports',
                  'Multi-Branch Support',
                  'Student Profile Management',
                  'Monthly Billing Reports',
                  'Priority Support'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-[14px] font-semibold text-slate-700">
                    <div className={`w-5 h-5 ${isGreenTheme ? 'bg-emerald-100' : 'bg-violet-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <FiCheck className={`w-3 h-3 ${isGreenTheme ? 'text-emerald-600' : 'text-violet-600'}`} strokeWidth={3} />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>

              <Link href="/auth/register" className={`inline-block ${t.btnPrimary} text-white font-black px-14 py-5 rounded-2xl text-[16px] hover:opacity-90 transition-all active:scale-95 shadow-xl ${t.shadowPrimary} w-full`}>
                Start Your Free Trial — No Card Needed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── BOTTOM CTA ───────────── */}
      <section className="relative py-24 px-6 bg-[#0A0A14] overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className={`absolute top-1/2 left-1/2 w-[600px] h-[300px] ${isGreenTheme ? 'bg-emerald-600/10' : 'bg-violet-600/10'} rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10`}></div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Your library deserves <br className="hidden sm:block" /><span className={`text-transparent bg-clip-text bg-gradient-to-r ${isGreenTheme ? 'from-emerald-400 to-teal-400' : 'from-violet-400 to-fuchsia-400'}`}>better software.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium mb-10">Join hundreds of library owners who automated their workflow with Shikshaintel.</p>
          <Link href="/auth/register" className="inline-block bg-white text-slate-900 font-black px-12 py-5 rounded-2xl text-[16px] hover:bg-slate-100 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Get Started — It's Free ✦
          </Link>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="bg-[#0A0A14] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 bg-gradient-to-br ${isGreenTheme ? 'from-emerald-600 to-teal-600' : 'from-violet-600 to-fuchsia-600'} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-black text-xs rotate-[-15deg]">SI</span>
              </div>
              <span className="font-black text-white tracking-tight">Shikshaintel</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium space-y-1">
              <p>72 GOVIND NAGR NEAR CHITRAKOOT AJMER ROAD</p>
              <p>JAIPUR, Jaipur 302021, Rajasthan</p>
              <p>+919784725325, +918947095378 | ashishbohra1208@gmail.com</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-[12px] font-semibold text-slate-500">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/auth/register" className="hover:text-white transition-colors">Get Started</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">© 2025 Shikshaintel. Made with ❤️ for library owners.</p>
          </div>
        </div>
      </footer>
      <ChatBot isGreenTheme={isGreenTheme} />
    </div>
  );
}
