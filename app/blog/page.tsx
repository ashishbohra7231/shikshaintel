import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiArrowLeft, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { blogPosts } from "@/constants/blogData";

export const metadata = {
  title: "Blog | Shikshaintel - Library Management Resources",
  description: "Read the latest tips, guides, and ideas on how to start, manage, and grow a profitable library business or study hub in India.",
  keywords: ["library business", "library management", "study hub", "library business plan"],
};

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Navigation */}
      <header className="fixed w-full top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <nav className="w-full max-w-4xl bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-sm px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo isGreenTheme={false} />
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors"
            >
              <FiArrowLeft /> Back to Home
            </Link>
            <Link 
              href="/auth/register" 
              className="text-sm font-bold bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-violet-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em] mb-4 block">Resources & Guides</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Library Business Insights
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              Everything you need to know about starting, managing, and scaling a profitable self-study library business in India.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                <article className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm group-hover:shadow-md group-hover:border-violet-200 transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 transition-transform">
                    <FiBookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mb-4 group-hover:text-violet-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-600 group-hover:gap-3 transition-all mt-auto pt-4 border-t border-slate-100">
                    Read Article <FiArrowRight />
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-xl shadow-slate-200">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-white mb-4">Ready to automate your library?</h2>
              <p className="text-slate-300 font-medium mb-8">
                Join hundreds of library owners who have scaled their profits and eliminated manual work with Shikshaintel.
              </p>
              <Link 
                href="/auth/register" 
                className="inline-block bg-white text-slate-900 font-black px-10 py-4 rounded-2xl text-[15px] hover:bg-violet-600 hover:text-white transition-all active:scale-95 shadow-xl"
              >
                Create Free Account ✦
              </Link>
            </div>
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
            <Link href="/terms-and-conditions" className="hover:text-violet-600 transition-colors">Terms & Conditions</Link>
            <Link href="/blog" className="hover:text-violet-600 transition-colors text-slate-600">Blog</Link>
          </div>
          <p className="text-sm font-bold text-slate-400">
            © 2025 Shikshaintel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
