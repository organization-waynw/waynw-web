import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// ─── 질문 데이터 ───────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    question: "해당 사람을 볼 때 당신은 어떤 장면(무드)을 떠올리나요?",
    promptKey: "mood",
    useImage: true,
    options: [
      {
        label: "포근한 오후의 햇살",
        description: "다정하고 따뜻한 느낌",
        promptKeywords:
          "warm golden hour lighting, soft backlight, beige and wood tones, film grain, cozy atmosphere",
        imagePath: "/images/tarot/warm_afternoon.png",
      },
      {
        label: "차가운 새벽의 도시",
        description: "냉철하고 논리적인 느낌",
        promptKeywords:
          "monochromatic, cool blue tones, sharp contrast, urban city morning, minimalist, elegant shadows",
        imagePath: "/images/tarot/cold_city.png",
      },
      {
        label: "네온 사인이 번지는 밤",
        description: "에너지 넘치고 화려함",
        promptKeywords:
          "vibrant neon lights, purple and blue hues, street photography style, high energy, grainy night texture",
        imagePath: "/images/tarot/neon_night.png",
      },
      {
        label: "비 개인 뒤의 숲",
        description: "차분하고 깊은 내면",
        promptKeywords:
          "deep green and earthy tones, misty atmosphere, wet textures, foggy forest, calm and serene",
        imagePath: "/images/tarot/forest.png",
      },
      {
        label: "바랜 사진첩의 기억",
        description: "진중하고 지혜로운 느낌",
        promptKeywords:
          "sepia tone, vintage paper texture, retro aesthetic, classic portrait lighting, nostalgic mood",
        imagePath: "/images/tarot/vintage.png",
      },
      {
        label: "꿈속을 걷는 몽환",
        description: "감수성 풍부하고 엉뚱함",
        promptKeywords:
          "pastel pink and sky blue, dreamy surrealism, Lo-fi aesthetic, fluffy clouds, soft focus",
        imagePath: "/images/tarot/dreamy.png",
      },
      {
        label: "한낮의 뜨거운 열기",
        description: "열정적이고 압도적인 에너지",
        promptKeywords:
          "intense red and orange, dynamic composition, dramatic lighting, bold brushstrokes, high heat mood",
        imagePath: "/images/tarot/hot.png",
      },
      {
        label: "기타",
        description: "직접 입력",
        promptKeywords: "",
        imagePath: null,
        isCustom: true,
      },
    ],
  },
  {
    id: 2,
    question: "그 사람은 보통 어떠한 표정을 짓고 있나요?",
    promptKey: "expression",
    useImage: false,
    options: [
      {
        label: "온화한 미소",
        promptKeywords: "gentle smile, kind eyes, approachable expression",
      },
      {
        label: "무표정한 진지함",
        promptKeywords: "stoic face, serious expression, calm look",
      },
      {
        label: "날카롭고 예리한 눈빛",
        promptKeywords: "sharp piercing eyes, intense gaze, confident look",
      },
      {
        label: "걱정스러운 시선",
        promptKeywords:
          "concerned expression, empathetic eyes, slightly furrowed brow",
      },
      {
        label: "자신만만한 웃음",
        promptKeywords: "smirk, charismatic smile, bold expression",
      },
      { label: "기타", promptKeywords: "", isCustom: true },
    ],
  },
  {
    id: 3,
    question: "그 사람 곁에 항상 있을 것 같은 물건이 있다면 무엇일까요?",
    promptKey: "item",
    useImage: false,
    options: [
      {
        label: "따뜻한 커피잔",
        promptKeywords: "holding a steaming coffee cup, cafe table setting",
      },
      {
        label: "두꺼운 책이나 안경",
        promptKeywords:
          "thick hardcover books, vintage glasses, intellectual vibe",
      },
      {
        label: "최신형 노트북/스마트기기",
        promptKeywords:
          "modern laptop, digital glow, professional tech environment",
      },
      {
        label: "복잡한 서류 뭉치",
        promptKeywords: "scattered documents, messy desk, busy work life",
      },
      {
        label: "깔끔한 빈 공간",
        promptKeywords: "empty space, minimalist setting, no distractions",
      },
      { label: "기타", promptKeywords: "", isCustom: true },
    ],
  },
  {
    id: 4,
    question: "그 사람을 보면 어떤 생각이 떠오르나요?",
    promptKey: "vibe",
    useImage: false,
    options: [
      {
        label: "의지하고 싶은 든든함",
        promptKeywords: "stable composition, reliable mood, grounded feel",
      },
      {
        label: "답답하지만 이겨내야 할 벽",
        promptKeywords:
          "imposing structure, high angle shot, overwhelming scale",
      },
      {
        label: "영감을 주는 뮤즈",
        promptKeywords: "ethereal glow, creative sparks, artistic blur",
      },
      {
        label: "넘기 힘든 높은 산",
        promptKeywords: "majestic presence, low angle shot, distant and grand",
      },
      {
        label: "비밀을 간직한 안개",
        promptKeywords: "mysterious vibes, hazy details, hidden elements",
      },
      { label: "기타", promptKeywords: "", isCustom: true },
    ],
  },
];

// ─── 타로 카드 스타일 이미지 플레이스홀더 ────────────────────────────────────────

