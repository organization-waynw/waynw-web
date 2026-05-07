import { disks } from "../../data/EPISODES";
import { DiskName } from "../../types/Disk/disk";

interface EpisodeFilterBarProps {
  searchQuery: string;
  selectedDiskColor: DiskName | null;
  activeDiskColors: DiskName[];
  onSearchChange: (value: string) => void;
  onDiskColorSelect: (color: DiskName | null) => void;
}

export function EpisodeFilterBar({
  searchQuery,
  selectedDiskColor,
  activeDiskColors,
  onSearchChange,
  onDiskColorSelect,
}: EpisodeFilterBarProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          에피소드 검색
        </label>
        <input
          type="text"
          placeholder="에피소드 이름으로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
        />
      </div>

      <div>
        <label className="block mb-3 text-sm font-medium text-gray-700">
          디스크 필터
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onDiskColorSelect(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedDiskColor === null
                ? "bg-[#0AA1F2] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            전체
          </button>
          {activeDiskColors.map((color) => {
            const diskData = disks.find((d) => d.name === color);
            return (
              <button
                key={color}
                onClick={() =>
                  onDiskColorSelect(selectedDiskColor === color ? null : color)
                }
                className={`relative w-10 h-10 rounded-full transition-all overflow-hidden ${
                  selectedDiskColor === color
                    ? "ring-2 ring-offset-2 ring-[#0AA1F2]"
                    : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300"
                }`}
                title={color}
              >
                {diskData?.img_url ? (
                  <img
                    src={diskData.img_url}
                    alt={color}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
