"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiArrowLeft, FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend only for now
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              We're here to help you.
            </h1>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">
              Have questions about Shikshaintel? Need help setting up your library? Our team is just a message away.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm group hover:border-violet-200 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-lg font-black text-slate-900">+919784725325, +918947095378</p>
                    <p className="text-slate-500 text-sm font-medium mt-1">Mon - Sat, 9am - 7pm</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm group hover:border-fuchsia-200 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FiMail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-lg font-black text-slate-900 truncate">ashishbohra1208@gmail.com</p>
                    <p className="text-slate-500 text-sm font-medium mt-1">Usually respond within 24h</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm group hover:border-emerald-200 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-lg font-black text-slate-900">72 GOVIND NAGR NEAR CHITRAKOOT AJMER ROAD JAIPUR</p>
                    <p className="text-slate-500 text-sm font-medium mt-1">Jaipur 302021, Rajasthan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-violet-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-100"
                  >
                    <FiSend className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
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
            <p className="mt-1">+919784725325, +918947095378 | ashishbohra1208@gmail.com</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[12px] font-bold text-slate-400 mt-4 md:mt-0">
            <Link href="/about-us" className="hover:text-violet-600 transition-colors">About Us</Link>
            <Link href="/contact-us" className="hover:text-violet-600 transition-colors text-slate-600">Contact Us</Link>
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
