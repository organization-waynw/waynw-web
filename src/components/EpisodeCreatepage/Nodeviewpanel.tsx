/**
 * NodeViewPanel
 * 노드 조회 중인 상태: 읽기 전용 표시
 */

import { EpisodeNode } from "../../types/Episodes/Episodes";

interface NodeViewPanelProps {
  node: EpisodeNode;
}

export function NodeViewPanel({ node }: NodeViewPanelProps) {
  return (
    <div
      className="bg-[#ECF0F9] rounded-2xl p-5 relative"
      style={{ width: "80%" }}
    >
      {/* 수정 버튼 제거 */}

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
  );
}
