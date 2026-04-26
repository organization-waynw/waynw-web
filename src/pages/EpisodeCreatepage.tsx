/**
 * EpisodeCreatePage (리팩토링 버전)
 *
 * 책임 분담:
 * - 상태 관리: 각 훅에서 담당
 * - UI 렌더링: 각 세션/컴포넌트에서 담당
 * - 오케스트레이션: 이 파일에서만
 */

import { useRef, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { disks } from "../data/EPISODES";
import { getDiskAnimationDelay } from "../utils/DiskAnimation";
import { useEpisodeState } from "../hooks/EpisodeCreatepage/useEpisodeState";
import { useNodeManager } from "../hooks/EpisodeCreatepage/useNodeManager";
import { useAudioPlayer } from "../hooks/EpisodeCreatepage/useAudioPlayer";
import { useDiskDrag } from "../hooks/EpisodeCreatepage/useDiskDrag";
import { EpisodeHeader } from "../components/EpisodeCreatepage/EpisodeHeader";
import { DISK_VISIBLE } from "../constants/episodeCreate.constants";
import { DiskSection } from "../components/EpisodeCreatepage/DiskSection";
import { EpisodeInfoInput } from "../components/EpisodeCreatepage/EpisodeInfoInput";
import { SaveZone } from "../components/EpisodeCreatepage/Savezone";
import { NodeTimeline } from "../components/EpisodeCreatepage/Nodetimeline";
import { DiskSelectModal } from "../components/EpisodeCreatepage/Diskselectmodal";

function EpisodeCreatePage() {
  // ── 디스크 선택
  const diskRef = useRef<HTMLDivElement>(null);
  const saveZoneRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const episodeState = useEpisodeState({
    onSaveSound: () => audioPlayer.playSaveSound(),
  });

  const nodeManager = useNodeManager();
  const audioPlayer = useAudioPlayer();
  const diskDrag = useDiskDrag(saveZoneRef, {
    onSave: episodeState.save,
  });

  // 디스크 관련
  const [selectedDiskId, setSelectedDiskId] = useState<string | null>(null);
  const [isDiskModalOpen, setIsDiskModalOpen] = useState(true);

  const currentDisk = disks.find((d) => d.id === selectedDiskId);
  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  // ── 이벤트 핸들러

  /**
   * 디스크 선택 확정
   */
  const handleDiskSelect = (diskId: string) => {
    setSelectedDiskId(diskId);
    setIsDiskModalOpen(false);
    audioPlayer.switchDisk(diskId);
  };

  /**
   * 디스크 클릭 (음악 재생/일시정지)
   */
  const handleDiskClick = () => {
    if (diskDrag.isDraggedJustNow()) return;

    const musicUrl = (currentDisk as any)?.music_url as string | undefined;
    audioPlayer.toggleMusic(musicUrl);
  };

  /**
   * 오른쪽 클릭 (디스크 선택 모달 열기)
   */
  const handleDiskContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!diskDrag.isDraggedJustNow()) {
      setIsDiskModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Toaster position="top-center" />

      {/* 헤더 */}
      <EpisodeHeader />

      <main className="relative flex flex-1 overflow-hidden">
        {/* 왼쪽 공간 확보 */}
        <div className="shrink-0" style={{ width: `${DISK_VISIBLE}px` }} />

        {/* 디스크 */}
        <DiskSection
          currentDisk={currentDisk}
          isPlaying={audioPlayer.isPlaying}
          isDiskHovered={diskDrag.isDiskHovered}
          isDragging={diskDrag.isDragging}
          dragX={diskDrag.dragX}
          diskRef={diskRef}
          diskAnimationDelay={diskAnimationDelay}
          onMouseDown={diskDrag.handleDiskMouseDown}
          onMouseEnter={diskDrag.handleDiskMouseEnter}
          onMouseLeave={diskDrag.handleDiskMouseLeave}
          onClick={handleDiskClick}
          onContextMenu={handleDiskContextMenu}
        />

        {/* 가운데: 에피소드 정보 + 노드 타임라인 */}
        <div
          className="flex flex-col min-w-0 pl-8 pr-2 ml-20"
          style={{ width: "840px", flexShrink: 0, overflow: "visible" }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* 에피소드 정보 입력 */}
            <EpisodeInfoInput
              episodeName={episodeState.episodeName}
              episodeExplanation={episodeState.episodeExplanation}
              onNameChange={episodeState.setEpisodeName}
              onExplanationChange={episodeState.setEpisodeExplanation}
              onAddNode={nodeManager.addNode}
            />

            {/* 노드 타임라인 */}
            <NodeTimeline
              nodes={nodeManager.nodes}
              selectedNodeId={nodeManager.selectedNodeId}
              isEditingNode={nodeManager.isEditingNode}
              editNodeName={nodeManager.editNodeName}
              editNodeExplanation={nodeManager.editNodeExplanation}
              editNodeContent={nodeManager.editNodeContent}
              onNodeClick={(node) => nodeManager.selectNode(node.id)}
              onEditStart={(node) => nodeManager.startEditing(node.id)}
              onDelete={nodeManager.deleteNode}
              onEditNameChange={nodeManager.setEditNodeName}
              onEditExplanationChange={nodeManager.setEditNodeExplanation}
              onEditContentChange={nodeManager.setEditNodeContent}
              onEditSave={nodeManager.saveEdit}
              onEditCancel={nodeManager.cancelEdit}
            />
          </div>
        </div>

        {/* 저장 드롭 영역 */}
        <SaveZone
          ref={saveZoneRef}
          isDragging={diskDrag.isDragging}
          isOverSaveZone={diskDrag.isOverSaveZone}
        />
      </main>

      {/* 디스크 선택 모달 */}
      <DiskSelectModal
        isOpen={isDiskModalOpen}
        selectedDiskId={selectedDiskId}
        onSelect={handleDiskSelect}
      />
    </div>
  );
}

export default EpisodeCreatePage;
