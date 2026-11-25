import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// One typeface for body and headings keeps the page calm and saves a font download.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tctorbit.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141518" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TCT Orbit — Browse in Orbit. Focused, Fast, Private.",
    template: "%s | TCT Orbit",
  },
  description:
    "A fast, distraction-free desktop web browser for Windows, macOS and Linux. Built on Chromium with sovereign local data, spaces, split view and zero telemetry.",
  keywords: [
    "browser",
    "private browser",
    "chromium browser",
    "fast browser",
    "distraction-free browser",
    "spaces",
    "split view",
    "zero telemetry",
    "TCT Orbit",
  ],
  authors: [{ name: "The Capy Team (TCT)" }],
  creator: "The Capy Team (TCT)",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "TCT Orbit",
    title: "TCT Orbit — Browse in Orbit. Focused, Fast, Private.",
    description:
      "A fast, distraction-free desktop web browser for Windows, macOS and Linux. Built on Chromium with sovereign local data and zero telemetry.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TCT Orbit Browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TCT Orbit — Browse in Orbit. Focused, Fast, Private.",
    description:
      "A fast, distraction-free desktop web browser for Windows, macOS and Linux. Zero telemetry, spaces, split view.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TCT Orbit",
  image: `${siteUrl}/logo.png`,
  operatingSystem: "Windows 10/11 (x64), macOS 10.15+ (Apple Silicon), Linux (x64)",
  applicationCategory: "BrowserApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "A fast, distraction-free desktop web browser for Windows, macOS and Linux. Built on Chromium with zero telemetry, spaces, and split view.",
  publisher: {
    "@type": "Organization",
    name: "The Capy Team (TCT)",
    url: "https://tctorbit.com",
    email: "support@tctorbit.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("h-full", inter.variable, jetbrainsMono.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/25">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
