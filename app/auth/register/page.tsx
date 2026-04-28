"use client";

import React from 'react';
import Register from '@/components/ui/auth/Register';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { FiCheckCircle } from 'react-icons/fi';

const features = [
  "Manage multiple branches from one dashboard",
  "Automated SMS/Email reminders for renewals",
  "Collect 100% of your revenue directly via UPI",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased flex overflow-hidden">

      {/* ─────────────── LEFT PHOTOGRAPHY PANEL ─────────────── */}
      <div className="hidden lg:flex flex-col w-[50%] relative shrink-0 overflow-hidden bg-slate-900">
        
        {/* Beautiful high-quality image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1600" 
            alt="Beautiful Library" 
            className="object-cover w-full h-full opacity-60 mix-blend-overlay"
          />
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16 justify-between">

          {/* Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity w-fit">
            <Logo darkTheme className="scale-110 origin-left" />
          </Link>

          {/* Hero copy with SaaS touch */}
          <div className="mt-auto mb-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-white text-[11px] font-bold tracking-wide uppercase">Join 500+ Libraries</span>
            </div>

            <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-6">
              Start your digital library <span className="text-indigo-400">journey.</span>
            </h1>
            
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FiCheckCircle className="text-indigo-400 w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SaaS Floating stat card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Network Capacity</p>
              <p className="text-white text-2xl font-bold">120,000+ Seats</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/30">
              <FiCheckCircle className="text-indigo-400 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────── RIGHT FORM PANEL ─────────────── */}
      <div className="flex-1 flex flex-col relative bg-white">
        
        {/* Top bar */}
        <div className="relative z-10 flex justify-between items-center px-8 py-6">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <div className="hidden lg:block"></div>
          
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form centred */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-6 pb-12 sm:pb-8">
          <Register />
        </div>
      </div>
    </div>
  );
}
