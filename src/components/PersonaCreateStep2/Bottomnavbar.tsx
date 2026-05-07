import { AnswersMap } from "../../types/Persona/personacreate2.types";
import { CardTray } from "./Cardtray";

interface BottomNavBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  canProceed: boolean;
  answers: AnswersMap;
  onPrev: () => void;
  onNext: () => void;
}

export function BottomNavBar({
  currentStep,
  totalSteps,
  progress,
  canProceed,
  answers,
  onPrev,
  onNext,
}: BottomNavBarProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
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

      {/* 이전 / 카드 트레이 / 다음 */}
      <div className="flex items-center justify-between max-w-4xl gap-4 px-6 py-3 mx-auto">
        <button
          onClick={onPrev}
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
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
            canProceed
              ? "bg-[#0F1C46] text-white hover:bg-[#1a2d6b]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {!isLastStep ? (
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
  );
}
