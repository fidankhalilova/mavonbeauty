"use client";
import { useTranslations } from "next-intl";

export default function ShopDirection() {
  const t = useTranslations("ShopDetail");

  return (
    <div className="w-full bg-white mt-20">
      <div className="h-125 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Side - Text Content */}
          <div className="bg-orange-50 flex items-center justify-center p-8 lg:p-12 h-full">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                {t("readyFashion")}
              </h2>
              <button className="bg-gray-900 text-white px-8 py-4 rounded font-semibold hover:bg-gray-800 transition-colors text-lg">
                {t("shopNow")}
              </button>
            </div>
          </div>

          {/* Right Side - Product Image */}
          <div className="relative h-full w-full overflow-hidden">
            <img
              src="https://mavon-beauty.myshopify.com/cdn/shop/files/2.1080X1080.png?v=1686216979&width=1500"
              alt="Organcy skincare products"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
