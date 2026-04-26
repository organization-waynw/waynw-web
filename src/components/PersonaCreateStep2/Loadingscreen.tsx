import { useState, useEffect } from "react";
import otherItems from "../../assets/images/persona/create/question/other_items.png";
import { QUESTIONS } from "../../data/QUESTIONS";
import { QUOTES } from "../../data/QUOTES";
import { AnswersMap } from "../../types/Persona/Personacreate2.types";

interface LoadingScreenProps {
  answers: AnswersMap;
}

export function LoadingScreen({ answers }: LoadingScreenProps) {
  const [dotCount, setDotCount] = useState(2);
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * QUOTES.length),
  );
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
        setFadeIn(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[quoteIndex];

  const selectedImages = QUESTIONS.map((q) => {
    const ans = answers[q.id];
    if (!ans) return null;
    const opt = q.options[ans.optionIndex];
    if (!opt) return null;
    if ((opt as any).isCustom) return otherItems;
    return opt.imagePath;
  }).filter((v): v is string => Boolean(v));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-white">
      {/* 좌하단 */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: "400px", height: "400px", overflow: "visible" }}
      >
        {selectedImages.slice(0, 2).map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              width: 240,
              height: 344,
              objectFit: "cover",
              borderRadius: 10,
              bottom: i === 0 ? -20 : 10,
              left: i === 0 ? -30 : 45,
              transform: `rotate(${i === 0 ? -20 : -8}deg)`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* 우하단 */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: "400px", height: "400px", overflow: "visible" }}
      >
        {selectedImages.slice(2, 4).map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              width: 240,
              height: 344,
              objectFit: "cover",
              borderRadius: 10,
              bottom: i === 0 ? 10 : -20,
              right: i === 0 ? 45 : -30,
              transform: `rotate(${i === 0 ? 8 : 20}deg)`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* 텍스트 */}
      <div className="z-10 flex flex-col items-center gap-4 px-8 text-center">
        <h1 className="text-4xl font-black text-[#0F1C46]">
          페르소나 생성중{".".repeat(dotCount)}
        </h1>
        <p
          className="max-w-lg mt-2 text-base text-gray-400"
          style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          {quote.이름} - {quote.내용}
        </p>
      </div>
    </div>
  );
}
