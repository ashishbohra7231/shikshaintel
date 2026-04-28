import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shikshaintel | Smart Library Management",
  description: "Automate and manage your library with Shikshaintel. The ultimate platform for library owners to manage seats, students, and revenue.",
  keywords: ["library management", "study hub management", "seat mapping", "library automation", "shikshaintel"],
  authors: [{ name: "Shikshaintel Team" }],
  openGraph: {
    title: "Shikshaintel | Smart Library Management",
    description: "Automate and manage your library with Shikshaintel.",
    url: "https://www.shikshaintel.in",
    siteName: "Shikshaintel",
    images: [
      {
        url: "https://www.shikshaintel.in/dashboard-1.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shikshaintel | Smart Library Management",
    description: "Automate and manage your library with Shikshaintel.",
    images: ["https://www.shikshaintel.in/dashboard-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
