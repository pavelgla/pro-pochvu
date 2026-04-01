import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Эко Конь — органические удобрения и вертикальные сады",
    template: "%s | Эко Конь",
  },
  description:
    "D2C экосистема КФХ «Ранчо Мушкино». Органические удобрения «ЭКО Конь» и фитомодули «Цветология» для вертикального озеленения.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
