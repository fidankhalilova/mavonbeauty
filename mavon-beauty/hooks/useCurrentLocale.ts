// hooks/useCurrentLocale.ts
"use client";

import { useState, useEffect } from "react";

export function useCurrentLocale() {
  const [locale, setLocale] = useState<string>("en");

  useEffect(() => {
    // Function to extract locale from URL
    const getLocaleFromUrl = () => {
      if (typeof window === "undefined") return "en";

      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      if (
        pathSegments.length > 0 &&
        ["en", "az", "ru"].includes(pathSegments[0])
      ) {
        return pathSegments[0];
      }
      return "en";
    };

    setLocale(getLocaleFromUrl());

    // Listen for URL changes (for single page apps)
    const handleLocationChange = () => {
      setLocale(getLocaleFromUrl());
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return locale;
}
