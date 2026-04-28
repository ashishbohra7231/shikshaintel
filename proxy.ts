import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // ✅ Explicitly allow Facebook, WhatsApp, and other social bots
  const socialBots = [
    "facebookexternalhit",
    "Facebot",
    "WhatsApp",
    "Twitterbot",
    "LinkedInBot",
    "Pinterest",
  ];

  const isSocialBot = socialBots.some((bot) => userAgent.includes(bot));

  if (isSocialBot) {
    // If it's a social bot, we just pass it through
    // You can also add custom logic here if you want to serve different content
    return NextResponse.next();
  }

  // Add any other logic for regular users
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/about-us", "/contact-us", "/privacy-policy"],
};
