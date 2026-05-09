import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  updateEpisode,
  upsertEpisodeNodes,
  deleteEpisode,
} from "../api/episodes";
import { getDiskAnimationDelay } from "../utils/diskAnimation";

import { useEpisodeDetailData } from "../hooks/EpisodeDetailpage/useEpisodeDetailData";
import { useDetailEpisodeInfo } from "../hooks/EpisodeDetailpage/useDetailEpisodeInfo";
import { useDetailNodeManager } from "../hooks/EpisodeDetailpage/useDetailNodeManager";
import { useDetailNodeDnD } from "../hooks/EpisodeDetailpage/useDetailNodeDnD";
import { useDetailDiskAudio } from "../hooks/EpisodeDetailpage/useDetailDiskAudio";
import { useDetailDiskDrag } from "../hooks/EpisodeDetailpage/useDetailDiskDrag";
import { EpisodeDetailHeader } from "../components/EpisodeDetailpage/episodeDetailHeader";
import { EpisodeDetailInfoInput } from "../components/EpisodeDetailpage/episodeDetailInfoInput";
import { EpisodeSubInfo } from "../components/EpisodeDetailpage/episodeSubInfo";
import { EpisodeDeleteZone } from "../components/EpisodeDetailpage/episodeDeleteZone";
import { EpisodeDiskSection } from "../components/EpisodeDetailpage/EpisodeDiskSection";
import { EpisodeDiskModal } from "../components/EpisodeDetailpage/EpisodeDiskModal";
import { EpisodeSaveZone } from "../components/EpisodeDetailpage/episodeSaveZone";
import { EpisodeNodeTimeline } from "../components/EpisodeDetailpage/episodeNodeTimeline";

const DISK_SIZE = 560;
const DISK_VISIBLE = DISK_SIZE / 2;

