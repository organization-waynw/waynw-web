import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, X, Edit2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { episodes, episodeNodes, disks, EpisodeNode } from "../data/episodes";
import {
  getDiskAnimationDelay,
  DISK_SPIN_DURATION,
} from "../utils/diskAnimation";

function EpisodeDetailPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();

  const episode = episodes.find((e) => e.id === episodeId);

  const nodes = useMemo(
    () => episodeNodes.filter((n) => n.episode_id === episodeId),
    [episodeId],
  );

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editNodeName, setEditNodeName] = useState("");
  const [editNodeExplanation, setEditNodeExplanation] = useState("");
  const [editNodeContent, setEditNodeContent] = useState("");

  const [isDiskModalOpen, setIsDiskModalOpen] = useState(false);
  const [selectedDiskId, setSelectedDiskId] = useState(episode?.disk_id ?? "");
  const [isDiskHovered, setIsDiskHovered] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDiskMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsDiskHovered(true);
  };
  const handleDiskMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setIsDiskHovered(false), 150);
  };

  // ── 오디오 재생
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useMemo(() => new Audio(), []);

  // 페이지 이탈 시 음악 정지
  useEffect(() => {
    return () => {
      audioRef.pause();
      audioRef.src = "";
    };
  }, [audioRef]);

  // 부가정보 수정
  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);
  const [editedSubInfo, setEditedSubInfo] = useState(episode?.sub_info ?? "");

  const currentDisk = disks.find((d) => d.id === selectedDiskId);

  // ── 핵심: animationDelay를 마운트 시 딱 한 번만 계산해서 고정
  // 리렌더링이 일어나도 이 값은 변하지 않으므로 animation이 리셋되지 않음
  const diskAnimationDelay = useMemo(() => getDiskAnimationDelay(), []);

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">에피소드를 찾을 수 없습니다.</p>
      </div>
    );
  }

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

  const handleEditSave = () => setIsEditingNode(false);

  // 디스크 클릭: music_url 있으면 재생/정지, 없으면 모달
  const handleDiskClick = () => {
    const musicUrl = (currentDisk as any)?.music_url as string | undefined;
    if (!musicUrl) return;
    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      // 디스크가 바뀌었으면 src 교체
      if (audioRef.src !== musicUrl) {
        audioRef.pause();
        audioRef.src = musicUrl;
        audioRef.currentTime = 0;
      }
      audioRef.play();
      setIsPlaying(true);
    }
  };

  // 디스크 변경 시 재생 중이면 즉시 새 곡으로 교체
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
    <div className="min-h-screen bg-white" style={{ overflowX: "hidden" }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
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
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-57px)]">
        {/* ── 노래 정보 박스 — 호버 시에만 표시, overflow hidden 밖 fixed */}
        {isDiskHovered && currentDisk?.disk_info?.music && (
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

        {/* ── 왼쪽: 디스크 */}
        <div
          className="relative flex items-start shrink-0"
          style={{ width: `${DISK_VISIBLE}px`, overflow: "hidden" }}
        >
          <div
            className="sticky shrink-0"
            style={{
              top: `calc(50vh - ${DISK_SIZE / 2}px - 28px)`,
              marginLeft: `-${DISK_VISIBLE}px`,
            }}
          >
            <div
              className="relative cursor-pointer"
              onClick={handleDiskClick}
              onContextMenu={(e) => {
                e.preventDefault();
                setIsDiskModalOpen(true);
              }}
              onMouseEnter={handleDiskMouseEnter}
              onMouseLeave={handleDiskMouseLeave}
            >
              {/* 회전하는 디스크 */}
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

              {/* 중앙 홀 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* ── 가운데: 에피소드 정보 + 노드 타임라인 */}
        <div
          className="min-w-0 pt-20 pb-20 pl-8 pr-2 ml-20"
          style={{ width: "840px", flexShrink: 0 }}
        >
          <h2 className="text-5xl font-bold text-[#0F1C46] mb-3 tracking-tight">
            {episode.name}
          </h2>
          <p className="mb-12 text-gray-400">{episode.one_line_explanation}</p>

          <div className="relative">
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
                    <button
                      onClick={() => handleNodeClick(node)}
                      className="w-full text-left"
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
                      <div className="mt-4">
                        {isEditingNode ? (
                          <div className="space-y-3 bg-[#ECF0F9] rounded-2xl p-5">
                            <input
                              type="text"
                              value={editNodeName}
                              onChange={(e) => setEditNodeName(e.target.value)}
                              placeholder="노드 이름"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                            />
                            <input
                              type="text"
                              value={editNodeExplanation}
                              onChange={(e) =>
                                setEditNodeExplanation(e.target.value)
                              }
                              placeholder="한줄 설명"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                            />
                            <textarea
                              value={editNodeContent}
                              onChange={(e) =>
                                setEditNodeContent(e.target.value)
                              }
                              placeholder="내용"
                              rows={5}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleEditSave}
                                className="flex items-center gap-1 px-4 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm hover:bg-[#0890D9] transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                저장
                              </button>
                              <button
                                onClick={() => setIsEditingNode(false)}
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
                              {node.content}
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

        {/* ── 오른쪽: 부가정보 */}
        <div className="pt-20 pb-20 pl-0 pr-8 shrink-0 w-96">
          <div className="bg-gray-100 rounded-2xl p-6 h-full min-h-[480px]">
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
                    onClick={() => setIsEditingSubInfo(false)}
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
      </main>

      {/* ── 디스크 선택 모달 */}
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
                <X className="w-5 h-5" />
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

export default EpisodeDetailPage;
