"use client";
import { useTranslations } from "next-intl";

export default function TextSlider() {
  const t = useTranslations("Home.textSlider");

  const messages = [
    { text: t("message1"), outlined: false },
    { text: t("message2"), outlined: true },
    { text: t("message3"), outlined: false },
  ];
  const repeatedMessages = [
    ...messages,
    ...messages,
    ...messages,
    ...messages,
    ...messages,
    ...messages,
  ];
  return (
    <div className="w-full overflow-hidden bg-[#FFFBF3] h-32.5 flex items-center">
      <div className="flex animate-scroll items-center">
        {repeatedMessages.map((msg, idx) => (
          <span
            key={idx}
            className={`mx-12 text-4xl font-bold whitespace-nowrap ${
              msg.outlined ? "text-transparent" : "text-black"
            }`}
            style={
              msg.outlined
                ? {
                    WebkitTextStroke: "2px black",
                  }
                : {}
            }
          >
            {msg.text}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: flex;
          will-change: transform;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
