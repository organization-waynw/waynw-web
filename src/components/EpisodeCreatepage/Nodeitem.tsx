/**
 * NodeItem
 * 타임라인에 표시되는 개별 노드 아이템
 */

import { Edit2, Trash2 } from "lucide-react";
import { NodeEditPanel } from "./Nodeeditpanel";
import { NodeViewPanel } from "./Nodeviewpanel";
import { EpisodeNode } from "../../types/Episodes/episodes";

interface NodeItemProps {
  node: EpisodeNode;
  index: number;
  isLast: boolean;
  isSelected: boolean;
  isEditing: boolean;
  editNodeName: string;
  editNodeExplanation: string;
  editNodeContent: string;
  onNodeClick: () => void;
  onEditStart: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onEditNameChange: (value: string) => void;
  onEditExplanationChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
}

export function NodeItem({
  node,
  index,
  isLast,
  isSelected,
  isEditing,
  editNodeName,
  editNodeExplanation,
  editNodeContent,
  onNodeClick,
  onEditStart,
  onDelete,
  onEditNameChange,
  onEditExplanationChange,
  onEditContentChange,
  onEditSave,
  onEditCancel,
}: NodeItemProps) {
  return (
    <div className="relative flex gap-6">
      {/* 왼쪽 타임라인 */}
      <div className="flex flex-col items-center shrink-0">
        <button
          onClick={onNodeClick}
          className={`w-10 h-10 rounded-full shrink-0 transition-all ${
            isSelected ? "bg-[#0F1C46]" : "bg-gray-200 hover:bg-gray-300"
          }`}
        />
        {!isLast && <div className="w-0.5 bg-gray-200 flex-1 min-h-[2.5rem]" />}
      </div>

      {/* 오른쪽 콘텐츠 */}
      <div className="flex-1 min-w-0 pb-10">
        {/* 헤더: 제목 + 버튼 */}
        <div className="flex items-start justify-between">
          <button onClick={onNodeClick} className="flex-1 text-left">
            <p
              className={`text-lg font-semibold transition-colors ${
                isSelected
                  ? "text-[#0F1C46]"
                  : "text-gray-600 hover:text-[#0F1C46]"
              }`}
            >
              {node.name}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              {node.one_line_explanation}
            </p>
          </button>

          {isSelected && (
            <div className="flex items-center gap-3 mt-1 ml-4 shrink-0">
              <button
                onClick={onEditStart}
                className="flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                수정
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 펼침: 수정/조회 패널 */}
        {isSelected && (
          <div className="mt-4">
            {isEditing ? (
              <NodeEditPanel
                editNodeName={editNodeName}
                editNodeExplanation={editNodeExplanation}
                editNodeContent={editNodeContent}
                onNameChange={onEditNameChange}
                onExplanationChange={onEditExplanationChange}
                onContentChange={onEditContentChange}
                onSave={onEditSave}
                onCancel={onEditCancel}
              />
            ) : (
              <NodeViewPanel node={node} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
