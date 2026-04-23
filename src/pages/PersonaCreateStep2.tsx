import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import otherItems from "../assets/images/persona/create/question/other_items.png";
import { QUESTIONS } from "../data/QUESTIONS";
import { QUOTES } from "../data/QUOTES";

// ─── 헬퍼: 선택된 카드 이미지 경로 ─────────────────────────────────────────────

function getSelectedImagePath(
  answers: Record<number, { optionIndex: number; customText: string }>,
  questionId: number,
): string | null {
  const ans = answers[questionId];
  if (!ans) return null;
  const q = QUESTIONS.find((q) => q.id === questionId);
  if (!q) return null;
  const opt = q.options[ans.optionIndex];
  if ((opt as any).isCustom) return otherItems;
  return (opt as any).imagePath ?? null;
}
// ─── 로딩 화면 ────────────────────────────────────────────────────────────────

function LoadingScreen({
  answers,
}: {
  answers: Record<number, { optionIndex: number; customText: string }>;
}) {
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
// ─── 하단 카드 트레이 ─────────────────────────────────────────────────────────

interface CardTrayProps {
  answers: Record<number, { optionIndex: number; customText: string }>;
  totalSteps: number;
}

function CardTray({ answers, totalSteps }: CardTrayProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => {
        const questionId = i + 1;
        const imgPath = getSelectedImagePath(answers, questionId);

        return (
          <div
            key={questionId}
            style={{
              width: 48,
              height: 68,
              borderRadius: 6,
              overflow: "hidden",
              background: imgPath ? "transparent" : "#e2e8f0",
              border: imgPath ? "none" : "1.5px dashed #94a3b8",
              flexShrink: 0,
            }}
          >
            {imgPath ? (
              <img
                src={imgPath}
                alt={`선택 ${questionId}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#cbd5e1",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {questionId}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

function PersonaCreateStep2() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<
    Record<number, { optionIndex: number; customText: string }>
  >({});
  const [editingCustom, setEditingCustom] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const question = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const selectedOptionIndex = answers[question.id]?.optionIndex ?? -1;
  const isCustomSelected = selectedOptionIndex === question.options.length - 1;

  const handleSelectOption = (optionIndex: number) => {
    const option = question.options[optionIndex];
    if ((option as any).isCustom) {
      setEditingCustom(true);
      setCustomInputValue(answers[question.id]?.customText ?? "");
    } else {
      setEditingCustom(false);
    }
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        optionIndex,
        customText: prev[question.id]?.customText ?? "",
      },
    }));
  };

  const handleCustomTextSave = () => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        optionIndex: question.options.length - 1,
        customText: customInputValue,
      },
    }));
    setEditingCustom(false);
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomTextSave();
    }
  };

  const canProceed =
    selectedOptionIndex !== -1 &&
    (!isCustomSelected || Boolean(answers[question.id]?.customText?.trim()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canProceed && !editingCustom) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canProceed, editingCustom, currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      setEditingCustom(false);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setEditingCustom(false);
    } else {
      navigate("/persona/create");
    }
  };

  const handleSubmit = () => {
    const step1Data = JSON.parse(
      sessionStorage.getItem("personaFormStep1") || "{}",
    );

    const finalAnswers = structuredClone(answers);

    const promptKeywords = QUESTIONS.map((q) => {
      const ans = finalAnswers[q.id];
      if (!ans) return "";

      const opt = q.options[ans.optionIndex];
      if ((opt as any).isCustom) return ans.customText ?? "";

      return opt.promptKeywords;
    })
      .filter(Boolean)
      .join(", ");

    const finalData = {
      ...step1Data,
      answers: finalAnswers,
      promptKeywords,
    };

    console.log("최종 페르소나 데이터:", finalData);

    setIsLoading(true);

    setTimeout(() => {
      navigate("/");
    }, 5000);
  };

  if (isLoading) return <LoadingScreen answers={structuredClone(answers)} />;

  return (
    <div className="min-h-screen bg-[#ECF0F9] flex flex-col">
      <main className="flex flex-col items-center flex-1 px-6 py-8">
        {/* 질문 */}
        <h1 className="text-2xl font-bold text-[#0F1C46] text-center max-w-2xl leading-snug">
          {question.question}
        </h1>

        {/* 카드 그리드 */}
        <div className="flex-1 w-full max-w-5xl mt-8">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${question.columns ?? 4}, 202px)`,
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {question.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCustom = (option as any).isCustom;
              return (
                <div key={idx} className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => handleSelectOption(idx)}
                    className={`relative transition-all duration-200 focus:outline-none rounded-xl ${
                      isSelected ? "scale-105" : "hover:scale-[1.03]"
                    }`}
                    style={{ borderRadius: 12 }}
                  >
                    {isCustom ? (
                      <div
                        style={{
                          width: 202,
                          height: 288,
                          background: isSelected ? "#e8ecf5" : "#f1f5f9",
                          border: isSelected
                            ? "2px dashed #0F1C46"
                            : "2px dashed #94a3b8",
                          borderRadius: 12,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          padding: "16px 12px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOption(idx);
                        }}
                      >
                        {isSelected && editingCustom ? (
                          <textarea
                            autoFocus
                            value={customInputValue}
                            onChange={(e) =>
                              setCustomInputValue(e.target.value)
                            }
                            onKeyDown={handleCustomKeyDown}
                            onBlur={handleCustomTextSave}
                            placeholder={"내용을 입력하세요\n(Enter로 저장)"}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: "100%",
                              flex: 1,
                              background: "transparent",
                              border: "none",
                              outline: "none",
                              resize: "none",
                              fontSize: 16,
                              fontWeight: 500,
                              color: "#0F1C46",
                              textAlign: "center",
                              lineHeight: 1.5,
                              cursor: "text",
                            }}
                          />
                        ) : (
                          <>
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={isSelected ? "#0F1C46" : "#94a3b8"}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            <span
                              style={{
                                color: isSelected ? "#0F1C46" : "#64748b",
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              기타
                            </span>
                            <span
                              style={{
                                color: isSelected ? "#3b4f8a" : "#94a3b8",
                                fontSize: 15,
                                textAlign: "center",
                                padding: "0 12px",
                                lineHeight: 1.4,
                              }}
                            >
                              {isSelected && answers[question.id]?.customText
                                ? answers[question.id].customText
                                : "직접 입력"}
                            </span>
                            {isSelected && (
                              <span
                                style={{ color: "#94a3b8", fontSize: 11 }}
                              >
                                클릭하여 수정
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <img
                        src={(option as any).imagePath}
                        alt={option.label}
                        style={{
                          width: 202,
                          height: 288,
                          objectFit: "cover",
                          borderRadius: 12,
                          display: "block",
                        }}
                        draggable={false}
                      />
                    )}
                    {isSelected && !isCustom && (
                      <div
                        className="absolute top-2 right-2 bg-[#0F1C46] rounded-full flex items-center justify-center"
                        style={{ width: 24, height: 24 }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                  <span className="text-xs text-center text-gray-600 max-w-[202px]">
                    {option.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── 하단 고정 바 ── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        {/* 진행바 */}
        <div className="flex items-center max-w-4xl gap-4 px-6 pt-3 mx-auto">
          <span className="flex-shrink-0 w-10 text-sm font-medium text-center text-gray-500">
            {Math.round(progress)}%
          </span>
          <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="h-full transition-all duration-500 bg-green-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="flex-shrink-0 w-10 text-sm font-medium text-center text-gray-500">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        {/* 이전 / 카드 트레이 / 다음 - 한 줄 */}
        <div className="flex items-center justify-between max-w-4xl gap-4 px-6 py-3 mx-auto">
          <button
            onClick={handlePrev}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            이전
          </button>

          <CardTray answers={answers} totalSteps={totalSteps} />

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
              canProceed
                ? "bg-[#0F1C46] text-white hover:bg-[#1a2d6b]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep < totalSteps - 1 ? (
              <>
                다음
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            ) : (
              "등록 완료"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonaCreateStep2;