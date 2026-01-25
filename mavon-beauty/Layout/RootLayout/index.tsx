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
  const isAuthPage = pathname === "/users" || pathname === "/dashboard" || pathname === "/products" || pathname === "/color" || pathname === "/brand" || pathname === "/size" || pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname ? pathname.startsWith("/admin") : false;
  console.log(" Current pathname:", pathname);
  console.log(" Is admin page:", isAdminPage);
  const hideLayout = isAuthPage || isAdminPage;
  return (
    <>
      {!hideLayout && <Header />}
      <main className={!hideLayout ? "pt-16" : ""}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}