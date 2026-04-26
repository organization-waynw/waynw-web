/**
 * DetailSubInfoPanel
 * 에피소드 부가정보(마크다운) 표시 및 편집 패널
 */

import { Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DetailSubInfoPanelProps {
  isEditing: boolean;
  editedSubInfo: string;
  onEditStart: () => void;
  onInfoChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function DetailSubInfoPanel({
  isEditing,
  editedSubInfo,
  onEditStart,
  onInfoChange,
  onSave,
  onCancel,
}: DetailSubInfoPanelProps) {
  return (
    <div className="bg-gray-100 rounded-2xl p-6 min-h-[480px]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-500">부가정보</p>
        {!isEditing && (
          <button
            onClick={onEditStart}
            className="flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            수정
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedSubInfo}
            onChange={(e) => onInfoChange(e.target.value)}
            rows={12}
            placeholder="마크다운 형식으로 입력하세요"
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm font-medium hover:bg-[#0890D9] transition-colors"
            >
              저장
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      ) : editedSubInfo ? (
        <div className="prose-sm prose text-gray-600 max-w-none">
          <ReactMarkdown>{editedSubInfo}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-gray-400">등록된 부가정보가 없습니다.</p>
      )}
    </div>
  );
}
