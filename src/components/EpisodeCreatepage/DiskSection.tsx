/**
 * DiskSection
 * 회전하는 디스크 UI, 드래그 감지, 클릭/음악 재생
 */

import { RefObject } from "react";
import { DISK_SPIN_DURATION } from "../../utils/DiskAnimation";
import {
  DISK_SIZE,
  DISK_VISIBLE,
} from "../../constants/episodeCreate.constants";
import { Disk } from "../../types/Episodes/Episodes";

interface DiskSectionProps {
  currentDisk: Disk | undefined;
  isPlaying: boolean;
  isDiskHovered: boolean;
  isDragging: boolean;
  dragX: number;
  diskRef: RefObject<HTMLDivElement>;
  diskAnimationDelay: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function DiskSection({
  currentDisk,
  isPlaying,
  isDiskHovered,
  isDragging,
  dragX,
  diskRef,
  diskAnimationDelay,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onContextMenu,
}: DiskSectionProps) {
  return (
    <div
      ref={diskRef}
      className="fixed"
      style={{
        top: "50%",
        left: 0,
        transform: `translate(calc(-${DISK_VISIBLE}px + ${dragX}px), -50%)`,
        transition: isDragging
          ? "none"
          : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 40 : 1,
      }}
    >
      <div
        className="relative"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* 디스크 회전 */}
        <div
          className="overflow-hidden rounded-full shadow-2xl"
          style={{
            width: `${DISK_SIZE}px`,
            height: `${DISK_SIZE}px`,
            animation: `diskSpin ${DISK_SPIN_DURATION}ms linear infinite`,
            animationDelay: `${diskAnimationDelay}s`,
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          {currentDisk?.img_url ? (
            <img
              src={currentDisk.img_url}
              alt={currentDisk.name}
              className="object-cover w-full h-full"
            />
          ) : (
            // 디스크 미선택 시: 빈 원형 placeholder
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <p className="text-sm text-gray-300">디스크 없음</p>
            </div>
          )}
        </div>

        {/* 디스크 중앙 라벨 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-inner" />
        </div>
      </div>

      <style>{`
        @keyframes diskSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
