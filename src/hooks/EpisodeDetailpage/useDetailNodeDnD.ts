/**
 * useDetailNodeDnD
 * 에피소드 상세 페이지에서 노드 드래그 앤 드롭 순서 변경을 관리합니다.
 */

import { useState, useRef } from "react";
import { EpisodeNode } from "../../types/Episodes/episodes";
import { getClosestNodeIndex } from "../../utils/episodeNodeDnD";

interface UseDetailNodeDnDOptions {
  nodes: EpisodeNode[];
  onMove: (fromIndex: number, toIndex: number) => void;
}

export function useDetailNodeDnD({ nodes, onMove }: UseDetailNodeDnDOptions) {
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleNodeDragStart = (nodeId: number) => {
    setDraggingNodeId(nodeId);
  };

  const handleNodeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const idx = getClosestNodeIndex(e.clientY, nodes, nodeRefs.current);
    setDragOverIndex(idx);
  };

  const handleNodeDrop = () => {
    if (draggingNodeId === null || dragOverIndex === null) {
      setDraggingNodeId(null);
      setDragOverIndex(null);
      return;
    }

    const fromIndex = nodes.findIndex((n) => n.id === draggingNodeId);
    onMove(fromIndex, dragOverIndex);

    setDraggingNodeId(null);
    setDragOverIndex(null);
  };

  const handleNodeDragEnd = () => {
    setDraggingNodeId(null);
    setDragOverIndex(null);
  };

  /**
   * ref 등록 콜백 - 각 노드 div에 연결
   * ref={(el) => nodeDnD.registerNodeRef(node.id, el)}
   */
  const registerNodeRef = (nodeId: number, el: HTMLDivElement | null) => {
    nodeRefs.current[nodeId] = el;
  };

  return {
    draggingNodeId,
    dragOverIndex,
    handleNodeDragStart,
    handleNodeDragOver,
    handleNodeDrop,
    handleNodeDragEnd,
    registerNodeRef,
  };
}
