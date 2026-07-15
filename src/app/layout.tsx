import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Metrika } from "@/components/analytics/Metrika";
import { ClickTracker } from "@/components/analytics/ClickTracker";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/structured-data";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = "https://pro-pochvu.ru";
const SITE_NAME = "Пропочву";
const DEFAULT_TITLE =
  "Пропочву — органические удобрения и вертикальные сады";
const DEFAULT_DESCRIPTION =
  "Органические удобрения для рассады, орхидей и огорода — биогумус, конский навоз, грунты. Доставка по всей России от 99 ₽. Более 30 000 отзывов, рейтинг 4.9.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Пропочву",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "биогумус",
    "органические удобрения",
    "ЭКО Конь",
    "Цветология",
    "фитомодули",
    "вертикальное озеленение",
    "био-чай для растений",
    "удобрение для рассады",
    "удобрение для орхидей",
    "удобрение для цветущих",
  ],
  authors: [{ name: "ООО «Цветология»" }],
  creator: "ООО «Цветология»",
  publisher: "ООО «Цветология»",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Пропочву — органические удобрения и фитомодули",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    ...(process.env.NEXT_PUBLIC_MAILRU_VERIFICATION
      ? {
          other: {
            "mailru-domain": process.env.NEXT_PUBLIC_MAILRU_VERIFICATION,
          },
        }
      : {}),
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  category: "shopping",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2d5016",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd();

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieBanner />
        </AuthProvider>
        <Metrika />
        <ClickTracker />
      </body>
    </html>
  );
}
