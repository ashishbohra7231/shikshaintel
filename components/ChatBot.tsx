"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageCircle, FiChevronDown } from "react-icons/fi";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const QA: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hi", "hello", "hey", "hii", "namaste"],
    answer: "👋 Hello! I'm Shiksha Assistant. I can help you learn about Shikshaintel's library management features. Try asking about pricing, notifications, students, revenue, or seats!",
  },
  {
    keywords: ["price", "pricing", "cost", "fee", "plan", "charge", "rupee", "₹"],
    answer: "💰 Shikshaintel offers flexible pricing plans for library owners. We have monthly, quarterly, and yearly subscription options for your students. You can set custom pricing for half-day and full-day shifts from your dashboard settings.",
  },
  {
    keywords: ["notification", "alert", "email", "sms", "remind", "expiry", "expire"],
    answer: "🔔 Shikshaintel automatically sends email notifications to students before their subscription expires. You can configure the timing (e.g., 1 AM daily) and the system also flags students expiring today on your dashboard.",
  },
  {
    keywords: ["student", "enroll", "add", "register", "new student"],
    answer: "🎓 Adding students is super easy! Go to your branch dashboard → click 'Add Student' → fill in their name, phone, seat number, plan, and shift. You can also bulk upload students using a CSV file.",
  },
  {
    keywords: ["seat", "capacity", "available", "book", "assign"],
    answer: "💺 Shikshaintel manages seat allocation automatically. It tracks which seats are taken for morning, evening, and full-day shifts, so you never double-book. The dashboard shows live occupancy percentages for each branch.",
  },
  {
    keywords: ["revenue", "income", "earning", "money", "profit", "finance"],
    answer: "📊 The Revenue Dashboard gives you a full breakdown of monthly earnings per branch, total network revenue, and per-student averages. You can view trends across all your library locations in one place.",
  },
  {
    keywords: ["branch", "library", "location", "multiple", "network"],
    answer: "🏛️ Shikshaintel supports multi-branch management! Add unlimited library branches under a single account and monitor all of them from one unified dashboard — no need to log in separately for each location.",
  },
  {
    keywords: ["shift", "morning", "evening", "full day", "timing", "schedule"],
    answer: "⏰ Shikshaintel supports three shift types: Morning, Evening, and Full Day. You can configure shift timings for each branch and students are enrolled under a specific shift to avoid seat conflicts.",
  },
  {
    keywords: ["start", "setup", "begin", "get started", "onboard", "trial"],
    answer: "🚀 Getting started is free and takes less than 5 minutes! Just click 'Get Started' on the homepage, create your account, and add your first library branch. No credit card needed.",
  },
  {
    keywords: ["bulk", "upload", "csv", "import", "excel"],
    answer: "📁 You can bulk-upload students via CSV from the branch page. Just click 'Bulk Upload', download our template, fill it in, and upload — all students get enrolled automatically.",
  },
  {
    keywords: ["inactive", "deactivate", "remove", "suspend", "block"],
    answer: "🔒 You can deactivate a student at any time from the roster table. Inactive students lose access but their records are preserved. You can reactivate them later with a fresh seat and plan.",
  },
  {
    keywords: ["whatsapp", "wa", "message", "contact", "support"],
    answer: "💬 You can send WhatsApp messages directly to students from the roster. Just click the WhatsApp icon next to any student's row on the branch page.",
  },
  {
    keywords: ["login", "sign in", "password", "account", "auth"],
    answer: "🔐 Shikshaintel uses secure token-based authentication. Library owners log in with their email and password. Sessions are protected and you'll be automatically redirected if your session expires.",
  },
  {
    keywords: ["mobile", "phone", "responsive", "app", "android", "ios"],
    answer: "📱 Shikshaintel is fully mobile-responsive! Manage your library on the go from any smartphone browser — no separate app download required.",
  },
  // --- Conversion / Buying Intent ---
  {
    keywords: ["join", "sign up", "signup", "create account", "register", "free", "try"],
    answer: "🎉 Joining Shikshaintel is completely free to get started! Click the 'Get Started' button on this page, create your owner account, and set up your first library branch in minutes. No credit card required!",
  },
  {
    keywords: ["buy", "purchase", "subscribe", "subscription", "pay", "payment", "upgrade"],
    answer: "💳 Shikshaintel operates on a simple SaaS model. You get full access to all features when you sign up. Reach out to us via the contact button or WhatsApp to discuss enterprise or bulk pricing for multiple branches.",
  },
  {
    keywords: ["demo", "show", "example", "screenshot", "preview", "look", "see"],
    answer: "🖥️ You can see live screenshots and feature highlights right here on the landing page! Scroll down to explore the dashboard preview, notification system, and seat management sections. Or click 'Get Started' for a hands-on experience.",
  },
  {
    keywords: ["free trial", "trial", "test", "explore", "without paying"],
    answer: "✅ Yes! You can explore Shikshaintel completely free. Sign up, add your library, and start managing students — no upfront payment needed. Experience the full dashboard before committing to anything.",
  },
  {
    keywords: ["contact", "reach", "talk", "call", "email us", "help", "human", "sales"],
    answer: "📞 Want to talk to our team? You can reach us via the WhatsApp button on the landing page or email us directly. We typically respond within a few hours during business hours (IST).",
  },
  {
    keywords: ["how it works", "how does", "explain", "what is", "about", "overview"],
    answer: "💡 Shikshaintel is a cloud-based library management SaaS. Here's how it works:\n1. You sign up as a library owner.\n2. Add your branch(es) with seat capacity and shift timings.\n3. Enroll students with their plan, shift, and seat.\n4. The system handles renewals, notifications, and revenue tracking automatically!",
  },
  {
    keywords: ["why", "benefit", "advantage", "better", "choose", "different", "compared"],
    answer: "🌟 Why Shikshaintel?\n✅ Multi-branch management in one dashboard\n✅ Auto expiry notifications to students\n✅ Real-time seat occupancy tracking\n✅ Revenue analytics per branch\n✅ Bulk student import via CSV\n✅ Mobile-friendly, no app needed\n\nAll this for free to get started!",
  },
  {
    keywords: ["safe", "secure", "data", "privacy", "trust", "protect"],
    answer: "🔒 Your data is safe with Shikshaintel. We use secure JWT-based authentication, encrypted storage, and your library data is private to your account only. We never share your data with third parties.",
  },
  {
    keywords: ["how many", "limit", "unlimited", "max", "restrict"],
    answer: "♾️ There are no hard limits on the number of branches, students, or seats you can add. Shikshaintel is built to scale with your library business — from a single reading room to a city-wide network.",
  },
];

