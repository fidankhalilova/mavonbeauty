"use client";
import { useTranslations } from "next-intl";

export default function SubsEmail() {
  const t = useTranslations("Home.subscribe");

  return (
    <div className="bg-[#fffbf3] max-w-7xl rounded-xl mx-auto py-10 px-14 mt-20">
      <div className="mx-auto px-10">
        <div className="bg-[#fffbf3] grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-12 py-4">
          <div className="w-full flex flex-col justify-center gap-4">
            <h1 className="text-4xl text-[#333] font-bold tracking-wide">
              {t("title")}
            </h1>
            <p className="text-[#666666] text-sm">{t("description")}</p>
          </div>
          <div>
            <input
              type="text"
              placeholder={t("emailPlaceholder")}
              className="w-full p-3 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d9b38c]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
