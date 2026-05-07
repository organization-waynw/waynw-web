import { Disk } from "../../types/Disk/disk";
import { DISK_SPIN_DURATION } from "../../utils/diskAnimation";

interface EpisodeDiskSectionProps {
  currentDisk: Disk | undefined;
  isPlaying: boolean;
  isDiskHovered: boolean;
  isDragging: boolean;
  dragX: number;
  dragY: number;
  diskSize: number;
  diskVisible: number;
  diskAnimationDelay: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function EpisodeDiskSection({
  currentDisk,
  isPlaying,
  isDiskHovered,
  isDragging,
  dragX,
  dragY,
  diskSize,
  diskVisible,
  diskAnimationDelay,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onContextMenu,
}: EpisodeDiskSectionProps) {
  return (
    <>
      <div
        className="fixed"
        style={{
          top: "50%",
          left: 0,
          transform: `translate(calc(-${diskVisible}px + ${dragX}px), calc(-50% + ${dragY}px))`,
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
          <div
            className="overflow-hidden rounded-full shadow-2xl"
            style={{
              width: `${diskSize}px`,
              height: `${diskSize}px`,
              animation: `diskSpin ${DISK_SPIN_DURATION}ms linear infinite`,
              animationDelay: diskAnimationDelay,
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
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-inner" />
          </div>
        </div>
      </div>

      {/* hover 정보 */}
      {isDiskHovered && !isDragging && currentDisk?.disk_info?.music && (
        <div
          className="fixed z-10 px-4 py-3 bg-white border border-gray-200 shadow-md rounded-2xl w-52"
          style={{ top: "200px", left: `${diskVisible - 180}px` }}
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
      )}
    </>
  );
}
