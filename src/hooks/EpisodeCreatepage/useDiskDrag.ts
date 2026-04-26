/**
 * useDiskDrag
 * 디스크 드래그 감지, 저장 영역 판정, 드래그 상태 관리를 담당합니다.
 */

import { useState, useRef, useEffect, RefObject } from "react";
import { DRAG_THRESHOLD, HOVER_TIMEOUT } from "../../constants/episodeCreate.constants";

interface UseDiskDragOptions {
  onSave?: () => void;
}

export function useDiskDrag(
  saveZoneRef: RefObject<HTMLDivElement>,
  options?: UseDiskDragOptions
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
   * 드래그 중 마우스 이동 감지 및 저장 영역 판정
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;

      // DRAG_THRESHOLD를 초과할 때까지 기다림
      if (!hasDragged.current && Math.abs(deltaX) > DRAG_THRESHOLD) {
        hasDragged.current = true;
      }

      if (!hasDragged.current) return;

      // 오른쪽으로만 드래그 가능 (음수 방지)
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
      // 저장 영역에 드롭한 경우
      if (hasDragged.current && isOverSaveZone) {
        justDropped.current = true;
        options?.onSave?.();
      }

      // 상태 초기화
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
   * 마우스 진입 - 호버 상태 표시
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
      HOVER_TIMEOUT
    );
  };

  /**
   * 드래그 중 클릭 판별용 플래그 반환
   * (드래그 후 클릭 이벤트 실행 방지)
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