const SUGGESTIONS = [
  "How do I join for free?",
  "Can I get a demo?",
  "Why choose Shikshaintel?",
  "What is the pricing?",
  "How do notifications work?",
  "Can I manage multiple branches?",
  "How to add a student?",
  "Is my data secure?",
  "Are there any limits?",
  "How does it work?",
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const qa of QA) {
    if (qa.keywords.some((kw) => lower.includes(kw))) {
      return qa.answer;
    }
  }
  return "🤔 I'm not sure about that yet! For more info, feel free to reach out to our support team or click 'Get Started' to explore the platform yourself.";
}

let idCounter = 10;

export default function ChatBot({ isGreenTheme = false }: { isGreenTheme?: boolean }) {
  const [open, setOpen] = useState(false);
  
  const theme = {
    gradient: isGreenTheme ? "from-emerald-600 to-teal-600" : "from-violet-600 to-fuchsia-600",
    shadow: isGreenTheme ? "shadow-emerald-400/40" : "shadow-violet-400/40",
    shadowWindow: isGreenTheme ? "shadow-emerald-200/50" : "shadow-violet-200/50",
    text: isGreenTheme ? "text-emerald-700" : "text-violet-700",
    bgLight: isGreenTheme ? "bg-emerald-50" : "bg-violet-50",
    borderLight: isGreenTheme ? "border-emerald-100" : "border-violet-100",
    focusBorder: isGreenTheme ? "focus:border-emerald-400" : "focus:border-violet-400",
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "👋 Hi! I'm Shiksha Assistant. Ask me anything about Shikshaintel — pricing, features, notifications, and more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++idCounter, from: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((prev) => [...prev, { id: ++idCounter, from: "bot", text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br ${theme.gradient} rounded-full shadow-xl ${theme.shadow} flex items-center justify-center text-white hover:scale-105 transition-transform active:scale-95`}
        aria-label="Open chat"
      >
        {open ? <FiChevronDown size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl ${theme.shadowWindow} border border-slate-100 flex flex-col overflow-hidden`}
          style={{ maxHeight: "520px" }}>

          {/* Header */}
          <div className={`bg-gradient-to-r ${theme.gradient} px-4 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm">
                Si
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Shiksha Assistant</p>
                <p className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Always online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50" style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? `bg-gradient-to-br ${theme.gradient} text-white rounded-br-sm`
                      : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-slate-100 bg-white scrollbar-none">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full ${theme.bgLight} ${theme.text} border ${theme.borderLight} hover:bg-opacity-80 transition-colors whitespace-nowrap`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask something..."
              className={`flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none ${theme.focusBorder} transition-colors`}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className={`w-9 h-9 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-all flex-shrink-0`}
            >
              <FiSend size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
