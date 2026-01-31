"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface FAQCard {
  id: string;
  image: string;
  title: string;
  questions: Question[];
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const t = useTranslations("FAQ");

  const toggleItem = (cardId: string, itemId: number) => {
    const key = `${cardId}-${itemId}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const faqCards: FAQCard[] = [
    {
      id: "makeup",
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_5.png?v=1686370982&width=750",
      title: t("section1Title"),
      questions: [
        {
          id: 1,
          question: t("questions.makeup1"),
          answer: t("questions.makeup1Answer"),
        },
        {
          id: 2,
          question: t("questions.makeup2"),
          answer: t("questions.makeup2Answer"),
        },
        {
          id: 3,
          question: t("questions.makeup3"),
          answer: t("questions.makeup3Answer"),
        },
        {
          id: 4,
          question: t("questions.makeup4"),
          answer: t("questions.makeup4Answer"),
        },
      ],
    },
    {
      id: "skincare",
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_6.png?v=1686371560&width=750",
      title: t("section2Title"),
      questions: [
        {
          id: 1,
          question: t("questions.skincare1"),
          answer: t("questions.skincare1Answer"),
        },
        {
          id: 2,
          question: t("questions.skincare2"),
          answer: t("questions.skincare2Answer"),
        },
        {
          id: 3,
          question: t("questions.skincare3"),
          answer: t("questions.skincare3Answer"),
        },
        {
          id: 4,
          question: t("questions.skincare4"),
          answer: t("questions.skincare4Answer"),
        },
      ],
    },
    {
      id: "nails",
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_4_5e611dac-4734-472b-867b-b96d0ab2bd61.png?v=1686372798&width=750",
      title: t("section3Title"),
      questions: [
        {
          id: 1,
          question: t("questions.nails1"),
          answer: t("questions.nails1Answer"),
        },
        {
          id: 2,
          question: t("questions.nails2"),
          answer: t("questions.nails2Answer"),
        },
        {
          id: 3,
          question: t("questions.nails3"),
          answer: t("questions.nails3Answer"),
        },
        {
          id: 4,
          question: t("questions.nails4"),
          answer: t("questions.nails4Answer"),
        },
      ],
    },
  ];

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center mt-5">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t("pageTitle")}
          </h1>
          <div className="text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700">
              {t("breadcrumbHome")}
            </a>
            <span className="mx-2">/</span>
            <span>{t("breadcrumbFAQ")}</span>
          </div>
        </div>
        <div className="space-y-20 mt-20">
          {faqCards.map((card, index) => (
            <div
              key={card.id}
              className="grid md:grid-cols-2 gap-12 items-start"
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {card.title}
                </h2>
                <div className="space-y-1">
                  {card.questions.map((item) => {
                    const key = `${card.id}-${item.id}`;
                    const isOpen = openItems[key];

                    return (
                      <div key={item.id} className="border-b border-gray-200">
                        <button
                          onClick={() => toggleItem(card.id, item.id)}
                          className="w-full flex justify-between items-center text-left py-4 group"
                        >
                          <span className="text-gray-800 font-bold pr-4 text-[22px]">
                            {item.question}
                          </span>
                          <span className="text-black shrink-0 cursor-pointer">
                            {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            isOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pb-4 text-gray-500 text-[16px] leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-150 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
