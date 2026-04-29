"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiArrowLeft } from "react-icons/fi";

export default function TermsAndConditions() {
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Terms & Conditions
            </h1>
            <p className="text-slate-500 font-medium italic">
              Last Updated: April 29, 2026
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-600 font-medium">
                By accessing or using Shikshaintel ("we," "our," or "us"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access our Library Management Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">2. Use of the Service</h2>
              <div className="space-y-4">
                <p className="text-slate-600 font-medium">
                  You agree to use our platform only for lawful purposes related to managing your library, study hub, or educational facility. You must not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
                  <li>Use the service for any illegal or unauthorized purpose.</li>
                  <li>Attempt to hack, destabilize, or adapt the service.</li>
                  <li>Transmit any worms, viruses, or any code of a destructive nature.</li>
                  <li>Resell the service or provide it to a third party without our explicit consent.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">3. Account Responsibilities</h2>
              <p className="text-slate-600 font-medium">
                You are responsible for maintaining the security of your account credentials. Shikshaintel cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all content posted and activity that occurs under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">4. Subscriptions and Payments</h2>
              <div className="space-y-4">
                <p className="text-slate-600 font-medium">
                  By subscribing to our service, you agree to pay all applicable fees associated with your chosen plan.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
                  <li>Fees are non-refundable except where required by law.</li>
                  <li>We reserve the right to modify our pricing with reasonable prior notice.</li>
                  <li>Failure to pay may result in the suspension or termination of your account.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">5. Intellectual Property</h2>
              <p className="text-slate-600 font-medium">
                The Shikshaintel platform, including its original content, features, functionality, and design, is and will remain the exclusive property of Shikshaintel. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-600 font-medium">
                In no event shall Shikshaintel, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">7. Termination</h2>
              <p className="text-slate-600 font-medium">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms and Conditions. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">8. Governing Law</h2>
              <p className="text-slate-600 font-medium">
                These Terms shall be governed and construed in accordance with the laws of India, specifically within the jurisdiction of Rajasthan, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-4">9. Contact Us</h2>
              <p className="text-slate-600 font-medium">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-violet-50 rounded-2xl border border-violet-100">
                <p className="text-violet-900 font-bold">Email: ashishbohra1208@gmail.com</p>
                <p className="text-violet-700 text-sm font-semibold mt-1">Shikshaintel</p>
                <p className="text-violet-700 text-sm font-semibold mt-1">72 GOVIND NAGR NEAR CHITRAKOOT AJMER ROAD JAIPUR</p>
                <p className="text-violet-700 text-sm font-semibold mt-1">Jaipur 302021, Rajasthan</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="text-[11px] text-slate-500 font-medium">
            <p className="font-bold text-slate-700 mb-1">Shikshaintel</p>
            <p>72 GOVIND NAGR NEAR CHITRAKOOT AJMER ROAD JAIPUR</p>
            <p>Jaipur 302021, Rajasthan</p>
            <p className="mt-1">+919784725325 | ashishbohra1208@gmail.com</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[12px] font-bold text-slate-400 mt-4">
            <Link href="/about-us" className="hover:text-violet-600 transition-colors">About Us</Link>
            <Link href="/contact-us" className="hover:text-violet-600 transition-colors">Contact Us</Link>
            <Link href="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-violet-600 transition-colors text-slate-600">Terms & Conditions</Link>
          </div>
          <p className="text-sm font-bold text-slate-400">
            © 2025 Shikshaintel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
