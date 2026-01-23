// layout/index.tsx
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Auth və Admin səhifələrini yoxla
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");

  // Auth və ya Admin səhifəsidirsə, header/footer göstərmə
  const hideLayout = isAuthPage || isAdminPage;

  return (
    <>
      {!hideLayout && <Header />}
      <main className={!hideLayout ? "pt-16" : ""}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
