/**
 * useEpisodeState
 * 에피소드의 기본 정보(이름, 설명)를 관리합니다.
 */

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ERROR_MESSAGES, SAVE_NAVIGATION_DELAY, SUCCESS_MESSAGES, TOAST_ERROR_ICON_THEME, TOAST_ERROR_STYLE, TOAST_SUCCESS_ICON_THEME, TOAST_SUCCESS_STYLE } from "../../constants/episodeCreate.constants";

interface UseEpisodeStateOptions {
  onSaveSuccess?: () => void;
  onSaveSound?: () => void;
}

export function useEpisodeState(options?: UseEpisodeStateOptions) {
  const { id: personaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [episodeName, setEpisodeName] = useState("");
  const [episodeExplanation, setEpisodeExplanation] = useState("");

  /**
   * 에피소드 저장 전 검증 및 저장 처리
   */
  const save = useCallback(() => {
    // 검증: 에피소드 이름
    if (!episodeName.trim()) {
      toast.error(ERROR_MESSAGES.EPISODE_NAME_REQUIRED, {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });
      return false;
    }

    // 검증: 에피소드 설명
    if (!episodeExplanation.trim()) {
      toast.error(ERROR_MESSAGES.EPISODE_EXPLANATION_REQUIRED, {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });
      return false;
    }

    // 저장 사운드 재생
    options?.onSaveSound?.();

    // 성공 메시지
    toast.success(SUCCESS_MESSAGES.EPISODE_CREATED, {
      style: TOAST_SUCCESS_STYLE,
      iconTheme: TOAST_SUCCESS_ICON_THEME,
    });

    // 콜백 실행
    options?.onSaveSuccess?.();

    // 네비게이션
    setTimeout(() => {
      navigate(`/persona/${personaId}`);
    }, SAVE_NAVIGATION_DELAY);

    return true;
  }, [episodeName, episodeExplanation, navigate, personaId, options]);

  return {
    episodeName,
    setEpisodeName,
    episodeExplanation,
    setEpisodeExplanation,
    save,
  };
}