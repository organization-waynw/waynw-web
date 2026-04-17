import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, X, Edit2, Check, Plus, Trash2, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast, { Toaster } from "react-hot-toast";
import { episodes, episodeNodes, disks, EpisodeNode } from "../data/episodes";
import {
  getDiskAnimationDelay,
  DISK_SPIN_DURATION,
} from "../utils/diskAnimation";

const DEFAULT_NODE_NAME = "새 노드";
const DEFAULT_NODE_EXPLANATION = "한줄 설명을 입력해주세요";

// ── 드래그 감지 임계값 (px): 이 값보다 많이 움직여야 드래그로 인식
//    클릭과 드래그를 구분하는 기준입니다. 값을 높이면 더 많이 움직여야 드래그 시작
const DRAG_THRESHOLD = 5;

const DISK_TEXT_COLORS = [
  "#C76BB5", // 핑크/보라
  "#8B4513", // 주황/갈색
  "#2E9DAA", // 파랑/청록
  "#B8860B", // 골드/브라운
  "#C8B400", // 노랑
  "#7B68EE", // 보라/라벤더
];

function EpisodeDetailpage() {
  const { episodeId, id } = useParams<{ episodeId: string; id: string }>();
  const navigate = useNavigate();

  const episode = episodes.find((e) => e.id === episodeId);

  const baseNodes = useMemo(
    () => episodeNodes.filter((n) => n.episode_id === episodeId),
    [episodeId],
  );

  const [nodes, setNodes] = useState<EpisodeNode[]>(baseNodes);
  const [isDirty, setIsDirty] = useState(false);

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editNodeName, setEditNodeName] = useState("");
  const [editNodeExplanation, setEditNodeExplanation] = useState("");
  const [editNodeContent, setEditNodeContent] = useState("");

  const [isEditingEpisode, setIsEditingEpisode] = useState(false);
  const [editEpisodeName, setEditEpisodeName] = useState(episode?.name ?? "");
  const [editEpisodeExplanation, setEditEpisodeExplanation] = useState(
    episode?.one_line_explanation ?? "",
  );
  const [displayName, setDisplayName] = useState(episode?.name ?? "");
  const [displayExplanation, setDisplayExplanation] = useState(
    episode?.one_line_explanation ?? "",
  );

  const [isDiskModalOpen, setIsDiskModalOpen] = useState(false);
  const [selectedDiskId, setSelectedDiskId] = useState(episode?.disk_id ?? "");
  const [isDiskHovered, setIsDiskHovered] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveSoundRef = useRef<HTMLAudioElement | null>(null);

  // ── 디스크 드래그 관련 state
  const [isDragging, setIsDragging] = useState(false); // 드래그 중 여부
  const [dragX, setDragX] = useState(0); // 디스크 수평 이동량 (px)
  const [isOverSaveZone, setIsOverSaveZone] = useState(false); // 저장 영역 위에 있는지
  const dragStartX = useRef<number>(0); // 드래그 시작 X 좌표
  const hasDragged = useRef(false); // DRAG_THRESHOLD 초과 여부
  const diskRef = useRef<HTMLDivElement>(null);
  const saveZoneRef = useRef<HTMLDivElement>(null);

  const justDropped = useRef(false);

  const handleDiskMouseEnter = () => {
    if (isDragging) return; // 드래그 중이면 호버 정보 모달 무시
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsDiskHovered(true);
  };

  const handleDiskMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setIsDiskHovered(false), 150);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useMemo(() => new Audio(), []);

  //esc 뒤로 가기 함수
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/persona/${id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, id]);

  useEffect(() => {
    return () => {
      audioRef.pause();
      audioRef.src = "";
    };
  }, [audioRef]);

  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);
  const [editedSubInfo, setEditedSubInfo] = useState(episode?.sub_info ?? "");

  const currentDisk = disks.find((d) => d.id === selectedDiskId);
  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  // - 디스크 드래그, 사운드 등록
  useEffect(() => {
    saveSoundRef.current = new Audio("/sounds/episode-submit.mp3");
  }, []);

  // ── 디스크 드래그: mousemove / mouseup을 window에 등록
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;

      // DRAG_THRESHOLD 초과 시 드래그로 확정
      if (!hasDragged.current && Math.abs(deltaX) > DRAG_THRESHOLD) {
        hasDragged.current = true;
      }
      if (!hasDragged.current) return;

      // 수평 이동량: 오른쪽으로만 드래그 (양수만 허용)
      const clampedX = Math.max(0, deltaX);
      setDragX(clampedX);

      // 저장 영역 위인지 판단
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

  // ── 저장 처리
  const handleSave = () => {
    saveSoundRef.current?.play();
    setIsDirty(false);
    toast.success("저장에 성공하였습니다", {
      style: {
        borderRadius: "12px",
        background: "#0F1C46",
        color: "#fff",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#0AA1F2",
        secondary: "#fff",
      },
    });
    //navigate(`/persona/${id}`);
  };

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">에피소드를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleEpisodeSave = () => {
    setDisplayName(editEpisodeName);
    setDisplayExplanation(editEpisodeExplanation);
    setIsEditingEpisode(false);
    setIsDirty(true);
  };

  const handleEpisodeEditStart = () => {
    setEditEpisodeName(displayName);
    setEditEpisodeExplanation(displayExplanation);
    setIsEditingEpisode(true);
  };

  const handleAddNode = () => {
    const newNode: EpisodeNode = {
      id: Date.now(),
      episode_id: episodeId ?? "",
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

  const handleDeleteNode = (nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setIsEditingNode(false);
    }
    setIsDirty(true);
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
    setIsDirty(true);
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

  const handleDiskClick = () => {
    if (hasDragged.current || justDropped.current) {
      justDropped.current = false; // 플래그 초기화
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

  const handleDiskChange = (diskId: string) => {
    setSelectedDiskId(diskId);
    setIsDiskModalOpen(false);
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

  const DISK_SIZE = 560;
  const DISK_VISIBLE = DISK_SIZE / 2;

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
            에피소드 상세
            {isDirty && <span className="text-[#0AA1F2]">(수정중)</span>}
          </h1>
          <div className="w-20" />
        </div>
      </header>
      <main className="relative flex flex-1 overflow-hidden">
        {/* 노래 정보 박스 */}
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

        {/* 왼쪽 디스크 공간 확보용 빈 div */}
        <div className="shrink-0" style={{ width: `${DISK_VISIBLE}px` }} />

        {/* 디스크 본체: fixed로 레이아웃에서 완전히 분리 → overflow 스택 영향 안 받음 */}
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
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-inner" />
            </div>
          </div>
        </div>

        {/* 가운데: 에피소드 정보 + 노드 타임라인 */}
        <div
          className="flex flex-col min-w-0 pl-8 pr-2 ml-20"
          style={{ width: "840px", flexShrink: 0, overflow: "visible" }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="pt-20 pb-6 shrink-0">
              {/* 에피소드 제목 영역 */}
              {isEditingEpisode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editEpisodeName}
                    onChange={(e) => setEditEpisodeName(e.target.value)}
                    className="w-full text-4xl font-bold text-[#0F1C46] border-b-2  focus:outline-none bg-transparent tracking-tight pb-1"
                  />
                  <input
                    type="text"
                    value={editEpisodeExplanation}
                    onChange={(e) => setEditEpisodeExplanation(e.target.value)}
                    className="w-full pb-1 text-1xl text-[#0F1C46] bg-transparent border-b border-gray-300 focus:outline-none"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleEpisodeSave}
                      className="flex items-center gap-1 px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9] transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      저장
                    </button>
                    <button
                      onClick={() => setIsEditingEpisode(false)}
                      className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 group">
                    <div>
                      <h2 className="text-5xl font-bold text-[#0F1C46] mb-3 tracking-tight">
                        {displayName}
                      </h2>
                      <p className="text-gray-400">{displayExplanation}</p>
                    </div>
                    {/* 수정 버튼: 제목 옆에 hover 시 표시 */}
                    <button
                      onClick={handleEpisodeEditStart}
                      className="mt-3 flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      수정
                    </button>
                  </div>
                  {/* 노드 추가 버튼 */}
                  <button
                    onClick={handleAddNode}
                    className="mt-2 flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-[#0F1C46] hover:bg-gray-100 transition-colors shrink-0"
                    title="노드 추가"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative pb-20">
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

        {/* 오른쪽: 부가정보 */}
        <div className="pt-20 pb-20 pl-0 pl-10 pr-8 overflow-y-auto shrink-0 w-96">
          <div className="bg-gray-100 rounded-2xl p-6 min-h-[480px]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">부가정보</p>
              {!isEditingSubInfo && (
                <button
                  onClick={() => setIsEditingSubInfo(true)}
                  className="flex items-center gap-1 text-[#0AA1F2] hover:text-[#0890D9] text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  수정
                </button>
              )}
            </div>

            {isEditingSubInfo ? (
              <div className="space-y-3">
                <textarea
                  value={editedSubInfo}
                  onChange={(e) => setEditedSubInfo(e.target.value)}
                  rows={12}
                  placeholder="마크다운 형식으로 입력하세요"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingSubInfo(false);
                      setIsDirty(true);
                    }}
                    className="flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm font-medium hover:bg-[#0890D9] transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditedSubInfo(episode.sub_info ?? "");
                      setIsEditingSubInfo(false);
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : editedSubInfo ? (
              <div className="prose-sm prose text-gray-600 max-w-none">
                <ReactMarkdown>{editedSubInfo}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                등록된 부가정보가 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* ── 저장 드롭 영역: 드래그 중일 때만 오른쪽에서 슬라이드인 */}
        <div
          ref={saveZoneRef}
          className="fixed top-0 right-0 z-30 flex items-center justify-center h-full transition-all duration-300 ease-out"
          style={{
            width: "120px",
            // 드래그 중에만 나타남
            transform: isDragging ? "translateX(0)" : "translateX(100%)",
            background: isOverSaveZone
              ? "linear-gradient(135deg, #0AA1F2, #0F1C46)" // 드롭 가능: 파란색
              : "rgba(200, 210, 230, 0.85)", // 대기: 회색
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex flex-col items-center gap-3 text-white select-none">
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
      </main>
      {/* 디스크 선택 모달 */}
      {isDiskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setIsDiskModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-8 w-[720px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#0F1C46]">
                이 에피소드를 생각하면 어떤 감정이 느껴지나요?
              </h3>
              <button
                onClick={() => setIsDiskModalOpen(false)}
                className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {disks.map((d, index) => (
                <button
                  key={d.id}
                  onClick={() => handleDiskChange(d.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
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
                  {d.emotion && d.emotion.length > 0 && (
                    <span
                      className="text-sm leading-snug text-center"
                      style={{
                        color:
                          DISK_TEXT_COLORS[index % DISK_TEXT_COLORS.length],
                      }}
                    >
                      {d.emotion.join(", ")}
                    </span>
                  )}
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
