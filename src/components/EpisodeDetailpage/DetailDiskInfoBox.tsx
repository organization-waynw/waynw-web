/**
 * DetailDiskInfoBox
 * 디스크 호버 시 나타나는 음악 정보 박스
 */

import { DISK_VISIBLE } from "../../constants/episodedetail.constants";
import { Disk } from "../../data/EPISODES";

interface DetailDiskInfoBoxProps {
  isDiskHovered: boolean;
  isDragging: boolean;
  currentDisk: Disk | undefined;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DetailDiskInfoBox({
  isDiskHovered,
  isDragging,
  currentDisk,
  onMouseEnter,
  onMouseLeave,
}: DetailDiskInfoBoxProps) {
  if (!isDiskHovered || isDragging || !currentDisk?.disk_info?.music) {
    return null;
  }

  return (
    <div
      className="fixed z-10 px-4 py-3 bg-white border border-gray-200 shadow-md rounded-2xl w-52"
      style={{ top: "200px", left: `${DISK_VISIBLE - 180}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="text-[10px] text-gray-400 mb-1">
        {currentDisk.disk_info.source}
      </p>
      <p className="text-sm font-bold text-[#0F1C46] leading-snug">
        {currentDisk.disk_info.music.title}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">
        {currentDisk.disk_info.music.artist}
      </p>
      {currentDisk.disk_info.links?.youtube && (
        <a
          href={currentDisk.disk_info.links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2 text-[10px] text-[#0AA1F2] hover:underline"
        >
          YouTube ↗
        </a>
      )}
      {currentDisk.disk_info.license && (
        <p className="text-[10px] text-gray-400 mt-1">
          {currentDisk.disk_info.license.type}
        </p>
      )}
    </div>
  );
}
