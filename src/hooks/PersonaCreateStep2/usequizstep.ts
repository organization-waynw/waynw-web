import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../data/QUESTIONS";
import { AnswersMap } from "../../types/Persona/personacreate2.types";
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
      const step1Data = JSON.parse(
        sessionStorage.getItem("personaFormStep1") || "{}",
      );
      const {
        name,
        title,
        additionalInfo, // → sub_info로 바로 저장
        subInfos, // → extra_info로 바로 저장
        profileImagePreview,
        autoGenerate,
      } = step1Data;

      const finalAnswers = structuredClone(answers);

      // 질문별 키워드를 __promptKey__ 고정 타이틀로 extra_info에 추가
      const promptExtraInfo = QUESTIONS.map((q) => {
        const ans = finalAnswers[q.id];
        if (!ans) return null;
        const opt = q.options[ans.optionIndex];
        const keywords = (opt as any).isCustom
          ? (ans.customText ?? "")
          : opt.promptKeywords;
        return {
          title: `__${q.promptKey}__`, // ex) __mood__, __expression__, __item__, __vibe__
          content: keywords,
        };
      }).filter(Boolean);

      // extra_info = 유저 입력 정보 + 프롬프트 키워드 (구분 가능하도록 __ prefix)
      const mergedExtraInfo = [...(subInfos ?? []), ...promptExtraInfo];

      // 유저 정보
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("로그인이 필요합니다.");

      // 1) personas INSERT
      //    sub_info: 유저가 직접 입력한 한줄 설명 (additionalInfo)
      //    extra_info: 유저 입력 정보 + 프롬프트 키워드 통합
      const persona = await createPersona({
        name,
        title,
        subInfo: additionalInfo ?? "",
        extraInfo: mergedExtraInfo,
        profileImgPath: null,
        userId,
      });

      // 2) 프로필 이미지 처리
      let profileImgUrl: string | null = null;

      if (autoGenerate) {
        // AI 이미지 생성
        // extra_info 안에 __mood__ 등 키워드가 포함되어 있으므로 그대로 전달
        const { data: imgData, error: imgError } =
          await supabase.functions.invoke("generate-persona-image", {
            body: {
              userId,
              personaId: persona.id,
              name,
              title,
              subInfo: additionalInfo ?? "",
              extraInfo: mergedExtraInfo,
            },
          });
        if (imgError) throw imgError;
        profileImgUrl = imgData.publicUrl;
      } else if (profileImagePreview) {
        // 유저 업로드 이미지
        profileImgUrl = await uploadProfileImage({
          base64: profileImagePreview,
          userId,
          personaId: persona.id,
        });

        if (profileImgUrl) {
          await supabase
            .from("personas")
            .update({ profile_img_path: profileImgUrl })
            .eq("id", persona.id);
        }
      }

      // 3) 완료
      sessionStorage.removeItem("personaFormStep1");
      navigate("/main");
    } catch (e) {
      console.error("페르소나 생성 실패:", JSON.stringify(e, null, 2));
      alert("페르소나 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
