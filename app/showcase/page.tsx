"use client";

import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-indigo-500/30 selection:text-white font-sans overflow-x-hidden">
      
      {/* 🔮 Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 🧭 Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Logo className="scale-110" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Pricing</a>
            <div className="h-4 w-px bg-white/10" />
            <Link href="/auth/login" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              Live Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                Premium Library Management
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                Empower Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Reading Space</span>.
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-medium">
                The all-in-one platform for individual library owners to manage students, 
                visualize seat shifts, and automate billing — all in one premium interface.
              </p>
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-base hover:bg-slate-200 transition-all shadow-xl active:scale-95">
                  Get Lifetime Access
                </button>
                <Link href="/auth/register" className="px-8 py-4 bg-slate-800/50 border border-white/10 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-all backdrop-blur-md">
                  Explore Features
                </Link>
              </div>
            </div>

            {/* 🖼️ Hero Image Mockup Area */}
            <div className="w-full lg:w-1/2 relative group animate-in fade-in zoom-in-95 duration-1000 delay-200">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-violet-700/30 blur-[40px] group-hover:opacity-60 transition-opacity" />
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    {/* Note: In a real environment, you would use an <Img /> tag here */}
                    {/* Placeholder for the generated Hero Image */}
                    <div className="aspect-video bg-slate-900 flex items-center justify-center">
                        <span className="text-slate-500 font-bold italic">[ Stunning Dashboard Mockup ]</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📦 Feature Section */}
      <section id="features" className="py-32 relative bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Built for Performance & Scale</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to run your modern library or coworking space with zero friction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Smart Seat Visuals", desc: "Interactive seat management with Shift support (Morning/Evening/Full Day).", icon: "💺" },
              { title: "Automated Onboarding", desc: "Instant Email & SMS confirmations with seat details and plan info.", icon: "📬" },
              { title: "OTP Security", desc: "Enterprise-grade OTP verification for secure student registrations.", icon: "🔐" },
              { title: "Plan Flexibility", desc: "Manage Monthly, Quarterly, and Yearly plans with automated expiry alerts.", icon: "📅" },
              { title: "Multi-Branch Ready", desc: "Manage multiple branches or locations from a single dashboard.", icon: "🏢" },
              { title: "Indian Localization", desc: "Designed specifically for the unique needs of Indian library owners.", icon: "🇮🇳" }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-2">
                <div className="text-4xl mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💰 Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Tier 1 */}
            <div className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 flex flex-col h-full">
              <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">Pay Per Active User</h4>
              <div className="text-4xl font-black mb-6">₹10<span className="text-lg text-slate-500 font-medium"> / student</span></div>
              <ul className="space-y-4 flex-1 mb-10">
                <li className="flex items-center gap-3 text-slate-400 text-sm font-medium">✓ Unlimited Libraries</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm font-medium">✓ Auto-Email Alerts</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm font-medium">✓ Full Seat Analytics</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors font-bold">Start Small</button>
            </div>

            {/* Tier 2 (Featured) */}
            <div className="p-10 rounded-[2.5rem] bg-indigo-600 relative overflow-hidden flex flex-col h-full shadow-2xl shadow-indigo-600/30">
               <div className="absolute top-0 right-0 p-6 opacity-20"><Logo className="h-20" /></div>
              <h4 className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-4">Unlimited Monthly Plan</h4>
              <div className="text-4xl font-black mb-6 text-white">₹499<span className="text-lg text-indigo-200 font-medium"> / month</span></div>
              <ul className="space-y-4 flex-1 mb-10">
                <li className="flex items-center gap-3 text-indigo-50 font-medium text-sm">✓ Unlimited Students</li>
                <li className="flex items-center gap-3 text-indigo-50 font-medium text-sm">✓ Premium Branding</li>
                <li className="flex items-center gap-3 text-indigo-50 font-medium text-sm">✓ Priority Support</li>
                <li className="flex items-center gap-3 text-indigo-50 font-medium text-sm">✓ Custom SMS Templates</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white text-indigo-600 transition-all font-black hover:bg-slate-100 active:scale-95">Go Unlimited</button>
            </div>
          </div>
        </div>
      </section>

      {/* 👤 Contact & Branding */}
      <footer className="py-20 border-t border-white/5 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-6 text-center md:text-left">
            <Logo />
            <p className="text-slate-500 text-sm max-w-xs font-medium">
              Revolutionizing library management for individual owners with modern digital tools.
            </p>
          </div>
          <div className="text-center md:text-right space-y-4">
            <h5 className="font-black text-lg">Interested in a demo?</h5>
            <div className="flex flex-col gap-2">
                <span className="text-slate-400 text-sm">Contact: <span className="text-white font-bold">Ashish Bohra</span></span>
                <span className="text-slate-400 text-sm">Email: <span className="text-indigo-400 font-bold font-mono">ashishbohra1208@gmail.com</span></span>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 text-slate-600 text-[0.7rem] uppercase tracking-widest">
           © 2026 Shiksha intel LMS. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
