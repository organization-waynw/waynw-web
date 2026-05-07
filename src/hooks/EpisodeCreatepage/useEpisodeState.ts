import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { createEpisode, createEpisodeNodes } from "../../api/episodes";

import {
  ERROR_MESSAGES,
  SAVE_NAVIGATION_DELAY,
  SUCCESS_MESSAGES,
  TOAST_ERROR_ICON_THEME,
  TOAST_ERROR_STYLE,
  TOAST_SUCCESS_ICON_THEME,
  TOAST_SUCCESS_STYLE,
} from "../../constants/episodeCreate.constants";
import { EpisodeNode } from "../../types/Episodes/episodes";

interface UseEpisodeStateOptions {
  selectedDiskId?: string | null;
  nodes?: EpisodeNode[];
  onSaveSuccess?: () => void;
  onSaveSound?: () => void;
}

export function useEpisodeState(options?: UseEpisodeStateOptions) {
  const { id: personaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [episodeName, setEpisodeName] = useState("");
  const [episodeExplanation, setEpisodeExplanation] = useState("");
  const [subInfo, setSubInfo] = useState(""); // 추가

  const save = useCallback(async () => {
    if (!personaId) {
      toast.error("페르소나 정보가 없습니다.", {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });
      return false;
    }

    if (!options?.selectedDiskId) {
      toast.error("디스크를 선택해주세요.", {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });
      return false;
    }

    if (!episodeName.trim()) {
      toast.error(ERROR_MESSAGES.EPISODE_NAME_REQUIRED, {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });
      return false;
    }

    if (!episodeExplanation.trim()) {
      toast.error(ERROR_MESSAGES.EPISODE_EXPLANATION_REQUIRED, {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });
      return false;
    }

    try {
      const episode = await createEpisode({
        personaId,
        diskId: options.selectedDiskId,
        name: episodeName,
        oneLineExplanation: episodeExplanation,
      });

      // 2. 노드 저장 (에피소드 id 확정 후)
      await createEpisodeNodes({
        episodeId: episode.id,
        nodes: (options?.nodes ?? []).map((n) => ({
          name: n.name ?? "",
          one_line_explanation: n.one_line_explanation ?? "",
          content: n.content ?? "",
        })),
      });

      options?.onSaveSound?.();

      toast.success(SUCCESS_MESSAGES.EPISODE_CREATED, {
        style: TOAST_SUCCESS_STYLE,
        iconTheme: TOAST_SUCCESS_ICON_THEME,
      });

      options?.onSaveSuccess?.();

      setTimeout(() => {
        navigate(`/persona/${personaId}`);
      }, SAVE_NAVIGATION_DELAY);

      return true;
    } catch (error) {
      console.error("에피소드 저장 실패:", error);

      toast.error("에피소드 저장에 실패했습니다.", {
        style: TOAST_ERROR_STYLE,
        iconTheme: TOAST_ERROR_ICON_THEME,
      });

      return false;
    }
  }, [episodeName, episodeExplanation, subInfo, navigate, personaId, options]);

  return {
    episodeName,
    setEpisodeName,
    episodeExplanation,
    setEpisodeExplanation,
    subInfo, // 추가
    setSubInfo, // 추가
    save,
  };
}
