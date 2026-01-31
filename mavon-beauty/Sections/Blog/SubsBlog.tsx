"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function SubsBlog() {
  const t = useTranslations("Blog");

  return (
    <div className="bg-[#fcf5ee] py-10 px-14 mt-20">
      <div className="grid grid-cols-2 gap-6 items-center justify-between">
        <div className="w-full flex flex-col justify-center gap-4">
          <h1 className="text-4xl text-[#333] font-bold tracking-wide">
            {t("subscribeTitle")}
          </h1>
          <p className="text-[#666666] text-sm">{t("subscribeDesc")}</p>
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
  );
}
