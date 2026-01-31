import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import RootLayoutComponent from "@/Layout/RootLayout";
import { CartProvider } from "@/context/CardContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mavon - Beauty Store",
  description: "Admin panel and e-commerce",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;

  // Validate locale - this prevents redirect loops
  if (!routing.locales.includes(locale as any)) {
    notFound(); // Return 404 for invalid locale
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${montserrat.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <RootLayoutComponent>{children}</RootLayoutComponent>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
