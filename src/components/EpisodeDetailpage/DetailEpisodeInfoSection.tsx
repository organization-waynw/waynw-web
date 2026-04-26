/**
 * DetailEpisodeInfoSection
 * 에피소드 제목/설명 입력 또는 표시 영역
 */

import { Plus, Edit2, Check } from "lucide-react";

interface DetailEpisodeInfoSectionProps {
  isEditing: boolean;
  displayName: string;
  displayExplanation: string;
  editName: string;
  editExplanation: string;
  onNameChange: (value: string) => void;
  onExplanationChange: (value: string) => void;
  onEditStart: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNode: () => void;
}

export function DetailEpisodeInfoSection({
  isEditing,
  displayName,
  displayExplanation,
  editName,
  editExplanation,
  onNameChange,
  onExplanationChange,
  onEditStart,
  onSave,
  onCancel,
  onAddNode,
}: DetailEpisodeInfoSectionProps) {
  return (
    <div className="pt-20 pb-6 shrink-0">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full text-4xl font-bold text-[#0F1C46] border-b-2 focus:outline-none bg-transparent tracking-tight pb-1"
          />
          <input
            type="text"
            value={editExplanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            className="w-full pb-1 text-1xl text-[#0F1C46] bg-transparent border-b border-gray-300 focus:outline-none"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              저장
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 group">
            <div>
              <h2 className="text-5xl font-bold text-[#0F1C46] mb-3 tracking-tight">
                {displayName}
              </h2>
              <p className="text-gray-400">{displayExplanation}</p>
            </div>
            {/* 수정 버튼: 제목 옆에 hover 시 표시 */}
            <button
              onClick={onEditStart}
              className="mt-3 flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="w-3.5 h-3.5" />
              수정
            </button>
          </div>
          {/* 노드 추가 버튼 */}
          <button
            onClick={onAddNode}
            className="mt-2 flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-[#0F1C46] hover:bg-gray-100 transition-colors shrink-0"
            title="노드 추가"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
