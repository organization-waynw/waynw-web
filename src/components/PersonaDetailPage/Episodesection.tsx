import { Plus } from "lucide-react";
import { EpisodeFilterBar } from "./Episodefilterbar";
import { EpisodeGrid } from "./Episodegrid";
import { DiskName, Episode } from "../../types/Episodes/Rpisodes";

interface EpisodeSectionProps {
  searchQuery: string;
  selectedDiskColor: DiskName | null;
  activeDiskColors: DiskName[];
  filteredEpisodes: Episode[];
  onSearchChange: (value: string) => void;
  onDiskColorSelect: (color: DiskName | null) => void;
  onEpisodeClick: (episodeId: string) => void;
  onCreateEpisode: () => void;
}

export function EpisodeSection({
  searchQuery,
  selectedDiskColor,
  activeDiskColors,
  filteredEpisodes,
  onSearchChange,
  onDiskColorSelect,
  onEpisodeClick,
  onCreateEpisode,
}: EpisodeSectionProps) {
  return (
    <div className="p-8 bg-white shadow-sm rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0F1C46] mb-6">에피소드</h3>
        <button
          onClick={onCreateEpisode}
          className="p-2 transition-colors rounded-full hover:bg-gray-100"
          style={{ color: "#587CF0" }}
          aria-label="Create new room"
        >
          <Plus size={24} />
        </button>
      </div>

      <EpisodeFilterBar
        searchQuery={searchQuery}
        selectedDiskColor={selectedDiskColor}
        activeDiskColors={activeDiskColors}
        onSearchChange={onSearchChange}
        onDiskColorSelect={onDiskColorSelect}
      />

      <div className="mt-8">
        <EpisodeGrid
          episodes={filteredEpisodes}
          onEpisodeClick={onEpisodeClick}
        />
      </div>
    </div>
  );
}
