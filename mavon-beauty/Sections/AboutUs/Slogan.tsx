"use client";

import { useTranslations } from "next-intl";

export default function Slogan() {
  const t = useTranslations("AboutUs");

  return (
    <div>
      <div>
        <h1 className="text-5xl text-[#333] font-bold text-center mb-8 px-50 tracking-wide leading-14">
          {t("slogan")}
        </h1>
      </div>
      <div className="w-full h-173.75">
        <img
          src="https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_8.png?v=1686375697&width=1500"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
