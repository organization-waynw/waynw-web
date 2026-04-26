/**
 * DetailNodeTimeline
 * 에피소드 상세 페이지의 노드 타임라인
 */

import { EpisodeNode } from "../../types/Episodes/Rpisodes";
import { DetailNodeItem } from "./DetailNodeItem";

interface DetailNodeTimelineProps {
  nodes: EpisodeNode[];
  selectedNodeId: number | null;
  isEditingNode: boolean;
  editNodeName: string;
  editNodeExplanation: string;
  editNodeContent: string;
  onNodeClick: (nodeId: number) => void;
  onEditStart: (nodeId: number) => void;
  onDelete: (nodeId: number, e: React.MouseEvent) => void;
  onEditNameChange: (value: string) => void;
  onEditExplanationChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
}

export function DetailNodeTimeline({
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
}: DetailNodeTimelineProps) {
  return (
    <div className="relative pb-20">
      {nodes.map((node, idx) => {
        const isSelected = selectedNodeId === node.id;
        const isLast = idx === nodes.length - 1;

        return (
          <DetailNodeItem
            key={node.id}
            node={node}
            isLast={isLast}
            isSelected={isSelected}
            isEditing={isEditingNode && isSelected}
            editNodeName={editNodeName}
            editNodeExplanation={editNodeExplanation}
            editNodeContent={editNodeContent}
            onNodeClick={() => onNodeClick(node.id)}
            onEditStart={() => onEditStart(node.id)}
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
