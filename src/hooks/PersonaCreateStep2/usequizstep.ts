import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../data/QUESTIONS";
import { AnswersMap } from "../../types/Persona/Personacreate2.types";

export function useQuizStep() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [editingCustom, setEditingCustom] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const question = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const selectedOptionIndex = answers[question.id]?.optionIndex ?? -1;
  const isCustomSelected = selectedOptionIndex === question.options.length - 1;

  const canProceed =
    selectedOptionIndex !== -1 &&
    (!isCustomSelected || Boolean(answers[question.id]?.customText?.trim()));

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

    const finalData = { ...step1Data, answers: finalAnswers, promptKeywords };
    console.log("최종 페르소나 데이터:", finalData);

    setIsLoading(true);
    setTimeout(() => navigate("/main"), 5000);
  };

  // Enter 키로 다음 단계
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canProceed && !editingCustom) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canProceed, editingCustom, currentStep]);

  return {
    currentStep,
    answers,
    editingCustom,
    customInputValue,
    isLoading,
    question,
    totalSteps,
    progress,
    selectedOptionIndex,
    isCustomSelected,
    canProceed,
    setCustomInputValue,
    handleSelectOption,
    handleCustomTextSave,
    handleCustomKeyDown,
    handleNext,
    handlePrev,
  };
}
