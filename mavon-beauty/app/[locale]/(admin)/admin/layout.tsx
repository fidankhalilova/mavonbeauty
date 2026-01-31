"use client";
import React from "react";
import AdminLayout from "@/Layout/AdminSideBar/Header";
import {
  Home,
  Users,
  Package,
  Palette,
  Tag,
  Ruler,
  PackageOpen,
  MessageCircle,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", icon: Home, label: "Dashboard", href: "/admin" },
  { id: "users", icon: Users, label: "Users", href: "/admin/users" },
  { id: "products", icon: Package, label: "Products", href: "/admin/products" },
  { id: "color", icon: Palette, label: "Color", href: "/admin/color" },
  { id: "brand", icon: Tag, label: "Brand", href: "/admin/brand" },
  { id: "size", icon: Ruler, label: "Size", href: "/admin/size" },
  { id: "orders", icon: PackageOpen, label: "Orders", href: "/admin/orders" },
  {
    id: "comments",
    icon: MessageCircle,
    label: "Comments",
    href: "/admin/comments",
  },
];

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout menuItems={menuItems}>{children}</AdminLayout>;
}
