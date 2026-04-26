/**
 * EpisodeDetailpage (리팩토링 버전)
 *
 * 책임 분담:
 * - 상태 관리: 각 훅에서 담당
 * - UI 렌더링: 각 컴포넌트에서 담당
 * - 오케스트레이션: 이 파일에서만
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { episodes, episodeNodes, disks } from "../data/EPISODES";
import { getDiskAnimationDelay } from "../utils/DiskAnimation";
import { useDetailNodeManager } from "../hooks/EpisodeDetailpage/useDetailNodeManager";
import { useDetailEpisodeInfo } from "../hooks/EpisodeDetailpage/useDetailEpisodeInfo";
import { useDetailDiskDrag } from "../hooks/EpisodeDetailpage/useDetailDiskDrag";
import { useDetailDiskAudio } from "../hooks/EpisodeDetailpage/useDetailDiskAudio";
import {
  DISK_VISIBLE,
  SUCCESS_MESSAGES,
  TOAST_SUCCESS_ICON_THEME,
  TOAST_SUCCESS_STYLE,
} from "../constants/episodedetail.constants";
import { DetailEpisodeHeader } from "../components/EpisodeDetailpage/DetailEpisodeHeader";
import { DetailDiskInfoBox } from "../components/EpisodeDetailpage/DetailDiskInfoBox";
import { DetailDiskSection } from "../components/EpisodeDetailpage/DetailDiskSection";
import { DetailEpisodeInfoSection } from "../components/EpisodeDetailpage/DetailEpisodeInfoSection";
import { DetailNodeTimeline } from "../components/EpisodeDetailpage/DetailNodeTimeline";
import { DetailSubInfoPanel } from "../components/EpisodeDetailpage/DetailSubInfoPanel";
import { DetailDiskSelectModal } from "../components/EpisodeDetailpage/DetailDiskSelectModal";
import { DetailSaveZone } from "../components/EpisodeDetailpage/DetailSaveZone";

function EpisodeDetailpage() {
  const { episodeId, id } = useParams<{ episodeId: string; id: string }>();
  const navigate = useNavigate();

  // ── 기본 데이터
  const episode = episodes.find((e) => e.id === episodeId);
  const baseNodes = useMemo(
    () => episodeNodes.filter((n) => n.episode_id === episodeId),
    [episodeId],
  );

  // ── 상태 관리
  const [isDirty, setIsDirty] = useState(false);
  const [selectedDiskId, setSelectedDiskId] = useState(episode?.disk_id ?? "");
  const [isDiskModalOpen, setIsDiskModalOpen] = useState(false);

  const diskRef = useRef<HTMLDivElement>(null);
  const saveZoneRef = useRef<HTMLDivElement>(null);

  const nodeManager = useDetailNodeManager({ baseNodes, episodeId });
  const episodeInfo = useDetailEpisodeInfo({
    episode,
    onDirty: () => setIsDirty(true),
  });
  const diskDrag = useDetailDiskDrag(saveZoneRef, { onSave: handleSave });
  const diskAudio = useDetailDiskAudio();

  const currentDisk = disks.find((d) => d.id === selectedDiskId);
  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  // ── Esc 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/persona/${id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, id]);

  // ── 에러 처리
  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">에피소드를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // ── 이벤트 핸들러

  /**
   * 저장 처리
   */
  function handleSave() {
    diskAudio.playSaveSound();
    setIsDirty(false);
    toast.success(SUCCESS_MESSAGES.SAVE_SUCCESS, {
      style: TOAST_SUCCESS_STYLE,
      iconTheme: TOAST_SUCCESS_ICON_THEME,
    });
    navigate(`/persona/${id}`);
  }

  /**
   * 디스크 클릭 - 음악 재생/일시정지
   */
  function handleDiskClick() {
    if (diskDrag.isDraggedJustNow()) return;
    const musicUrl = (currentDisk as any)?.music_url as string | undefined;
    diskAudio.toggleMusic(musicUrl);
  }

  /**
   * 디스크 우클릭 - 모달 열기
   */
  function handleDiskContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    if (!diskDrag.isDraggedJustNow()) {
      setIsDiskModalOpen(true);
    }
  }

  /**
   * 디스크 변경
   */
  function handleDiskChange(diskId: string) {
    setSelectedDiskId(diskId);
    setIsDiskModalOpen(false);
    diskAudio.switchDisk(diskId);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Toaster position="top-center" />

      {/* 헤더 */}
      <DetailEpisodeHeader isDirty={isDirty} />

      <main className="relative flex flex-1 overflow-hidden">
        {/* 디스크 호버 정보 박스 */}
        <DetailDiskInfoBox
          isDiskHovered={diskDrag.isDiskHovered}
          isDragging={diskDrag.isDragging}
          currentDisk={currentDisk}
          onMouseEnter={diskDrag.handleDiskMouseEnter}
          onMouseLeave={diskDrag.handleDiskMouseLeave}
        />

        {/* 왼쪽 공간 확보 */}
        <div className="shrink-0" style={{ width: `${DISK_VISIBLE}px` }} />

        {/* 디스크 */}
        <DetailDiskSection
          currentDisk={currentDisk}
          isPlaying={diskAudio.isPlaying}
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
            {/* 에피소드 제목/설명 */}
            <DetailEpisodeInfoSection
              isEditing={episodeInfo.isEditingEpisode}
              displayName={episodeInfo.displayName}
              displayExplanation={episodeInfo.displayExplanation}
              editName={episodeInfo.editEpisodeName}
              editExplanation={episodeInfo.editEpisodeExplanation}
              onNameChange={episodeInfo.setEditEpisodeName}
              onExplanationChange={episodeInfo.setEditEpisodeExplanation}
              onEditStart={episodeInfo.handleEpisodeEditStart}
              onSave={episodeInfo.handleEpisodeSave}
              onCancel={() => episodeInfo.setIsEditingEpisode(false)}
              onAddNode={nodeManager.addNode}
            />

            {/* 노드 타임라인 */}
            <DetailNodeTimeline
              nodes={nodeManager.nodes}
              selectedNodeId={nodeManager.selectedNodeId}
              isEditingNode={nodeManager.isEditingNode}
              editNodeName={nodeManager.editNodeName}
              editNodeExplanation={nodeManager.editNodeExplanation}
              editNodeContent={nodeManager.editNodeContent}
              onNodeClick={nodeManager.selectNode}
              onEditStart={nodeManager.startEditing}
              onDelete={nodeManager.deleteNode}
              onEditNameChange={nodeManager.setEditNodeName}
              onEditExplanationChange={nodeManager.setEditNodeExplanation}
              onEditContentChange={nodeManager.setEditNodeContent}
              onEditSave={nodeManager.saveEdit}
              onEditCancel={nodeManager.cancelEdit}
            />
          </div>
        </div>

        {/* 오른쪽: 부가정보 */}
        <div className="pt-20 pb-20 pl-0 pl-10 pr-8 overflow-y-auto shrink-0 w-96">
          <DetailSubInfoPanel
            isEditing={episodeInfo.isEditingSubInfo}
            editedSubInfo={episodeInfo.editedSubInfo}
            onEditStart={() => episodeInfo.setIsEditingSubInfo(true)}
            onInfoChange={episodeInfo.setEditedSubInfo}
            onSave={episodeInfo.handleSubInfoSave}
            onCancel={episodeInfo.handleSubInfoCancel}
          />
        </div>

        {/* 저장 드롭 영역 */}
        <DetailSaveZone
          ref={saveZoneRef}
          isDragging={diskDrag.isDragging}
          isOverSaveZone={diskDrag.isOverSaveZone}
        />
      </main>

      {/* 디스크 선택 모달 */}
      <DetailDiskSelectModal
        isOpen={isDiskModalOpen}
        selectedDiskId={selectedDiskId}
        onSelect={handleDiskChange}
        onClose={() => setIsDiskModalOpen(false)}
      />
    </div>
  );
}

export default EpisodeDetailpage;
