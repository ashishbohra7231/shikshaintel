import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import { FiArrowLeft } from "react-icons/fi";
import { blogPosts } from "@/constants/blogData";

// Generate static params so these pages can be built statically
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata based on the slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found | Shikshaintel",
    };
  }

  return {
    title: `${post.title} | Shikshaintel Library Business Guide`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

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
              href="/blog" 
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors"
            >
              <FiArrowLeft /> Back to Blog
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Article Header */}
          <div className="mb-12 text-center">
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em] mb-4 block">Library Business Guide</span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-500 font-bold">
              Published on {post.date}
            </p>
          </div>

          {/* Article Content */}
          <article className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
            <div 
              className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600 prose-a:text-violet-600 prose-a:font-bold hover:prose-a:text-violet-700 prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Call to Action Footer */}
          <div className="mt-16 text-center">
            <p className="text-slate-500 font-bold mb-6">Want to make your library management effortless?</p>
            <Link 
              href="/auth/register" 
              className="inline-block bg-slate-900 text-white font-black px-10 py-4 rounded-2xl text-[15px] hover:bg-violet-700 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Start Using Shikshaintel Free ✦
            </Link>
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
