"use client";

import { useTranslations } from "next-intl";

export default function SubsEmail() {
  const t = useTranslations("AboutUs");

  return (
    <div className="bg-[#fcf5ee] py-10 px-14 mt-20">
      <div className="grid grid-cols-2 gap-6 items-center justify-between">
        <div className="w-full flex flex-col justify-center gap-4">
          <h1 className="text-4xl text-[#333] font-bold tracking-wide">
            {t("subscribeToEmails")}
          </h1>
          <p className="text-[#666666] text-sm">{t("subscribeDescription")}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder={t("enterEmail")}
            className="w-full p-3 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d9b38c]"
          />
        </div>
      </div>
    </div>
  );
}
