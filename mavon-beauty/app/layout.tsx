import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import RootLayoutComponent from "@/Layout/RootLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beauty Store",
  description: "Admin panel and e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <RootLayoutComponent>{children}</RootLayoutComponent>
      </body>
    </html>
  );
}