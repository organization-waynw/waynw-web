import { useState, useRef, useEffect, RefObject } from "react";
import {
  DRAG_THRESHOLD,
  HOVER_TIMEOUT,
} from "../../constants/episodedetail.constants";

type DragDirection = "horizontal" | "vertical" | null;

interface UseDetailDiskDragOptions {
  onSave?: () => void;
  onDelete?: () => void;
}

export function useDetailDiskDrag(
  saveZoneRef: RefObject<HTMLDivElement>,
  deleteZoneRef: RefObject<HTMLDivElement>,
  options?: UseDetailDiskDragOptions,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isOverSaveZone, setIsOverSaveZone] = useState(false);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [isDiskHovered, setIsDiskHovered] = useState(false);

  const dragStartX = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const hasDragged = useRef(false);
  const justDropped = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragDirection = useRef<DragDirection>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;
      const deltaY = e.clientY - dragStartY.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (
        !hasDragged.current &&
        (absX > DRAG_THRESHOLD || absY > DRAG_THRESHOLD)
      ) {
        hasDragged.current = true;
        // 처음 임계값 넘는 순간 방향 고정
        dragDirection.current = absX >= absY ? "horizontal" : "vertical";
      }

      if (!hasDragged.current) return;

      // 고정된 방향으로만 이동
      if (dragDirection.current === "horizontal") {
        const clampedX = Math.max(0, deltaX);
        setDragX(clampedX);
        setDragY(0);

        if (saveZoneRef.current) {
          const rect = saveZoneRef.current.getBoundingClientRect();
          setIsOverSaveZone(
            e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom,
          );
        }
        setIsOverDeleteZone(false);
      } else if (dragDirection.current === "vertical") {
        const clampedY = Math.max(0, deltaY);
        setDragY(clampedY);
        setDragX(0);

        if (deleteZoneRef.current) {
          const rect = deleteZoneRef.current.getBoundingClientRect();
          setIsOverDeleteZone(
            e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom,
          );
        }
        setIsOverSaveZone(false);
      }
    };

    const handleMouseUp = () => {
      if (hasDragged.current) {
        justDropped.current = true;
        if (isOverSaveZone) options?.onSave?.();
        if (isOverDeleteZone) options?.onDelete?.();
      }

      setDragX(0);
      setDragY(0);
      setIsDragging(false);
      setIsOverSaveZone(false);
      setIsOverDeleteZone(false);
      setIsDiskHovered(false);
      hasDragged.current = false;
      dragDirection.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isOverSaveZone,
    isOverDeleteZone,
    saveZoneRef,
    deleteZoneRef,
    options,
  ]);

  const handleDiskMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    hasDragged.current = false;
    dragDirection.current = null;
    setIsDragging(true);
  };

  const handleDiskMouseEnter = () => {
    if (isDragging) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsDiskHovered(true);
  };

  const handleDiskMouseLeave = () => {
    hoverTimerRef.current = setTimeout(
      () => setIsDiskHovered(false),
      HOVER_TIMEOUT,
    );
  };

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
    dragY,
    dragDirection: dragDirection.current,
    isOverSaveZone,
    isOverDeleteZone,
    isDiskHovered,
    handleDiskMouseDown,
    handleDiskMouseEnter,
    handleDiskMouseLeave,
    isDraggedJustNow,
  };
}
