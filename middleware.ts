import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // Explicitly allow Facebook, WhatsApp, Twitter, and other social bots
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
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/about-us", "/contact-us", "/privacy-policy"],
};