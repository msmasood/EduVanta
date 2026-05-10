import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Defined here so they are registered once at the root layout level.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Inline script that synchronously sets lang/dir on the <html> element
 * based on the URL path before React hydration begins.
 *
 * This is the same pattern used by next-themes for dark-mode class injection.
 * It is required because Next.js 16's staged rendering returns "early headers"
 * in the root layout that do not include middleware-injected request headers,
 * making headers().get("x-next-intl-locale") unreliable at this layout level.
 *
 * suppressHydrationWarning on <html> prevents React from overwriting these
 * values during hydration since the server default ("en"/"ltr") may differ.
 */
const LOCALE_ATTRS_SCRIPT = `(function(){try{var l=(window.location.pathname.split('/')[1])||'en';var v=['en','ar','ur'];var r=['ar','ur'];if(v.indexOf(l)<0)l='en';document.documentElement.lang=l;document.documentElement.dir=r.indexOf(l)>=0?'rtl':'ltr';}catch(e){}})();`;

export const metadata: Metadata = {
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
    apple: "/brand/eduvanta-logo-square.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <head>
        {/*
         * This script runs synchronously before React hydration, overriding
         * the default lang/dir with the correct locale from the URL path.
         * Placed inside <head> so React 19 can hoist it correctly.
         */}
        <script dangerouslySetInnerHTML={{ __html: LOCALE_ATTRS_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
