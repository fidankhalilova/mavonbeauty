"use client";
import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
const BrandInfoSection = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Home.brandInfo");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScrolling || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const sliderX = (sliderPosition / 100) * rect.width;
    const distanceFromSlider = Math.abs(mouseX - sliderX);
    if (distanceFromSlider > 50) return;

    e.preventDefault();
    setIsScrolling(true);

    const delta = e.deltaY;
    const step = 2;

    setSliderPosition((prev) => {
      const newPosition = delta > 0 ? prev + step : prev - step;
      return Math.min(Math.max(newPosition, 0), 100);
    });

    setTimeout(() => setIsScrolling(false), 50);
  };

  return (
    <section
      className="py-16"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="container mx-auto px-4 mt-5">
        <div className="text-center mb-12 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl leading-14 font-normal text-gray-800 mb-4">
            {t("title")}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto mb-16 mt-32.5">
          <div className="flex justify-center items-center gap-8 md:gap-40 flex-wrap">
            <div className="opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/logo-1.png?v=1686138858"
                alt="Brand 1"
                width={120}
                height={120}
                className="grayscale"
              />
            </div>
            <div className="opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/logo-5.png?v=1686138859"
                alt="Brand 2"
                width={120}
                height={120}
                className="grayscale"
              />
            </div>
            <div className="opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/logo-4.png?v=1686138859"
                alt="Brand 3"
                width={120}
                height={120}
                className="grayscale"
              />
            </div>
            <div className="opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/logo-2.png?v=1686138859"
                alt="Brand 4"
                width={120}
                height={120}
                className="grayscale"
              />
            </div>
            <div className="opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/logo-1.png?v=1686138858"
                alt="Brand 5"
                width={120}
                height={120}
                className="grayscale"
              />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32.5">
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            onWheel={handleWheel}
          >
            <img
              src="https://mavon-beauty.myshopify.com/cdn/shop/files/3.1BA.png?v=1686048854&width=1500"
              alt="Before"
              className="w-full h-auto block"
            />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/3.2BA.png?v=1686048888&width=1500"
                alt="After"
                className="h-full object-cover"
                style={{
                  width: `${(100 / sliderPosition) * 100}%`,
                  maxWidth: "none",
                }}
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize pointer-events-auto"
                onMouseMove={handleMouseMove}
              >
                <span className="text-gray-700 text-2xl font-semibold">‹›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BrandInfoSection;
