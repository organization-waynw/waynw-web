import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../data/QUESTIONS";
import { AnswersMap } from "../../types/Persona/Personacreate2.types";
import { supabase } from "../../db/supabase";
import { createPersona, uploadProfileImage } from "../../api/persona";

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


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const step1Data = JSON.parse(sessionStorage.getItem("personaFormStep1") || "{}");
      const { name, title, additionalInfo, subInfos, profileImagePreview, autoGenerate } = step1Data;

      const finalAnswers = structuredClone(answers);

      // promptKeywords 조합
      const promptKeywords = QUESTIONS.map((q) => {
        const ans = finalAnswers[q.id];
        if (!ans) return "";
        const opt = q.options[ans.optionIndex];
        return (opt as any).isCustom ? (ans.customText ?? "") : opt.promptKeywords;
      })
        .filter(Boolean)
        .join(", ");

      // 유저 정보
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("로그인이 필요합니다.");

      // 1) AI로 sub_info 생성
      const { data: descData, error: descError } = await supabase.functions.invoke(
        "generate-persona-description",
        { body: { answers: finalAnswers, promptKeywords, additionalInfo } },
      );
      if (descError) throw descError;
      const subInfo: string = descData.description;

      // 2) personas INSERT (id 먼저 필요)
      const persona = await createPersona({
        name,
        title,
        subInfo,
        extraInfo: subInfos,
        profileImgPath: null, // 이미지 업로드 후 업데이트
        userId,
      });

      // 3) 프로필 이미지 처리
      let profileImgPath: string | null = null;

      if (autoGenerate) {
        // AI 이미지 생성
        const { data: imgData, error: imgError } = await supabase.functions.invoke(
          "generate-persona-image",
          { body: { promptKeywords, userId, personaId: persona.id, personaName: name } },
        );
        if (imgError) throw imgError;
        profileImgPath = imgData.path;
      } else if (profileImagePreview) {
        // 유저 업로드 이미지
        profileImgPath = await uploadProfileImage({
          base64: profileImagePreview,
          userId,
          personaId: persona.id,
          personaName: name,
        });
      }

      // 4) profile_img_path 업데이트
      if (profileImgPath) {
        await supabase
          .from("personas")
          .update({ profile_img_path: profileImgPath })
          .eq("id", persona.id);
      }

      // 5) 완료
      sessionStorage.removeItem("personaFormStep1");
      navigate("/main");
    } catch (e) {
      console.error("페르소나 생성 실패:", e);
      alert("페르소나 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
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
