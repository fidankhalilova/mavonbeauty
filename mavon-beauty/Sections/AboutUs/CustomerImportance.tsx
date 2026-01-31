"use client";

import { useTranslations } from "next-intl";

export default function CustomerImportance() {
  const t = useTranslations("AboutUs");

  return (
    <div className="mt-20">
      <div>
        <h1 className="text-5xl text-[#333] font-bold text-center mb-8 px-50 tracking-wide leading-14">
          {t("customerImportance")}
        </h1>
      </div>
      <div>
        <p className="text-[#666666] text-sm text-center mb-12 px-50 leading-7">
          {t("customerImportanceDescription")}
        </p>
      </div>
      <div className="w-full h-160">
        <img
          src="https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_9.png?v=1686375635&width=1780"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
