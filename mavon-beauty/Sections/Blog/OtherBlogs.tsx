"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function OtherBlogs() {
  const t = useTranslations("Blog");

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto py-12">
        {/* Three Column Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Article 1 */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&q=80"
                alt="Natural Beauty"
                className="w-full h-80 object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("article3Title")}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("article3Desc")}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{t("monthJune")}</span>
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              <span>{t("author")}</span>
            </div>
          </div>

          {/* Article 2 */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
                alt="Face Mask"
                className="w-full h-80 object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("article4Title")}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("article4Desc")}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{t("monthJune")}</span>
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              <span>{t("author")}</span>
            </div>
          </div>

          {/* Article 3 */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&q=80"
                alt="Skincare"
                className="w-full h-80 object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("article5Title")}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("article5Desc")}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{t("monthJune")}</span>
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              <span>{t("author")}</span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button className="w-12 h-12 rounded-full bg-gray-900 text-white font-medium">
            1
          </button>
          <button className="w-12 h-12 rounded-full bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-400 font-medium transition-all">
            2
          </button>
          <button className="w-12 h-12 rounded-full bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-400 transition-all flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
