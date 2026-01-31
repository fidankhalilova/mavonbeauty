import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "az", "ru"],
  defaultLocale: "en",
  localePrefix: "always", // Always show locale in URL
});

// Lightweight navigation utilities for Client Components
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
