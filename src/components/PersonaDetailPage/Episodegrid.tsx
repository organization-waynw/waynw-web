import { disks } from "../../data/EPISODES";
import { Episode } from "../../types/Episodes/episodes";
import {
  DISK_SPIN_DURATION,
  getDiskAnimationDelay,
} from "../../utils/diskAnimation";

interface EpisodeGridProps {
  episodes: Episode[];
  onEpisodeClick: (episodeId: string) => void;
}

export function EpisodeGrid({ episodes, onEpisodeClick }: EpisodeGridProps) {
  if (episodes.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400">검색 결과가 없습니다.</p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {episodes.map((episode) => {
        const disk = disks.find((d) => d.id === episode.disk_id);
        const formattedDate = episode.created_at
          ? episode.created_at.slice(0, 10)
          : "";

        return (
          <div
            key={episode.id}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => onEpisodeClick(episode.id)}
          >
            <div className="relative w-20 h-20">
              <div
                className="w-20 h-20 overflow-hidden rounded-full shadow-md"
                style={{
                  animation: `diskSpin ${DISK_SPIN_DURATION}ms linear infinite`,
                  animationDelay: getDiskAnimationDelay(),
                }}
              >
                {disk?.img_url ? (
                  <img
                    src={disk.img_url}
                    alt={disk.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 bg-white border border-gray-200 rounded-full shadow-inner" />
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-[#0F1C46] text-center line-clamp-2 group-hover:text-[#0AA1F2]">
              {episode.name}
            </p>
            <p className="mt-1 text-xs text-center text-gray-500">
              {formattedDate}
            </p>
          </div>
        );
      })}
    </div>
  );
}
