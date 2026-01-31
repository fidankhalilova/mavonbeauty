"use client";
import { useTranslations } from "next-intl";
export default function Offer() {
  const t = useTranslations("Shop.offer");
  return (
    <div className="w-full h-75 overflow-hidden">
      <div className="border-2 border-dashed border-gray-300 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="bg-gray-50 flex items-center justify-center py-8 px-8 lg:py-8 h-full">
            <div className="text-center">
              <p className="text-sm tracking-[0.3em] text-gray-600 mb-8 uppercase">
                Limited Time Offer
              </p>
              <h2 className="text-7xl font-bold mb-4">
                <span className="text-black">50%</span>{" "}
                <span
                  className="text-black font-light"
                  style={{
                    WebkitTextStroke: "2px black",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 300,
                  }}
                >
                  {t("discount").split(" ")[1]}
                </span>
              </h2>
            </div>
          </div>

          <div className="bg-blue-100 h-full relative overflow-hidden">
            <img
              src="https://mavon-beauty.myshopify.com/cdn/shop/files/Shop_page_Banner_Image.png?v=1686216840&width=1500"
              alt="Spa treatment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
