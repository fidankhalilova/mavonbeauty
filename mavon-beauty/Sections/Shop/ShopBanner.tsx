"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AboutUsHeader() {
  const t = useTranslations("Shop.header");

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#f7f8f9] py-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4 tracking-wide uppercase">
            {t("pageTitle")}
          </h1>
          <div className="flex items-center justify-start gap-2 text-gray-600 text-md">
            <Link href="/" className="hover:text-[#333333] transition-colors">
              {t("home")}
            </Link>
            <span>/</span>
            <Link href="/shop" className="text-[#333333]">
              {t("shop")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
