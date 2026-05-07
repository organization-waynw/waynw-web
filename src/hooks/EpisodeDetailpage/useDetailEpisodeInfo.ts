/**
 * useDetailEpisodeInfo
 * 에피소드 이름, 설명, 부가정보(sub_info)를 관리합니다.
 */

import { useState, useCallback } from "react";
import { Episode } from "../../types/Episodes/episodes";

interface UseDetailEpisodeInfoOptions {
  episode?: Episode;
  onDirty?: () => void;
}

export function useDetailEpisodeInfo({
  episode,
  onDirty,
}: UseDetailEpisodeInfoOptions) {
  // 에피소드 제목/설명 편집
  const [isEditingEpisode, setIsEditingEpisode] = useState(false);
  const [displayName, setDisplayName] = useState(episode?.name ?? "");
  const [displayExplanation, setDisplayExplanation] = useState(
    episode?.one_line_explanation ?? "",
  );
  const [editEpisodeName, setEditEpisodeName] = useState(episode?.name ?? "");
  const [editEpisodeExplanation, setEditEpisodeExplanation] = useState(
    episode?.one_line_explanation ?? "",
  );

  // 부가정보 편집
  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);
  const [editedSubInfo, setEditedSubInfo] = useState(episode?.sub_info ?? "");

  /**
   * episode 로드 후 전체 초기화 - 페이지에서 episode 로드 완료 시 호출
   */
  const reset = useCallback((ep: Episode) => {
    setDisplayName(ep.name ?? "");
    setDisplayExplanation(ep.one_line_explanation ?? "");
    setEditEpisodeName(ep.name ?? "");
    setEditEpisodeExplanation(ep.one_line_explanation ?? "");
    setEditedSubInfo(ep.sub_info ?? "");
  }, []);

  /**
   * 에피소드 정보 저장
   */
  const handleEpisodeSave = useCallback(() => {
    setDisplayName(editEpisodeName);
    setDisplayExplanation(editEpisodeExplanation);
    setIsEditingEpisode(false);
    onDirty?.();
  }, [editEpisodeName, editEpisodeExplanation, onDirty]);

  /**
   * 에피소드 편집 시작
   */
  const handleEpisodeEditStart = useCallback(() => {
    setEditEpisodeName(displayName);
    setEditEpisodeExplanation(displayExplanation);
    setIsEditingEpisode(true);
  }, [displayName, displayExplanation]);

  /**
   * 부가정보 저장
   */
  const handleSubInfoSave = useCallback(() => {
    setIsEditingSubInfo(false);
    onDirty?.();
  }, [onDirty]);

  /**
   * 부가정보 편집 취소
   */
  const handleSubInfoCancel = useCallback(() => {
    setEditedSubInfo(episode?.sub_info ?? "");
    setIsEditingSubInfo(false);
  }, [episode?.sub_info]);

  return {
    reset,
    // 에피소드 제목/설명
    isEditingEpisode,
    setIsEditingEpisode,
    displayName,
    displayExplanation,
    editEpisodeName,
    setEditEpisodeName,
    editEpisodeExplanation,
    setEditEpisodeExplanation,
    handleEpisodeSave,
    handleEpisodeEditStart,

    // 부가정보
    isEditingSubInfo,
    setIsEditingSubInfo,
    editedSubInfo,
    setEditedSubInfo,
    handleSubInfoSave,
    handleSubInfoCancel,
    setDisplayName,
    setDisplayExplanation,
  };
}
