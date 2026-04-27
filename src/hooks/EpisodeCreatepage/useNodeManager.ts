/**
 * useNodeManager
 * 노드 생성, 읽기, 수정, 삭제 및 선택 상태를 관리합니다.
 */

import { useState } from "react";
import {
  DEFAULT_NODE_EXPLANATION,
  DEFAULT_NODE_NAME,
} from "../../constants/episodeCreate.constants";
import { EpisodeNode } from "../../types/Episodes/Episodes";

export function useNodeManager() {
  const [nodes, setNodes] = useState<EpisodeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);

  // 수정 중인 노드의 필드들
  const [editNodeName, setEditNodeName] = useState("");
  const [editNodeExplanation, setEditNodeExplanation] = useState("");
  const [editNodeContent, setEditNodeContent] = useState("");

  /**
   * 새로운 노드 추가
   */
  const addNode = () => {
    const newNode: EpisodeNode = {
      id: Date.now(),
      episode_id: "",
      name: DEFAULT_NODE_NAME,
      one_line_explanation: DEFAULT_NODE_EXPLANATION,
      content: "",
      created_at: new Date().toISOString(),
    };

    setNodes((prev) => [...prev, newNode]);
    selectNode(newNode.id, true); // 새 노드를 선택하고 편집 모드로
  };

  /**
   * 노드 삭제
   */
  const deleteNode = (nodeId: number) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setIsEditingNode(false);
    }
  };

  /**
   * 노드 선택 (토글)
   * @param nodeId - 선택할 노드 ID
   * @param startEditing - 즉시 편집 모드로 시작할지 여부 (기본값: false)
   */
  const selectNode = (nodeId: number, startEditing = false) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    if (selectedNodeId === nodeId && !startEditing) {
      // 같은 노드를 다시 클릭하면 선택 해제
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

  /**
   * 편집 시작
   */
  const startEditing = (nodeId: number) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setEditNodeName(node.name ?? "");
    setEditNodeExplanation(node.one_line_explanation ?? "");
    setEditNodeContent(node.content ?? "");
    setIsEditingNode(true);
  };

  /**
   * 편집 저장
   */
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
  };

  /**
   * 편집 취소
   */
  const cancelEdit = () => {
    const currentNode = nodes.find((n) => n.id === selectedNodeId);

    // 기본값으로만 채워진 새 노드라면 삭제
    if (
      currentNode &&
      currentNode.name === DEFAULT_NODE_NAME &&
      currentNode.one_line_explanation === DEFAULT_NODE_EXPLANATION &&
      !currentNode.content
    ) {
      deleteNode(selectedNodeId!);
    }

    setIsEditingNode(false);
  };

  /**
   * 선택된 노드 조회
   */
  const getSelectedNode = () => {
    return nodes.find((n) => n.id === selectedNodeId);
  };

  return {
    // 상태
    nodes,
    selectedNodeId,
    isEditingNode,
    editNodeName,
    editNodeExplanation,
    editNodeContent,

    // 상태 업데이트 함수
    setEditNodeName,
    setEditNodeExplanation,
    setEditNodeContent,

    // 액션
    addNode,
    deleteNode,
    selectNode,
    startEditing,
    saveEdit,
    cancelEdit,
    getSelectedNode,
  };
}
