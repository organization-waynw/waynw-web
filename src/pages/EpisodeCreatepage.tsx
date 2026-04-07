// EpisodeCreatePage.tsx

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Plus, Edit2, Trash2, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { disks, EpisodeNode } from "../data/episodes";
import {
  getDiskAnimationDelay,
  DISK_SPIN_DURATION,
} from "../utils/diskAnimation";

// ── 드래그 감지 임계값 (px): 이 값보다 많이 움직여야 드래그로 인식
//    클릭과 드래그를 구분하는 기준입니다. 값을 높이면 더 많이 움직여야 드래그 시작
const DRAG_THRESHOLD = 5;

const DEFAULT_NODE_NAME = "새 노드";
const DEFAULT_NODE_EXPLANATION = "한줄 설명을 입력해주세요";

const DISK_SIZE = 560;
const DISK_VISIBLE = DISK_SIZE / 2;

function EpisodeCreatePage() {
  const { id: personaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── 디스크 선택 (진입 시 필수)
  const [selectedDiskId, setSelectedDiskId] = useState<string | null>(null);
  const [isDiskModalOpen, setIsDiskModalOpen] = useState(true); // 진입 시 바로 오픈

  const currentDisk = disks.find((d) => d.id === selectedDiskId);
  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  // ── 에피소드 기본 정보
  const [episodeName, setEpisodeName] = useState("");
  const [episodeExplanation, setEpisodeExplanation] = useState("");

  // ── 노드
  const [nodes, setNodes] = useState<EpisodeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editNodeName, setEditNodeName] = useState("");
  const [editNodeExplanation, setEditNodeExplanation] = useState("");
  const [editNodeContent, setEditNodeContent] = useState("");

  // ── 디스크 호버
  const [isDiskHovered, setIsDiskHovered] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 오디오
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useMemo(() => new Audio(), []);
  useEffect(() => {
    return () => {
      audioRef.pause();
      audioRef.src = "";
    };
  }, [audioRef]);

  // ── 저장 사운드
  const saveSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    saveSoundRef.current = new Audio("/sounds/save-click.mp3");
  }, []);

  // ── 드래그
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isOverSaveZone, setIsOverSaveZone] = useState(false);
  const dragStartX = useRef<number>(0);
  const hasDragged = useRef(false);
  const justDropped = useRef(false);
  const diskRef = useRef<HTMLDivElement>(null);
  const saveZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;
      if (!hasDragged.current && Math.abs(deltaX) > DRAG_THRESHOLD) {
        hasDragged.current = true;
      }
      if (!hasDragged.current) return;

      const clampedX = Math.max(0, deltaX);
      setDragX(clampedX);

      if (saveZoneRef.current) {
        const rect = saveZoneRef.current.getBoundingClientRect();
        const over =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        setIsOverSaveZone(over);
      }
    };

    const handleMouseUp = () => {
      if (hasDragged.current && isOverSaveZone) {
        justDropped.current = true;
        handleSave();
      }
      setDragX(0);
      setIsDragging(false);
      setIsOverSaveZone(false);
      setIsDiskHovered(false);
      hasDragged.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isOverSaveZone]);

  const handleDiskMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    hasDragged.current = false;
    setIsDragging(true);
  };

  const handleDiskMouseEnter = () => {
    if (isDragging) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsDiskHovered(true);
  };

  const handleDiskMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setIsDiskHovered(false), 150);
  };

  // ── 저장
  const handleSave = () => {
    if (!episodeName.trim()) {
      toast.error("에피소드 이름을 입력해주세요", {
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#0F1C46",
          fontSize: "14px",
          border: "1px solid #fee2e2",
        },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }
    if (!episodeExplanation.trim()) {
      toast.error("에피소드 설명을 입력해주세요", {
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#0F1C46",
          fontSize: "14px",
          border: "1px solid #fee2e2",
        },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }

    saveSoundRef.current?.play();
    toast.success("에피소드가 생성되었습니다", {
      style: {
        borderRadius: "12px",
        background: "#0F1C46",
        color: "#fff",
        fontSize: "14px",
      },
      iconTheme: { primary: "#0AA1F2", secondary: "#fff" },
    });

    setTimeout(() => {
      navigate(`/persona/${personaId}`);
    }, 800);
  };

  // ── 디스크 클릭 (음악)
  const handleDiskClick = () => {
    if (hasDragged.current || justDropped.current) {
      justDropped.current = false;
      return;
    }
    const musicUrl = (currentDisk as any)?.music_url as string | undefined;
    if (!musicUrl) return;
    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.src !== musicUrl) {
        audioRef.pause();
        audioRef.src = musicUrl;
        audioRef.currentTime = 0;
      }
      audioRef.play();
      setIsPlaying(true);
    }
  };

  // ── 디스크 선택 확정
  const handleDiskSelect = (diskId: string) => {
    setSelectedDiskId(diskId);
    setIsDiskModalOpen(false);
    // 디스크 변경 시 재생 중이면 교체
    if (isPlaying) {
      const newDisk = disks.find((d) => d.id === diskId);
      const newUrl = (newDisk as any)?.music_url as string | undefined;
      audioRef.pause();
      if (newUrl) {
        audioRef.src = newUrl;
        audioRef.currentTime = 0;
        audioRef.play();
      } else {
        setIsPlaying(false);
      }
    }
  };

  // ── 노드 추가
  const handleAddNode = () => {
    const newNode: EpisodeNode = {
      id: Date.now(),
      episode_id: "",
      name: DEFAULT_NODE_NAME,
      one_line_explanation: DEFAULT_NODE_EXPLANATION,
      content: "",
      created_at: new Date().toISOString(),
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setEditNodeName(newNode.name ?? "");
    setEditNodeExplanation(newNode.one_line_explanation ?? "");
    setEditNodeContent(newNode.content ?? "");
    setIsEditingNode(true);
  };

  // ── 노드 삭제
  const handleDeleteNode = (nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setIsEditingNode(false);
    }
  };

  const handleNodeClick = (node: EpisodeNode) => {
    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
      setIsEditingNode(false);
    } else {
      setSelectedNodeId(node.id);
      setIsEditingNode(false);
    }
  };

  const handleEditStart = (node: EpisodeNode) => {
    setEditNodeName(node.name ?? "");
    setEditNodeExplanation(node.one_line_explanation ?? "");
    setEditNodeContent(node.content ?? "");
    setIsEditingNode(true);
  };

  const handleEditSave = () => {
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

  const handleEditCancel = () => {
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Toaster position="top-center" />

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
            에피소드 생성
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        {/* 왼쪽 공간 확보 */}
        <div className="shrink-0" style={{ width: `${DISK_VISIBLE}px` }} />

        {/* 디스크: fixed로 레이아웃 분리 */}
        <div
          ref={diskRef}
          className="fixed"
          style={{
            top: "50%",
            left: 0,
            transform: `translate(calc(-${DISK_VISIBLE}px + ${dragX}px), -50%)`,
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
              if (!hasDragged.current) setIsDiskModalOpen(true);
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
                // 디스크 미선택 시: 빈 원형 placeholder
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <p className="text-sm text-gray-300">디스크 없음</p>
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-inner" />
            </div>
          </div>
        </div>

        {/* 가운데: 에피소드 정보 입력 + 노드 타임라인 */}
        <div
          className="flex flex-col min-w-0 pl-8 pr-2 ml-20"
          style={{ width: "840px", flexShrink: 0, overflow: "visible" }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* 에피소드 이름 / 설명 입력 */}
            <div className="pt-20 pb-6 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={episodeName}
                    onChange={(e) => setEpisodeName(e.target.value)}
                    placeholder="이름"
                    className="w-full text-5xl font-bold text-[#0F1C46] placeholder-gray-200 bg-transparent focus:outline-none tracking-tight mb-3"
                  />
                  <input
                    type="text"
                    value={episodeExplanation}
                    onChange={(e) => setEpisodeExplanation(e.target.value)}
                    placeholder="설명"
                    className="w-full pb-1 text-sm text-gray-400 placeholder-gray-300 transition-colors bg-transparent border-b border-transparent focus:outline-none focus:border-gray-200"
                  />
                </div>
                <button
                  onClick={handleAddNode}
                  className="mt-2 flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-[#0F1C46] hover:bg-gray-100 transition-colors shrink-0"
                  title="노드 추가"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 노드 타임라인 */}
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
                  <div key={node.id} className="relative flex gap-6">
                    <div className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => handleNodeClick(node)}
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
                          onClick={() => handleNodeClick(node)}
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
                              onClick={() => handleEditStart(node)}
                              className="flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              수정
                            </button>
                            <button
                              onClick={(e) => handleDeleteNode(node.id, e)}
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
                          {isEditingNode ? (
                            <div className="space-y-3 bg-[#ECF0F9] rounded-2xl p-5">
                              <div>
                                <label className="block mb-1 text-xs text-gray-400">
                                  노드 이름
                                </label>
                                <input
                                  type="text"
                                  value={editNodeName}
                                  onChange={(e) =>
                                    setEditNodeName(e.target.value)
                                  }
                                  placeholder="노드 이름"
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                                />
                              </div>
                              <div>
                                <label className="block mb-1 text-xs text-gray-400">
                                  한줄 설명
                                </label>
                                <input
                                  type="text"
                                  value={editNodeExplanation}
                                  onChange={(e) =>
                                    setEditNodeExplanation(e.target.value)
                                  }
                                  placeholder="한줄 설명"
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                                />
                              </div>
                              <div>
                                <label className="block mb-1 text-xs text-gray-400">
                                  내용
                                </label>
                                <textarea
                                  value={editNodeContent}
                                  onChange={(e) =>
                                    setEditNodeContent(e.target.value)
                                  }
                                  placeholder="내용"
                                  rows={5}
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleEditSave}
                                  className="flex items-center gap-1 px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9] transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  저장
                                </button>
                                <button
                                  onClick={handleEditCancel}
                                  className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
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
                              <button
                                onClick={() => handleEditStart(node)}
                                className="absolute top-4 right-4 flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                수정
                              </button>
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
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 저장 드롭 영역 */}
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
              생성
            </span>
          </div>
        </div>
      </main>

      {/* ── 디스크 선택 모달 (취소 없음 — 필수 선택) */}
      {isDiskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 w-[560px]"
            // 바깥 클릭으로 닫히지 않도록 stopPropagation 없이 배경 클릭 막음
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#0F1C46] mb-8 text-center">
              디스크를 골라주세요
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {disks.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDiskSelect(d.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                    selectedDiskId === d.id
                      ? "ring-2 ring-[#0AA1F2] bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="overflow-hidden rounded-full shadow-md w-28 h-28">
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

export default EpisodeCreatePage;
