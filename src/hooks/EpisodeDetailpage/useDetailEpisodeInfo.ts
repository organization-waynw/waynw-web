/**
 * useDetailEpisodeInfo
 * 에피소드 이름, 설명, 부가정보(sub_info)를 관리합니다.
 */

import { useState, useCallback } from "react";
import { Episode } from "../../types/Episodes/Rpisodes";

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
  };
}
