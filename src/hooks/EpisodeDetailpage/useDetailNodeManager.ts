/**
 * useDetailNodeManager
 * 에피소드 상세 페이지에서 노드 CRUD 및 선택 상태를 관리합니다.
 */

import { useState } from "react";
import {
  DEFAULT_NODE_EXPLANATION,
  DEFAULT_NODE_NAME,
} from "../../constants/episodedetail.constants";
import { reorderNodes } from "../../utils/episodeNodeDnD";
import { EpisodeNode } from "../../types/Episodes/episodes";

interface UseDetailNodeManagerOptions {
  baseNodes: EpisodeNode[];
  episodeId?: string;
  onDirty?: () => void;
}

export function useDetailNodeManager({
  baseNodes,
  episodeId,
  onDirty,
}: UseDetailNodeManagerOptions) {
  const [nodes, setNodes] = useState<EpisodeNode[]>(baseNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);

  const [editNodeName, setEditNodeName] = useState("");
  const [editNodeExplanation, setEditNodeExplanation] = useState("");
  const [editNodeContent, setEditNodeContent] = useState("");

  const addNode = () => {
    const newNode: EpisodeNode = {
      id: Date.now(),
      episode_id: episodeId ?? "",
      name: DEFAULT_NODE_NAME,
      one_line_explanation: DEFAULT_NODE_EXPLANATION,
      content: "",
      created_at: new Date().toISOString(),
    };

    setNodes((prev) => [...prev, newNode]);
    selectNode(newNode.id, true);
    onDirty?.();
  };

  const deleteNode = (nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setIsEditingNode(false);
    }
    onDirty?.();
  };

  const selectNode = (nodeId: number, startEditing = false) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    if (selectedNodeId === nodeId && !startEditing) {
      setSelectedNodeId(null);
      setIsEditingNode(false);
    } else {
      setSelectedNodeId(nodeId);
      setEditNodeName(node.name ?? "");
      setEditNodeExplanation(node.one_line_explanation ?? "");
      setEditNodeContent(node.content ?? "");
      setIsEditingNode(startEditing);
    }
  };

  const startEditing = (nodeId: number) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setEditNodeName(node.name ?? "");
    setEditNodeExplanation(node.one_line_explanation ?? "");
    setEditNodeContent(node.content ?? "");
    setIsEditingNode(true);
  };

  const saveEdit = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId
          ? {
              ...n,
              name: editNodeName,
              one_line_explanation: editNodeExplanation,
              content: editNodeContent,
            }
          : n,
      ),
    );
    setIsEditingNode(false);
    onDirty?.();
  };

  const cancelEdit = () => {
    const currentNode = nodes.find((n) => n.id === selectedNodeId);

    if (
      currentNode &&
      currentNode.name === DEFAULT_NODE_NAME &&
      currentNode.one_line_explanation === DEFAULT_NODE_EXPLANATION &&
      !currentNode.content
    ) {
      setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
      setSelectedNodeId(null);
    }

    setIsEditingNode(false);
  };

  /**
   * 노드 순서 변경
   */
  const moveNode = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setNodes((prev) => reorderNodes(prev, fromIndex, toIndex));
    onDirty?.();
  };

  const resetNodes = (newNodes: EpisodeNode[]) => {
    setNodes(newNodes);
  };

  return {
    nodes,
    selectedNodeId,
    isEditingNode,
    editNodeName,
    editNodeExplanation,
    editNodeContent,

    setEditNodeName,
    setEditNodeExplanation,
    setEditNodeContent,

    addNode,
    deleteNode,
    selectNode,
    startEditing,
    saveEdit,
    cancelEdit,
    moveNode,
    resetNodes,
  };
}
