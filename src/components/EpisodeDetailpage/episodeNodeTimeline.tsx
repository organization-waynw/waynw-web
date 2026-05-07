import { Edit2, Trash2 } from "lucide-react";
import { EpisodeNode } from "../../types/Episodes/episodes";

interface EpisodeNodeTimelineProps {
  nodes: EpisodeNode[];
  selectedNodeId: number | null;
  isEditingNode: boolean;
  editNodeName: string;
  editNodeExplanation: string;
  editNodeContent: string;
  draggingNodeId: number | null;
  dragOverIndex: number | null;
  onNodeClick: (nodeId: number) => void;
  onEditStart: (nodeId: number) => void;
  onDelete: (nodeId: number, e: React.MouseEvent) => void;
  onEditNameChange: (value: string) => void;
  onEditExplanationChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDragStart: (nodeId: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  registerNodeRef: (nodeId: number, el: HTMLDivElement | null) => void;
}

export function EpisodeNodeTimeline({
  nodes,
  selectedNodeId,
  isEditingNode,
  editNodeName,
  editNodeExplanation,
  editNodeContent,
  draggingNodeId,
  dragOverIndex,
  onNodeClick,
  onEditStart,
  onDelete,
  onEditNameChange,
  onEditExplanationChange,
  onEditContentChange,
  onEditSave,
  onEditCancel,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  registerNodeRef,
}: EpisodeNodeTimelineProps) {
  return (
    <div className="relative pb-20" onDragOver={onDragOver} onDrop={onDrop}>
      {nodes.map((node, idx) => {
        const isSelected = selectedNodeId === node.id;
        const isLast = idx === nodes.length - 1;
        const isDraggingNode = draggingNodeId === node.id;

        return (
          <div key={node.id}>
            {dragOverIndex === idx && draggingNodeId !== node.id && (
              <div className="h-1 mb-4 rounded-full bg-[#0AA1F2]" />
            )}

            <div
              ref={(el) => registerNodeRef(node.id, el)}
              draggable
              onDragStart={() => onDragStart(node.id)}
              onDragEnd={onDragEnd}
              className={`relative flex gap-6 transition-opacity ${
                isDraggingNode ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="flex flex-col items-center shrink-0">
                <button
                  onClick={() => onNodeClick(node.id)}
                  className={`w-10 h-10 rounded-full shrink-0 transition-all ${
                    isSelected
                      ? "bg-[#0F1C46]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
                {!isLast && (
                  <div className="w-0.5 bg-gray-200 flex-1 min-h-[2.5rem]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-10">
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => onNodeClick(node.id)}
                    className="flex-1 text-left"
                  >
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
                        onClick={() => onEditStart(node.id)}
                        className="flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        수정
                      </button>
                      <button
                        onClick={(e) => onDelete(node.id, e)}
                        className="flex items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4">
                    {isEditingNode ? (
                      <div className="space-y-3 bg-[#ECF0F9] rounded-2xl p-5">
                        <div>
                          <label className="block mb-1 text-xs text-gray-400">
                            노드 이름
                          </label>
                          <input
                            type="text"
                            value={editNodeName}
                            onChange={(e) => onEditNameChange(e.target.value)}
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
                            onChange={(e) =>
                              onEditExplanationChange(e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-gray-400">
                            내용
                          </label>
                          <textarea
                            value={editNodeContent}
                            onChange={(e) =>
                              onEditContentChange(e.target.value)
                            }
                            rows={5}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={onEditSave}
                            className="px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9]"
                          >
                            저장
                          </button>
                          <button
                            onClick={onEditCancel}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
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
                        <p className="pr-12 text-sm leading-relaxed text-gray-600">
                          {node.content || (
                            <span className="text-gray-300">
                              내용이 없습니다.
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
          </div>
        );
      })}

      {dragOverIndex === nodes.length && (
        <div className="h-1 rounded-full bg-[#0AA1F2]" />
      )}
    </div>
  );
}
