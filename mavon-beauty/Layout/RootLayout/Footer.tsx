// app/components/Footer.tsx
"use client";

import { Twitter, Facebook, Instagram } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("about")}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("aboutDescription")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-blue-400 hover:text-blue-500 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("search")}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("privacyPolicy")}
                </a>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("search")}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("termsOfService")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("account")}
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("explore")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("refundPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("shippingReturns")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("contactInfo")}
            </h3>
            <p className="text-gray-600 italic leading-relaxed">
              {t("contactDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-600 text-sm text-center lg:text-left">
              {t("copyright")}
            </p>

            {/* Language & Payment Icons */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <select className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300">
                <option>{t("english")}</option>
                <option>{t("spanish")}</option>
                <option>{t("french")}</option>
              </select>

              {/* Payment Icons */}
              <div className="flex gap-2">
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-xs">VISA</span>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div className="w-10 h-7 bg-blue-600 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AMEX</span>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">P</span>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-xs">D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
