/**
 * DetailNodeItem
 * 에피소드 상세 페이지의 개별 노드 아이템
 */

import { Edit2, Trash2, Check } from "lucide-react";
import { EpisodeNode } from "../../types/Episodes/Episodes";

interface DetailNodeItemProps {
  node: EpisodeNode;
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

export function DetailNodeItem({
  node,
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
}: DetailNodeItemProps) {
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
        {/* 헤더 */}
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
              <div className="space-y-3 bg-[#ECF0F9] rounded-2xl p-5">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    노드 이름
                  </label>
                  <input
                    type="text"
                    value={editNodeName}
                    onChange={(e) => onEditNameChange(e.target.value)}
                    placeholder="노드 이름"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    한줄 설명
                  </label>
                  <input
                    type="text"
                    value={editNodeExplanation}
                    onChange={(e) => onEditExplanationChange(e.target.value)}
                    placeholder="한줄 설명"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    내용
                  </label>
                  <textarea
                    value={editNodeContent}
                    onChange={(e) => onEditContentChange(e.target.value)}
                    placeholder="내용"
                    rows={5}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onEditSave}
                    className="flex items-center gap-1 px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    저장
                  </button>
                  <button
                    onClick={onEditCancel}
                    className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="bg-[#ECF0F9] rounded-2xl p-5 relative"
                style={{ width: "80%" }}
              >
                <button
                  onClick={onEditStart}
                  className="absolute top-4 right-4 flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  수정
                </button>
                <p className="pr-12 text-sm leading-relaxed text-gray-600">
                  {node.content || (
                    <span className="text-gray-300">
                      내용이 없습니다. 수정을 눌러 추가해주세요.
                    </span>
                  )}
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  {node.created_at.slice(0, 10)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
