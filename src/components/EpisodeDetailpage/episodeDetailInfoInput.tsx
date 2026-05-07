import { Plus } from "lucide-react";

interface EpisodeDetailInfoInputProps {
  displayName: string;
  displayExplanation: string;
  onNameChange: (value: string) => void;
  onExplanationChange: (value: string) => void;
  onAddNode: () => void;
}

export function EpisodeDetailInfoInput({
  displayName,
  displayExplanation,
  onNameChange,
  onExplanationChange,
  onAddNode,
}: EpisodeDetailInfoInputProps) {
  return (
    <div className="pt-20 pb-6 shrink-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={displayName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="이름"
            className="w-full text-5xl font-bold text-[#0F1C46] placeholder-gray-200 bg-transparent focus:outline-none tracking-tight mb-3"
          />
          <input
            type="text"
            value={displayExplanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            placeholder="설명"
            className="w-full pb-1 text-sm text-gray-400 placeholder-gray-300 transition-colors bg-transparent border-b border-transparent focus:outline-none focus:border-gray-200"
          />
        </div>
        <button
          onClick={onAddNode}
          className="mt-2 flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-[#0F1C46] hover:bg-gray-100 transition-colors shrink-0"
          title="노드 추가"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
