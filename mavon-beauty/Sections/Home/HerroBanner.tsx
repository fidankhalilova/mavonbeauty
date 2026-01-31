"use client";
import { SetStateAction, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("Home.hero");

  const slides = [
    {
      title: t("title"),
      description: t("description"),
      buttonText: t("shopNow"),
      bgImage:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/slide-3.png?v=1686133735&width=3840",
    },
    {
      title: t("title"),
      description: t("description"),
      buttonText: t("shopNow"),
      bgImage:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/slide-2.png?v=1686133723&width=3840",
    },
    {
      title: t("title"),
      description: t("description"),
      buttonText: t("shopNow"),
      bgImage:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/1_425d9126-6a25-4410-924c-d10c76458ce2.png?v=1686133695&width=3840",
    },
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
  };
  return (
    <div
      className="relative w-full h-225   overflow-hidden"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-7xl mx-auto px-8 h-full flex items-center">
              <div className="max-w-2xl">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-5xl  font-bold text-black leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-black max-w-lg">
                    {slide.description}
                  </p>
                  <button className="bg-[#0AA350] rounded-[6px] hover:bg-emerald-700 text-white font-semibold px-8 py-3 transition-colors duration-300">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-4 z-10 ml-77.5 -translate-y-12.5">
        <button
          onClick={prevSlide}
          className="cursor-pointer  transition-all duration-300"
        >
          <ChevronLeft className="w-7 h-7 text-black" />
        </button>
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "bg-black border-black w-5"
                  : "bg-transparent border-black hover:bg-black/10"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="cursor-pointer   transition-all duration-300"
        >
          <ChevronRight className="w-7 h-7 text-black" />
        </button>
      </div>
    </div>
  );
}
