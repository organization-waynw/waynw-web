/**
 * NodeTimeline
 * 모든 노드를 타임라인으로 표시하는 컨테이너
 */

import { EpisodeNode } from "../../types/Episodes/episodes";
import { NodeItem } from "./Nodeitem";

interface NodeTimelineProps {
  nodes: EpisodeNode[];
  selectedNodeId: number | null;
  isEditingNode: boolean;
  editNodeName: string;
  editNodeExplanation: string;
  editNodeContent: string;
  onNodeClick: (node: EpisodeNode) => void;
  onEditStart: (node: EpisodeNode) => void;
  onDelete: (nodeId: number, e: React.MouseEvent) => void;
  onEditNameChange: (value: string) => void;
  onEditExplanationChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
}

export function NodeTimeline({
  nodes,
  selectedNodeId,
  isEditingNode,
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
}: NodeTimelineProps) {
  return (
    <div className="relative pb-20">
      {nodes.length === 0 && (
        <p className="mt-2 text-sm text-gray-300">
          + 버튼으로 노드를 추가해보세요
        </p>
      )}
      {nodes.map((node, idx) => {
        const isSelected = selectedNodeId === node.id;
        const isLast = idx === nodes.length - 1;

        return (
          <NodeItem
            key={node.id}
            node={node}
            index={idx}
            isLast={isLast}
            isSelected={isSelected}
            isEditing={isEditingNode && isSelected}
            editNodeName={editNodeName}
            editNodeExplanation={editNodeExplanation}
            editNodeContent={editNodeContent}
            onNodeClick={() => onNodeClick(node)}
            onEditStart={() => onEditStart(node)}
            onDelete={(e) => onDelete(node.id, e)}
            onEditNameChange={onEditNameChange}
            onEditExplanationChange={onEditExplanationChange}
            onEditContentChange={onEditContentChange}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
          />
        );
      })}
    </div>
  );
}
