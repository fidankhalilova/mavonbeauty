"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AboutUsHeader() {
  const t = useTranslations("AboutUs");

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#333333] mb-4 tracking-wide">
          {t("pageTitle")}
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Link href="/" className="hover:text-[#333333] transition-colors">
            {t("home")}
          </Link>
          <span>/</span>
          <span className="text-[#333333]">{t("aboutUs")}</span>
        </div>
      </div>
    </div>
  );
}