function TarotCardPlaceholder({
  label,
  index,
}: {
  label: string;
  index: number;
}) {
  const colors = [
    ["#1a1040", "#6b46c1"],
    ["#0f2444", "#2563eb"],
    ["#1a0a2e", "#9333ea"],
    ["#0d2818", "#16a34a"],
    ["#2d1b0e", "#92400e"],
    ["#1a0a2e", "#db2777"],
    ["#1f0a0a", "#dc2626"],
    ["#1a1040", "#7c3aed"],
  ];
  const [bg, accent] = colors[index % colors.length];

  return (
    <div
      style={{
        width: 202,
        height: 288,
        background: `linear-gradient(160deg, ${bg} 0%, ${accent}33 100%)`,
        border: `1px solid ${accent}66`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 12px",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `${accent}44`,
          border: `1px solid ${accent}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
        </svg>
      </div>
      <span
        style={{
          color: "#e2e8f0",
          fontSize: 13,
          fontWeight: 500,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
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

  const canProceed =
    selectedOptionIndex !== -1 &&
    (!isCustomSelected || answers[question.id]?.customText?.trim());

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
    const promptKeywords = QUESTIONS.map((q) => {
      const ans = answers[q.id];
      if (!ans) return "";
      const opt = q.options[ans.optionIndex];
      if ((opt as any).isCustom) return ans.customText ?? "";
      return opt.promptKeywords;
    })
      .filter(Boolean)
      .join(", ");

    const finalData = {
      ...step1Data,
      answers,
      promptKeywords,
    };

    console.log("최종 페르소나 데이터:", finalData);
    // TODO: API 호출 후 navigate
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#ECF0F9] flex flex-col">
      {/* <Header searchQuery="" setSearchQuery={() => {}} /> */}

      <main className="flex flex-col items-center flex-1 px-6 py-8">
        {/* 질문 */}
        <h1 className="text-2xl font-bold text-[#0F1C46] text-center max-w-2xl leading-snug">
          {question.question}
        </h1>

        {/* 선택지 */}
        <div className="flex-1 w-full max-w-4xl mt-8">
          {question.useImage ? (
            /* 이미지 카드 그리드 (타로 카드 스타일) */
            <div className="flex flex-wrap justify-center gap-5">
              {question.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCustom = (option as any).isCustom;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleSelectOption(idx)}
                      className={`relative transition-all duration-200 focus:outline-none ${
                        isSelected
                          ? "scale-105 ring-4 ring-[#0F1C46] ring-offset-2 rounded-xl"
                          : "hover:scale-[1.03] hover:ring-2 hover:ring-[#0F1C46]/40 hover:ring-offset-1 rounded-xl"
                      }`}
                      style={{ borderRadius: 12 }}
                    >
                      {isCustom ? (
                        <div
                          style={{
                            width: 202,
                            height: 288,
                            background: "#f1f5f9",
                            border: "2px dashed #94a3b8",
                            borderRadius: 12,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span
                            style={{
                              color: "#64748b",
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            기타
                          </span>
                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: 12,
                              textAlign: "center",
                              padding: "0 16px",
                            }}
                          >
                            직접 입력
                          </span>
                        </div>
                      ) : (
                        <TarotCardPlaceholder
                          label={option.label}
                          index={idx}
                        />
                      )}
                      {isSelected && (
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
          ) : (
            /* 텍스트 카드 그리드 (2열) */
            <div className="grid max-w-2xl grid-cols-1 gap-3 mx-auto sm:grid-cols-2">
              {question.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCustom = (option as any).isCustom;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`relative text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 focus:outline-none ${
                      isSelected
                        ? "border-[#0F1C46] bg-[#0F1C46] text-white"
                        : "border-gray-200 bg-white text-[#0F1C46] hover:border-[#0F1C46]/40 hover:bg-gray-50"
                    } ${isCustom ? "border-dashed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      {isCustom && (
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
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </div>
                    {isSelected && !isCustom && (
                      <div className="absolute top-3 right-3">
                        <svg
                          width="16"
                          height="16"
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
                );
              })}
            </div>
          )}

          {/* 기타 직접 입력 영역 */}
          {isCustomSelected && (
            <div className="max-w-2xl p-4 mx-auto mt-6 bg-white shadow-sm rounded-xl">
              <label className="block mb-2 text-xs font-medium text-gray-500">
                직접 입력
              </label>
              {editingCustom ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCustomTextSave()
                    }
                    placeholder="내용을 입력하세요"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46]"
                  />
                  <button
                    onClick={handleCustomTextSave}
                    className="px-4 py-2 bg-[#0F1C46] text-white rounded-lg text-sm font-medium hover:bg-[#1a2d6b] transition-colors"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingCustom(true)}
                  className="w-full text-left text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#0F1C46] transition-colors"
                >
                  {answers[question.id]?.customText || (
                    <span className="text-gray-400">
                      클릭하여 내용을 입력하세요
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 하단 진행바 + 네비게이션 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center max-w-4xl gap-4 px-6 py-4 mx-auto">
          {/* 진행률 텍스트 */}
          <span className="w-10 text-sm font-medium text-center text-gray-500">
            {Math.round(progress)}%
          </span>

          {/* 프로그레스 바 */}
          <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="h-full transition-all duration-500 bg-green-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 단계 표시 */}
          <span className="w-10 text-sm font-medium text-center text-gray-500">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        {/* 이전/다음 버튼 */}
        <div className="flex justify-between max-w-4xl gap-3 px-6 pb-4 mx-auto">
          <button
            onClick={handlePrev}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
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
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
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
