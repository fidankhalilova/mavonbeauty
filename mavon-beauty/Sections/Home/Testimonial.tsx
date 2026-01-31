"use client";
import React, { useState } from "react";
interface Testimonial {
  id: number;
  title: string;
  content: string;
  rating: number;
  author: {
    name: string;
    position: string;
    image: string;
  };
}
import { useTranslations } from "next-intl";
const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("Home.testimonials");

  const testimonials = [
    {
      id: 1,
      title: t("testimonial1.title"),
      content: t("testimonial1.content"),
      rating: 5,
      author: {
        name: t("testimonial1.authorName"),
        position: t("testimonial1.authorPosition"),
        image:
          "https://mavon-beauty.myshopify.com/cdn/shop/files/1_4a0b4a9d-b20a-4502-be43-4a504d45adbe.png?v=1686139245",
      },
    },
    {
      id: 2,
      title: t("testimonial2.title"),
      content: t("testimonial2.content"),
      rating: 5,
      author: {
        name: t("testimonial2.authorName"),
        position: t("testimonial2.authorPosition"),
        image:
          "https://mavon-beauty.myshopify.com/cdn/shop/files/2_fbedb4ac-7d26-4c02-826f-49a0925b4316.png?v=1686139244",
      },
    },
    {
      id: 3,
      title: t("testimonial3.title"),
      content: t("testimonial3.content"),
      rating: 5,
      author: {
        name: t("testimonial3.authorName"),
        position: t("testimonial3.authorPosition"),
        image:
          "https://mavon-beauty.myshopify.com/cdn/shop/files/1_4a0b4a9d-b20a-4502-be43-4a504d45adbe.png?v=1686139245",
      },
    },
  ];

  const itemsPerView = 2;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="text-yellow-400 text-xl">
        ★
      </span>
    ));
  };

  return (
    <section
      className="py-16 bg-[#Fffbf3] mt-10"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
          {t("sectionTitle")}
        </h2>

        <div className="relative max-w-7xl mx-auto">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="group absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 -ml-5 md:-translate-x-12 z-10 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center
                    hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-[calc(50%-12px)] bg-white p-8 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {testimonial.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>
                  <div className="flex gap-1 mb-6">
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.author.image}
                      alt={testimonial.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {testimonial.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.author.position}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="group absolute right-0 top-1/2 -mr-5 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center
                    hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
