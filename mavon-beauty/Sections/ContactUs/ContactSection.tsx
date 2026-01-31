// app/[locale]/(main)/contact-us/page.tsx
"use client";

import { useTranslations } from "next-intl";

export default function ContactUsPage() {
  const t = useTranslations("ContactUs");

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-20 mt-5">
          {t("title")}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-6 space-y-16">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {t("information")}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {t("informationDescription")}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {t("customerService")}
              </h2>
              <p className="text-gray-500">{t("customerServiceEmail")}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {t("address")}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {t("addressDescription")}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 -mt-30">
            <div className="bg-[#9BD0A51A] rounded-[15px] p-20">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("youCanContactUs")}
                </h2>
                <p className="text-gray-500 text-sm">{t("pleaseComplete")}</p>
              </div>
              <div className="space-y-16">
                <div>
                  <input
                    type="text"
                    placeholder={t("name")}
                    className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t("email")}
                    className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={t("phoneNumber")}
                    className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                  />
                </div>
                <div>
                  <textarea
                    rows={1}
                    placeholder={t("comment")}
                    className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors resize-none placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                  />
                </div>
                <div className="flex justify-center pt-10">
                  <button className="text-gray-900 text-[18px] underline hover:no-underline transition-all font-semibold">
                    {t("send")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
