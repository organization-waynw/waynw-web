import otherItems from "../../assets/images/persona/create/question/other_items.png";
import { QUESTIONS } from "../../data/QUESTIONS";
import { AnswersMap } from "../../types/Persona/personacreate2.types";

function getSelectedImagePath(
  answers: AnswersMap,
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

interface CardTrayProps {
  answers: AnswersMap;
  totalSteps: number;
}

export function CardTray({ answers, totalSteps }: CardTrayProps) {
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