function EpisodeDetailpage() {
  const { episodeId, id } = useParams<{ episodeId: string; id: string }>();
  const navigate = useNavigate();

  // ─── 데이터 로딩 ───────────────────────────────────────
  const { episode, disks, initialNodes, isLoading } =
    useEpisodeDetailData(episodeId);

  // ─── isDirty ───────────────────────────────────────────
  const [isDirty, setIsDirty] = useState(false);
  const markDirty = useCallback(() => setIsDirty(true), []);

  // ─── 에피소드 정보 hook ────────────────────────────────
  const episodeInfo = useDetailEpisodeInfo({
    episode: episode ?? undefined,
    onDirty: markDirty,
  });

  useEffect(() => {
    if (!episode) return;
    episodeInfo.reset(episode);
  }, [episode]);

  // ─── 노드 관리 hook ────────────────────────────────────
  const nodeManager = useDetailNodeManager({
    baseNodes: [],
    episodeId,
    onDirty: markDirty,
  });

  useEffect(() => {
    if (initialNodes.length > 0) {
      nodeManager.resetNodes(initialNodes);
    }
  }, [initialNodes]);

  // ─── 노드 DnD hook ─────────────────────────────────────
  const nodeDnD = useDetailNodeDnD({
    nodes: nodeManager.nodes,
    onMove: nodeManager.moveNode,
  });

  // ─── 디스크 선택 ───────────────────────────────────────
  const [selectedDiskId, setSelectedDiskId] = useState<string>("");
  const [isDiskModalOpen, setIsDiskModalOpen] = useState(false);

  useEffect(() => {
    if (episode?.disk_id) setSelectedDiskId(episode.disk_id);
  }, [episode]);

  const currentDisk = disks.find((d) => d.id === selectedDiskId);

  // ─── 오디오 hook ───────────────────────────────────────
  const { isPlaying, toggleMusic, switchDisk, playSaveSound } =
    useDetailDiskAudio();

  // ─── 저장 ──────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!episodeId) return;
    try {
      await Promise.all([
        updateEpisode({
          episodeId,
          diskId: selectedDiskId,
          name: episodeInfo.displayName,
          oneLineExplanation: episodeInfo.displayExplanation,
          subInfo: episodeInfo.editedSubInfo,
        }),
        upsertEpisodeNodes({
          episodeId,
          nodes: nodeManager.nodes,
        }),
      ]);
      playSaveSound();
      setIsDirty(false);
      toast.success("저장에 성공하였습니다", {
        style: {
          borderRadius: "12px",
          background: "#0F1C46",
          color: "#fff",
          fontSize: "14px",
        },
        iconTheme: { primary: "#0AA1F2", secondary: "#fff" },
      });
    } catch (e) {
      console.error(e);
      toast.error("저장에 실패했습니다.");
    }
  }, [
    episodeId,
    selectedDiskId,
    episodeInfo.displayName,
    episodeInfo.displayExplanation,
    episodeInfo.editedSubInfo,
    nodeManager.nodes,
    playSaveSound,
  ]);

  // ─── 삭제 ──────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!episodeId) return;
    try {
      await deleteEpisode(episodeId);
      toast.success("에피소드가 삭제되었습니다.");
      navigate(`/persona/${id}`);
    } catch (e) {
      console.error(e);
      toast.error("삭제에 실패했습니다.");
    }
  }, [episodeId, id, navigate]);

  // ─── 디스크 드래그 hook ────────────────────────────────
  const saveZoneRef = useRef<HTMLDivElement>(null);
  const deleteZoneRef = useRef<HTMLDivElement>(null);

  const {
    isDragging,
    dragX,
    dragY,
    isOverSaveZone,
    isOverDeleteZone,
    isDiskHovered,
    handleDiskMouseDown,
    handleDiskMouseEnter,
    handleDiskMouseLeave,
    isDraggedJustNow,
  } = useDetailDiskDrag(saveZoneRef, deleteZoneRef, {
    onSave: handleSave,
    onDelete: handleDelete,
  });

  // ─── 키보드 단축키 ─────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(`/persona/${id}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, id]);

  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  // ─── 로딩 / 에러 ───────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">에피소드를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <EpisodeDetailHeader isDirty={isDirty} onBack={() => navigate(-1)} />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="shrink-0" style={{ width: `${DISK_VISIBLE}px` }} />

        <EpisodeDiskSection
          currentDisk={currentDisk}
          isPlaying={isPlaying}
          isDiskHovered={isDiskHovered}
          isDragging={isDragging}
          dragX={dragX}
          dragY={dragY}
          diskSize={DISK_SIZE}
          diskVisible={DISK_VISIBLE}
          diskAnimationDelay={diskAnimationDelay}
          onMouseDown={handleDiskMouseDown}
          onMouseEnter={handleDiskMouseEnter}
          onMouseLeave={handleDiskMouseLeave}
          onClick={() => {
            if (isDraggedJustNow()) return;
            toggleMusic((currentDisk as any)?.music_url);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsDiskModalOpen(true);
          }}
        />

        <div
          className="flex flex-col min-w-0 pl-8 pr-2 ml-20"
          style={{ width: "840px", flexShrink: 0, overflow: "visible" }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <EpisodeDetailInfoInput
              displayName={episodeInfo.displayName}
              displayExplanation={episodeInfo.displayExplanation}
              onNameChange={(v) => {
                episodeInfo.setDisplayName(v);
                markDirty();
              }}
              onExplanationChange={(v) => {
                episodeInfo.setDisplayExplanation(v);
                markDirty();
              }}
              onAddNode={nodeManager.addNode}
            />

            <EpisodeNodeTimeline
              nodes={nodeManager.nodes}
              selectedNodeId={nodeManager.selectedNodeId}
              isEditingNode={nodeManager.isEditingNode}
              editNodeName={nodeManager.editNodeName}
              editNodeExplanation={nodeManager.editNodeExplanation}
              editNodeContent={nodeManager.editNodeContent}
              draggingNodeId={nodeDnD.draggingNodeId}
              dragOverIndex={nodeDnD.dragOverIndex}
              onNodeClick={nodeManager.selectNode}
              onEditStart={nodeManager.startEditing}
              onDelete={nodeManager.deleteNode}
              onEditNameChange={nodeManager.setEditNodeName}
              onEditExplanationChange={nodeManager.setEditNodeExplanation}
              onEditContentChange={nodeManager.setEditNodeContent}
              onEditSave={nodeManager.saveEdit}
              onEditCancel={nodeManager.cancelEdit}
              onDragStart={nodeDnD.handleNodeDragStart}
              onDragEnd={nodeDnD.handleNodeDragEnd}
              onDragOver={nodeDnD.handleNodeDragOver}
              onDrop={nodeDnD.handleNodeDrop}
              registerNodeRef={nodeDnD.registerNodeRef}
            />
          </div>
        </div>

        <EpisodeSubInfo
          isEditing={episodeInfo.isEditingSubInfo}
          editedSubInfo={episodeInfo.editedSubInfo}
          onEditStart={() => episodeInfo.setIsEditingSubInfo(true)}
          onSubInfoChange={episodeInfo.setEditedSubInfo}
          onSave={episodeInfo.handleSubInfoSave}
          onCancel={episodeInfo.handleSubInfoCancel}
        />

        <EpisodeSaveZone
          ref={saveZoneRef}
          isDragging={isDragging}
          isOverSaveZone={isOverSaveZone}
        />

        <EpisodeDeleteZone
          ref={deleteZoneRef}
          isDragging={isDragging}
          isOverDeleteZone={isOverDeleteZone}
        />
      </main>

      <EpisodeDiskModal
        isOpen={isDiskModalOpen}
        disks={disks}
        selectedDiskId={selectedDiskId}
        onSelect={(diskId) => {
          setSelectedDiskId(diskId);
          setIsDiskModalOpen(false);
          switchDisk(diskId);
          markDirty();
        }}
        onClose={() => setIsDiskModalOpen(false)}
      />

      <style>{`
        @keyframes diskSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default EpisodeDetailpage;
