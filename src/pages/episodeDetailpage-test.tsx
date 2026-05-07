import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit2, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  getEpisodeById,
  getDisks,
  updateEpisode,
  getEpisodeNodes,
  upsertEpisodeNodes,
  deleteEpisode,
} from "../api/episodes";

import {
  DISK_SPIN_DURATION,
  getDiskAnimationDelay,
} from "../utils/diskAnimation";
import { Episode, EpisodeNode } from "../types/Episodes/episodes";
import { Disk } from "../types/Disk/disk";
import { useDetailEpisodeInfo } from "../hooks/EpisodeDetailpage/useDetailEpisodeInfo";
import { useDetailNodeManager } from "../hooks/EpisodeDetailpage/useDetailNodeManager";
import { useDetailNodeDnD } from "../hooks/EpisodeDetailpage/useDetailNodeDnD";
import { useDetailDiskAudio } from "../hooks/EpisodeDetailpage/useDetailDiskAudio";
import { useDetailDiskDrag } from "../hooks/EpisodeDetailpage/useDetailDiskDrag";

function EpisodeDetailpage() {
  const { episodeId, id } = useParams<{ episodeId: string; id: string }>();
  const navigate = useNavigate();

  // ─── 원격 데이터 ───────────────────────────────────────
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [disks, setDisks] = useState<Disk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialNodes, setInitialNodes] = useState<EpisodeNode[]>([]);

  useEffect(() => {
    if (!episodeId) return;

    (async () => {
      try {
        const [ep, diskList, nodeList] = await Promise.all([
          getEpisodeById(episodeId),
          getDisks(),
          getEpisodeNodes(episodeId), // 추가
        ]);
        setEpisode(ep);
        setDisks(diskList);
        setInitialNodes(nodeList); // 추가
      } catch (e) {
        console.error(e);
        toast.error("데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [episodeId]);

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
    console.log(episode);
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

  // ─── 디스크 드래그 hook ────────────────────────────────
  const saveZoneRef = useRef<HTMLDivElement>(null);
  const deleteZoneRef = useRef<HTMLDivElement>(null);

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

  // ─── 디스크 클릭 ───────────────────────────────────────
  const handleDiskClick = () => {
    if (isDraggedJustNow()) return;
    const musicUrl = (currentDisk as any)?.music_url as string | undefined;
    toggleMusic(musicUrl);
  };

  // ─── 디스크 변경 ───────────────────────────────────────
  const handleDiskChange = (diskId: string) => {
    setSelectedDiskId(diskId);
    setIsDiskModalOpen(false);
    switchDisk(diskId);
    markDirty();
  };

  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  const DISK_SIZE = 560;
  const DISK_VISIBLE = DISK_SIZE / 2;

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
      {/* 헤더 */}
      <header className="z-20 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-[#0F1C46] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-sm">돌아가기</span>
          </button>

          <h1 className="text-base font-semibold text-[#0F1C46]">
            에피소드 상세
            {isDirty && <span className="text-[#0AA1F2]">(수정중)</span>}
          </h1>

          <div className="w-20" />
        </div>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        {/* 디스크 공간 확보 */}
        <div className="shrink-0" style={{ width: `${DISK_VISIBLE}px` }} />
        {/* 디스크 */}
        <div
          className="fixed"
          style={{
            top: "50%",
            left: 0,
            // ← 이 부분을 교체
            transform: `translate(calc(-${DISK_VISIBLE}px + ${dragX}px), calc(-50% + ${dragY}px))`,
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            cursor: isDragging ? "grabbing" : "grab",
            zIndex: isDragging ? 40 : 1,
          }}
        >
          <div
            className="relative"
            onClick={handleDiskClick}
            onMouseDown={handleDiskMouseDown}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsDiskModalOpen(true);
            }}
            onMouseEnter={handleDiskMouseEnter}
            onMouseLeave={handleDiskMouseLeave}
          >
            <div
              className="overflow-hidden rounded-full shadow-2xl"
              style={{
                width: `${DISK_SIZE}px`,
                height: `${DISK_SIZE}px`,
                animation: `diskSpin ${DISK_SPIN_DURATION}ms linear infinite`,
                animationDelay: diskAnimationDelay,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            >
              {currentDisk?.img_url ? (
                <img
                  src={currentDisk.img_url}
                  alt={currentDisk.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-inner" />
            </div>
          </div>
        </div>
        {/* 디스크 hover 정보 */}
        {isDiskHovered && !isDragging && currentDisk?.disk_info?.music && (
          <div
            className="fixed z-10 px-4 py-3 bg-white border border-gray-200 shadow-md rounded-2xl w-52"
            style={{ top: "200px", left: `${DISK_VISIBLE - 180}px` }}
            onMouseEnter={handleDiskMouseEnter}
            onMouseLeave={handleDiskMouseLeave}
          >
            <p className="text-[10px] text-gray-400 mb-1">
              {currentDisk.disk_info.source}
            </p>
            <p className="text-sm font-bold text-[#0F1C46] leading-snug">
              {currentDisk.disk_info.music.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {currentDisk.disk_info.music.artist}
            </p>
            {currentDisk.disk_info.links?.youtube && (
              <a
                href={currentDisk.disk_info.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-[10px] text-[#0AA1F2] hover:underline"
              >
                YouTube ↗
              </a>
            )}
            {currentDisk.disk_info.license && (
              <p className="text-[10px] text-gray-400 mt-1">
                {currentDisk.disk_info.license.type}
              </p>
            )}
          </div>
        )}
        {/* 중앙 */}
        <div
          className="flex flex-col min-w-0 pl-8 pr-2 ml-20"
          style={{ width: "840px", flexShrink: 0, overflow: "visible" }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* 에피소드 헤더 */}
            {/* 에피소드 헤더 */}
            <div className="pt-20 pb-6 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={episodeInfo.displayName}
                    onChange={(e) => {
                      episodeInfo.setDisplayName(e.target.value);
                      markDirty();
                    }}
                    placeholder="이름"
                    className="w-full text-5xl font-bold text-[#0F1C46] placeholder-gray-200 bg-transparent focus:outline-none tracking-tight mb-3"
                  />
                  <input
                    type="text"
                    value={episodeInfo.displayExplanation}
                    onChange={(e) => {
                      episodeInfo.setDisplayExplanation(e.target.value);
                      markDirty();
                    }}
                    placeholder="설명"
                    className="w-full pb-1 text-sm text-gray-400 placeholder-gray-300 transition-colors bg-transparent border-b border-transparent focus:outline-none focus:border-gray-200"
                  />
                </div>
                <button
                  onClick={nodeManager.addNode}
                  className="mt-2 flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-[#0F1C46] hover:bg-gray-100 transition-colors shrink-0"
                  title="노드 추가"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 노드 목록 */}
            <div
              className="relative pb-20"
              onDragOver={nodeDnD.handleNodeDragOver}
              onDrop={nodeDnD.handleNodeDrop}
            >
              {nodeManager.nodes.map((node, idx) => {
                const isSelected = nodeManager.selectedNodeId === node.id;
                const isLast = idx === nodeManager.nodes.length - 1;
                const isDraggingNode = nodeDnD.draggingNodeId === node.id;

                return (
                  <div key={node.id}>
                    {nodeDnD.dragOverIndex === idx &&
                      nodeDnD.draggingNodeId !== node.id && (
                        <div className="h-1 mb-4 rounded-full bg-[#0AA1F2]" />
                      )}

                    <div
                      ref={(el) => nodeDnD.registerNodeRef(node.id, el)}
                      draggable
                      onDragStart={() => nodeDnD.handleNodeDragStart(node.id)}
                      onDragEnd={nodeDnD.handleNodeDragEnd}
                      className={`relative flex gap-6 transition-opacity ${
                        isDraggingNode ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <div className="flex flex-col items-center shrink-0">
                        <button
                          onClick={() => nodeManager.selectNode(node.id)}
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
                            onClick={() => nodeManager.selectNode(node.id)}
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
                                onClick={() =>
                                  nodeManager.startEditing(node.id)
                                }
                                className="flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                수정
                              </button>
                              <button
                                onClick={(e) =>
                                  nodeManager.deleteNode(node.id, e)
                                }
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
                            {nodeManager.isEditingNode ? (
                              <div className="space-y-3 bg-[#ECF0F9] rounded-2xl p-5">
                                <div>
                                  <label className="block mb-1 text-xs text-gray-400">
                                    노드 이름
                                  </label>
                                  <input
                                    type="text"
                                    value={nodeManager.editNodeName}
                                    onChange={(e) =>
                                      nodeManager.setEditNodeName(
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                                  />
                                </div>
                                <div>
                                  <label className="block mb-1 text-xs text-gray-400">
                                    한줄 설명
                                  </label>
                                  <input
                                    type="text"
                                    value={nodeManager.editNodeExplanation}
                                    onChange={(e) =>
                                      nodeManager.setEditNodeExplanation(
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                                  />
                                </div>
                                <div>
                                  <label className="block mb-1 text-xs text-gray-400">
                                    내용
                                  </label>
                                  <textarea
                                    value={nodeManager.editNodeContent}
                                    onChange={(e) =>
                                      nodeManager.setEditNodeContent(
                                        e.target.value,
                                      )
                                    }
                                    rows={5}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={nodeManager.saveEdit}
                                    className="px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9]"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={nodeManager.cancelEdit}
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

              {nodeDnD.dragOverIndex === nodeManager.nodes.length && (
                <div className="h-1 rounded-full bg-[#0AA1F2]" />
              )}
            </div>
          </div>
        </div>
        {/* 오른쪽 부가정보 */}
        <div className="pt-20 pb-20 pl-10 pr-8 overflow-y-auto shrink-0 w-96">
          <div className="bg-gray-100 rounded-2xl p-6 min-h-[480px]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">부가정보</p>
              {!episodeInfo.isEditingSubInfo && (
                <button
                  onClick={() => episodeInfo.setIsEditingSubInfo(true)}
                  className="text-[#0AA1F2] hover:text-[#0890D9] text-xs"
                >
                  수정
                </button>
              )}
            </div>

            {episodeInfo.isEditingSubInfo ? (
              <div className="space-y-3">
                <textarea
                  value={episodeInfo.editedSubInfo}
                  onChange={(e) => episodeInfo.setEditedSubInfo(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={episodeInfo.handleSubInfoSave}
                    className="flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm"
                  >
                    저장
                  </button>
                  <button
                    onClick={episodeInfo.handleSubInfoCancel}
                    className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 whitespace-pre-wrap">
                {episodeInfo.editedSubInfo || "등록된 부가정보가 없습니다."}
              </p>
            )}
          </div>
        </div>
        {/* 저장 드래그 영역 */}
        <div
          ref={saveZoneRef}
          className="fixed top-0 right-0 z-30 flex items-center justify-center h-full transition-all duration-300 ease-out"
          style={{
            width: "120px",
            transform: isDragging ? "translateX(0)" : "translateX(100%)",
            background: isOverSaveZone
              ? "linear-gradient(135deg, #0AA1F2, #0F1C46)"
              : "rgba(200, 210, 230, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex flex-col items-center gap-3 select-none">
            <Save
              className="w-8 h-8 transition-transform duration-200"
              style={{
                transform: isOverSaveZone ? "scale(1.2)" : "scale(1)",
                color: isOverSaveZone ? "#fff" : "#6b7280",
              }}
            />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: isOverSaveZone ? "#fff" : "#6b7280" }}
            >
              저장
            </span>
          </div>
        </div>

        <div
          ref={deleteZoneRef}
          className="fixed bottom-0 left-0 z-30 flex items-center justify-center w-full transition-all duration-300 ease-out"
          style={{
            height: "120px",
            transform: isDragging ? "translateY(0)" : "translateY(100%)",
            background: isOverDeleteZone
              ? "linear-gradient(135deg, #ef4444, #991b1b)"
              : "rgba(230, 200, 200, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex flex-col items-center gap-3 select-none">
            <Trash2
              className="w-8 h-8 transition-transform duration-200"
              style={{
                transform: isOverDeleteZone ? "scale(1.2)" : "scale(1)",
                color: isOverDeleteZone ? "#fff" : "#6b7280",
              }}
            />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: isOverDeleteZone ? "#fff" : "#6b7280" }}
            >
              삭제
            </span>
          </div>
        </div>
      </main>

      {/* 디스크 선택 모달 */}
      {isDiskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setIsDiskModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-8 w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#0F1C46]">
                디스크를 골라주세요
              </h3>
              <button
                onClick={() => setIsDiskModalOpen(false)}
                className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                X
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {disks.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDiskChange(d.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                    selectedDiskId === d.id
                      ? "ring-2 ring-[#0AA1F2] bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-24 h-24 overflow-hidden rounded-full shadow-md">
                    <img
                      src={d.img_url}
                      alt={d.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
