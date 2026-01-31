// app/components/AboutUs/AboutStore.tsx
"use client";

import { useTranslations } from "next-intl";

export default function AboutStore() {
  const t = useTranslations("AboutUs");

  return (
    <div className="mt-20">
      <div>
        <h1 className="text-5xl text-[#333] font-bold text-center mb-8 px-50 tracking-wide leading-14">
          {t("aboutStore")}
        </h1>
      </div>
      <div>
        <p className="text-[#666666] text-sm text-center mb-12 px-50 leading-7">
          {t("aboutStoreDescription")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="w-full h-160">
          <img
            src="https://mavon-beauty.myshopify.com/cdn/shop/files/1_4a69442b-7d59-45ed-8687-22d0c77b2aad.png?v=1686376114&width=1420"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-160">
          <img
            src="https://mavon-beauty.myshopify.com/cdn/shop/files/4_db12eb12-412a-4f2a-9a41-f7c46c696004.png?v=1686376128&width=1420"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
