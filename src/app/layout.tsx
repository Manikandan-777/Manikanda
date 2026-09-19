import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { CursorBinary } from "@/components/ui/cursor-binary";
import { profile, sections, settings } from "@/lib/content";

// Self-hosted at build time by next/font, with font-display: swap and no layout shift.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.bio,
  keywords: ["Manikandan P", "AI", "Data Science", "portfolio", "machine learning"],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: settings.siteUrl,
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
      style={
        {
          "--accent": settings.theme.accent,
          "--accent-contrast": settings.theme.accentContrast,
        } as React.CSSProperties
      }
    >
      <body className="min-h-screen antialiased">
        {/* Pre-hydration black cover so the intro never flashes the page first. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='mp-intro@v1';var r=document.documentElement;" +
              "if(!sessionStorage.getItem(k)&&!matchMedia('(prefers-reduced-motion: reduce)').matches){" +
              "r.classList.add('intro-lock');" +
              "setTimeout(function(){r.classList.remove('intro-lock')},9000);}}catch(e){}",
          }}
        />
        <IntroSequence />
        <ThemeProvider defaultMode={settings.defaultMode}>
          <a
            href="#top"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <CursorBinary />
          <Nav
            sections={sections.map((s) => ({ id: s.id, label: s.label }))}
            name={profile.name}
            resumeUrl={profile.resumeUrl}
          />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <JsonLd />
      </body>
    </html>
  );
}
