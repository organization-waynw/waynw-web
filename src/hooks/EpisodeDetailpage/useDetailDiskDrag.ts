/**
 * useDetailDiskDrag
 * 에피소드 상세 페이지에서 디스크 드래그 감지 및 저장 처리
 */

import { useState, useRef, useEffect, RefObject } from "react";
import { DRAG_THRESHOLD, HOVER_TIMEOUT } from "../../constants/episodedetail.constants";

interface UseDetailDiskDragOptions {
  onSave?: () => void;
}

export function useDetailDiskDrag(
  saveZoneRef: RefObject<HTMLDivElement>,
  options?: UseDetailDiskDragOptions,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isOverSaveZone, setIsOverSaveZone] = useState(false);
  const [isDiskHovered, setIsDiskHovered] = useState(false);

  const dragStartX = useRef<number>(0);
  const hasDragged = useRef(false);
  const justDropped = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 드래그 중 마우스 이동 감지
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;

      if (!hasDragged.current && Math.abs(deltaX) > DRAG_THRESHOLD) {
        hasDragged.current = true;
      }

      if (!hasDragged.current) return;

      const clampedX = Math.max(0, deltaX);
      setDragX(clampedX);

      // 저장 영역 충돌 감지
      if (saveZoneRef.current) {
        const rect = saveZoneRef.current.getBoundingClientRect();
        const over =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        setIsOverSaveZone(over);
      }
    };

    const handleMouseUp = () => {
      if (hasDragged.current && isOverSaveZone) {
        justDropped.current = true;
        options?.onSave?.();
      }

      setDragX(0);
      setIsDragging(false);
      setIsOverSaveZone(false);
      setIsDiskHovered(false);
      hasDragged.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isOverSaveZone, saveZoneRef, options]);

  /**
   * 마우스 다운 - 드래그 시작
   */
  const handleDiskMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    hasDragged.current = false;
    setIsDragging(true);
  };

  /**
   * 마우스 진입 - 호버 상태
   */
  const handleDiskMouseEnter = () => {
    if (isDragging) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsDiskHovered(true);
  };

  /**
   * 마우스 이탈 - 호버 상태 제거 (딜레이)
   */
  const handleDiskMouseLeave = () => {
    hoverTimerRef.current = setTimeout(
      () => setIsDiskHovered(false),
      HOVER_TIMEOUT,
    );
  };

  /**
   * 드래그 여부 확인
   */
  const isDraggedJustNow = () => {
    if (justDropped.current) {
      justDropped.current = false;
      return true;
    }
    return hasDragged.current;
  };

  return {
    isDragging,
    dragX,
    isOverSaveZone,
    isDiskHovered,
    handleDiskMouseDown,
    handleDiskMouseEnter,
    handleDiskMouseLeave,
    isDraggedJustNow,
  };
}
