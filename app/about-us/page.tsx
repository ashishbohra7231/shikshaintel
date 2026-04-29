"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiArrowLeft, FiTarget, FiZap, FiTrendingUp, FiCheck } from "react-icons/fi";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Navigation */}
      <header className="fixed w-full top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <nav className="w-full max-w-4xl bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-sm px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo isGreenTheme={false} />
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors"
          >
            <FiArrowLeft /> Back to Home
          </Link>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em] mb-4 block">Our Mission</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Simplifying Library <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Management for India.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Shikshaintel was born out of a simple observation: library owners spend too much time on paperwork and manual coordination. We're here to change that.
            </p>
          </div>

          {/* Vision & Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: <FiTarget className="w-6 h-6" />,
                title: "Our Vision",
                desc: "To become the operating system for every modern study hub and library in India.",
                color: "bg-violet-50 text-violet-600 border-violet-100"
              },
              {
                icon: <FiZap className="w-6 h-6" />,
                title: "Our Value",
                desc: "We prioritize automation that actually works, saving hours of manual labor every day.",
                color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100"
              },
              {
                icon: <FiTrendingUp className="w-6 h-6" />,
                title: "Your Growth",
                desc: "By handling the operations, we let you focus on expanding your library business.",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100"
              }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-[2rem] border bg-white shadow-sm hover:shadow-md transition-all`}>
                <div className={`w-12 h-12 ${item.color} border rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Content Block */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-12">
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Why Shikshaintel?</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8">
                Managing a library isn't just about books; it's about people, spaces, and subscriptions. Most library owners use registers or basic spreadsheets that don't scale. Shikshaintel provides a professional-grade dashboard that handles the complexity for you.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Built for Indian Library Context",
                  "Automated WhatsApp Notifications",
                  "Real-time Visual Seat Layout",
                  "Multi-branch Centralized Control",
                  "Financial Analytics & Reporting",
                  "Priority Local Support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheck className="text-violet-600 w-4 h-4" strokeWidth={3} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-10 border-t border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-4">Our Story</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Starting as a small project to help a local library owner in Rajasthan, Shikshaintel has grown into a platform trusted by hundreds of operators. We understand the unique challenges of the Indian market — from tracking cash payments to sending reminders on WhatsApp. Our goal is to empower every small-scale educator and library owner with the same level of technology used by large chains.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link 
              href="/auth/register" 
              className="inline-block bg-slate-900 text-white font-black px-10 py-4 rounded-2xl text-[15px] hover:bg-violet-700 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Start Managing Your Library ✦
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-[11px] text-slate-500 font-medium">
            <p className="font-bold text-slate-700 mb-1">Shikshaintel</p>
            <p>72 GOVIND NAGR NEAR CHITRAKOOT AJMER ROAD JAIPUR</p>
            <p>Jaipur 302021, Rajasthan</p>
            <p className="mt-1">+919784725325 | ashishbohra1208@gmail.com</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[12px] font-bold text-slate-400 mt-4 md:mt-0">
            <Link href="/about-us" className="hover:text-violet-600 transition-colors text-slate-600">About Us</Link>
            <Link href="/contact-us" className="hover:text-violet-600 transition-colors">Contact Us</Link>
            <Link href="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-violet-600 transition-colors">Terms & Conditions</Link>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-4 md:mt-0">
            © 2025 Shikshaintel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
