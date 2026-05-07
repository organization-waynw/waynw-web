import { AnswersMap } from "../../types/Persona/personacreate2.types";
import { CustomOptionCard } from "./Customoptioncard";

interface Option {
  label: string;
  imagePath?: string | null;
  isCustom?: boolean;
  promptKeywords?: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  columns?: number;
}

interface QuestionGridProps {
  question: Question;
  selectedOptionIndex: number;
  editingCustom: boolean;
  customInputValue: string;
  answers: AnswersMap;
  onSelectOption: (idx: number) => void;
  onCustomInputChange: (value: string) => void;
  onCustomKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCustomSave: () => void;
}

export function QuestionGrid({
  question,
  selectedOptionIndex,
  editingCustom,
  customInputValue,
  answers,
  onSelectOption,
  onCustomInputChange,
  onCustomKeyDown,
  onCustomSave,
}: QuestionGridProps) {
  return (
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
              onClick={() => onSelectOption(idx)}
              className={`relative transition-all duration-200 focus:outline-none rounded-xl ${
                isSelected ? "scale-105" : "hover:scale-[1.03]"
              }`}
              style={{ borderRadius: 12 }}
            >
              {isCustom ? (
                <CustomOptionCard
                  isSelected={isSelected}
                  isEditing={editingCustom}
                  customText={answers[question.id]?.customText ?? ""}
                  customInputValue={customInputValue}
                  onInputChange={onCustomInputChange}
                  onKeyDown={onCustomKeyDown}
                  onBlur={onCustomSave}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOption(idx);
                  }}
                />
              ) : (
                <>
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
                </>
              )}
            </button>
            <span className="text-xs text-center text-gray-600 max-w-[202px]">
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
