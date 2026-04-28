"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiArrowLeft } from "react-icons/fi";

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-slate-500 font-medium italic">
              Last Updated: April 27, 2026
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 font-medium">
                Welcome to Shikshaintel ("we," "our," or "us"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our Library Management Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <p className="text-slate-600 font-medium">
                  We collect information necessary to provide and improve our services, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
                  <li><strong>Account Information:</strong> Name, email address, phone number, and library details provided during registration.</li>
                  <li><strong>Student Data:</strong> Information about students enrolled in your library, such as names, contact numbers, and plan details.</li>
                  <li><strong>Usage Data:</strong> Information on how you interact with our platform, including seat assignments, payment records, and feature usage.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-slate-600 font-medium">
                  Your information is used for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
                  <li>To provide and manage your library management account.</li>
                  <li><strong>WhatsApp Notifications:</strong> To send automated renewal alerts, payment reminders, and important notifications to students via the WhatsApp API.</li>
                  <li>To generate revenue reports and analytics for your library branches.</li>
                  <li>To provide customer support and respond to inquiries.</li>
                  <li>To improve our platform and develop new features.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">4. WhatsApp API Integration</h2>
              <p className="text-slate-600 font-medium">
                Our service integrates with the WhatsApp Business API (provided by Meta) to deliver automated messages to your students. By using this feature, you acknowledge that student phone numbers will be processed through WhatsApp's infrastructure in accordance with Meta's Privacy Policy. We do not use these numbers for marketing purposes unrelated to your library's operations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-slate-600 font-medium">
                We do not sell your personal information to third parties. We may share data only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-600 font-medium">
                <li>With service providers (like Meta for WhatsApp API) who assist in delivering our services.</li>
                <li>To comply with legal obligations or respond to valid legal requests.</li>
                <li>In the event of a business merger, acquisition, or sale of assets.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">6. Data Security</h2>
              <p className="text-slate-600 font-medium">
                We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">7. Your Rights</h2>
              <p className="text-slate-600 font-medium">
                You have the right to access, update, or delete your personal information. You can manage most of your data directly through the Shikshaintel dashboard. If you need further assistance, please contact our support team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-slate-600 font-medium">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-4">9. Contact Us</h2>
              <p className="text-slate-600 font-medium">
                If you have any questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-violet-50 rounded-2xl border border-violet-100">
                <p className="text-violet-900 font-bold">Email: support@shikshaintel.com</p>
                <p className="text-violet-700 text-sm font-semibold mt-1">Shikshaintel Technology Solutions</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[12px] font-bold text-slate-400">
            <Link href="/about-us" className="hover:text-violet-600 transition-colors">About Us</Link>
            <Link href="/contact-us" className="hover:text-violet-600 transition-colors">Contact Us</Link>
            <Link href="/privacy-policy" className="hover:text-violet-600 transition-colors text-slate-600">Privacy Policy</Link>
          </div>
          <p className="text-sm font-bold text-slate-400">
            © 2025 Shikshaintel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
