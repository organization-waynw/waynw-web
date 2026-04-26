/**
 * NodeEditPanel
 * 노드 수정 중인 상태: 입력 폼 (이름, 설명, 내용)
 */

import { Check } from "lucide-react";

interface NodeEditPanelProps {
  editNodeName: string;
  editNodeExplanation: string;
  editNodeContent: string;
  onNameChange: (value: string) => void;
  onExplanationChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function NodeEditPanel({
  editNodeName,
  editNodeExplanation,
  editNodeContent,
  onNameChange,
  onExplanationChange,
  onContentChange,
  onSave,
  onCancel,
}: NodeEditPanelProps) {
  return (
    <div className="space-y-3 bg-[#ECF0F9] rounded-2xl p-5">
      <div>
        <label className="block mb-1 text-xs text-gray-400">노드 이름</label>
        <input
          type="text"
          value={editNodeName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="노드 이름"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
        />
      </div>
      <div>
        <label className="block mb-1 text-xs text-gray-400">한줄 설명</label>
        <input
          type="text"
          value={editNodeExplanation}
          onChange={(e) => onExplanationChange(e.target.value)}
          placeholder="한줄 설명"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
        />
      </div>
      <div>
        <label className="block mb-1 text-xs text-gray-400">내용</label>
        <textarea
          value={editNodeContent}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="내용"
          rows={5}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          취소
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-1 px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9] transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          저장
        </button>
      </div>
    </div>
  );
}
