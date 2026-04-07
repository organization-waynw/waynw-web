import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard as Edit2, X, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { personas } from "../data/personas";
import { episodes, disks, DiskName } from "../data/episodes";
import {
  getDiskAnimationDelay,
  DISK_SPIN_DURATION,
} from "../utils/diskAnimation";

function PersonaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const persona = personas.find((p) => p.id === id);

  // ── 프로필 (이름 / 호칭 / 이미지) 수정
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(persona?.name || "");
  const [editedTitle, setEditedTitle] = useState(persona?.title || "");
  const [editedProfileImg, setEditedProfileImg] = useState<string | null>(null);

  // ── 부가정보(sub_info) 수정
  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);
  const [editedSubInfo, setEditedSubInfo] = useState(persona?.sub_info || "");

  // ── 추가정보(extra_info) 수정
  const [isEditingExtraInfo, setIsEditingExtraInfo] = useState(false);
  const [editedExtraInfo, setEditedExtraInfo] = useState<string[]>(
    persona?.extra_info || [],
  );

  // ── 에피소드 필터
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiskColor, setSelectedDiskColor] = useState<DiskName | null>(
    null,
  );

  const personaEpisodes = useMemo(() => {
    return episodes.filter((ep) => ep.persona_id === id);
  }, [id]);

  //esc 뒤로가기 함수
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/main");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const filteredEpisodes = useMemo(() => {
    let filtered = personaEpisodes;
    if (searchQuery.trim()) {
      filtered = filtered.filter((ep) =>
        ep.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedDiskColor) {
      filtered = filtered.filter((ep) => {
        const disk = disks.find((d) => d.id === ep.disk_id);
        return disk?.name === selectedDiskColor;
      });
    }
    return filtered;
  }, [personaEpisodes, searchQuery, selectedDiskColor]);

  if (!persona) {
    return (
      <div className="min-h-screen bg-[#ECF0F9] flex items-center justify-center">
        <p className="text-gray-500">페르소나를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const activeDiskColors = Array.from(
    new Set(
      personaEpisodes
        .map((ep) => disks.find((d) => d.id === ep.disk_id)?.name)
        .filter((color): color is DiskName => color !== undefined),
    ),
  ).sort();

  const btnPrimary =
    "flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg font-medium hover:bg-[#0890D9] transition-colors text-sm";
  const btnSecondary =
    "flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors";
  const editBtn =
    "flex items-center text-[#0AA1F2] hover:text-[#0890D9] transition-colors text-sm";

  // 현재 표시할 프로필 이미지
  const displayImg = editedProfileImg ?? persona.profile_img_path ?? null;

  //에피소드 생성 패이지 이동 함수
  const handleGoCreateEpisode = () => {
    navigate(`/persona/${id}/episode/create`);
  };

  return (
    <div className="min-h-screen bg-[#ECF0F9]">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <button
            onClick={() => navigate("/main")}
            className="flex items-center text-[#0F1C46] hover:text-[#0AA1F2] transition-colors"
          >
            <ChevronLeft className="w-6 h-6 mr-2" />
            <span>돌아가기</span>
          </button>
          <h1 className="text-2xl font-bold text-[#0F1C46]">페르소나 상세</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="px-6 py-8 mx-auto space-y-6 max-w-7xl">
        {/* 상단 2열 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ── 왼쪽: 프로필 카드 */}
          <div className="p-8 bg-white shadow-sm rounded-2xl">
            {isEditingProfile ? (
              /* 수정 모드 */
              <div className="space-y-4">
                {/* 이미지 변경 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-32 h-32">
                    <div className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-4xl font-bold">
                          {editedName[0] || "?"}
                        </div>
                      )}
                    </div>
                    {/* 이미지 변경 버튼 */}
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#0AA1F2] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0890D9] transition-colors shadow">
                      <Edit2 className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) =>
                              setEditedProfileImg(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">
                    아이콘을 눌러 이미지 변경
                  </p>
                </div>

                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="이름"
                  className="w-full px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                />
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="호칭"
                  className="w-full px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                />
                <div className="flex gap-2">
                  <button
                    className={btnPrimary}
                    onClick={() => setIsEditingProfile(false)}
                  >
                    저장
                  </button>
                  <button
                    className={btnSecondary}
                    onClick={() => {
                      setEditedName(persona.name);
                      setEditedTitle(persona.title);
                      setEditedProfileImg(null);
                      setIsEditingProfile(false);
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              /* 표시 모드 */
              <>
                {/* 프로필 이미지 */}
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
                    {displayImg ? (
                      <img
                        src={displayImg}
                        alt={editedName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-4xl font-bold">
                        {editedName[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* 이름/호칭 가운데 + 수정 버튼 오른쪽 끝 */}
                <div className="flex items-center pb-6 mb-6 border-b">
                  <div className="flex-1" />
                  <p className="text-xl font-bold text-[#0F1C46]">
                    [{editedName}] [{editedTitle}]
                  </p>
                  <div className="flex justify-end flex-1">
                    <button
                      className="flex items-center text-[#0AA1F2] hover:text-[#0890D9] transition-colors text-sm"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      수정
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 추가정보 (extra_info) */}
            {!isEditingProfile && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#0F1C46]">
                    추가정보
                  </h3>
                  {!isEditingExtraInfo && (
                    <button
                      className={editBtn}
                      onClick={() => setIsEditingExtraInfo(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      수정
                    </button>
                  )}
                </div>

                {isEditingExtraInfo ? (
                  <div className="space-y-3">
                    {editedExtraInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={info}
                          onChange={(e) => {
                            const next = [...editedExtraInfo];
                            next[index] = e.target.value;
                            setEditedExtraInfo(next);
                          }}
                          className="flex-1 px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                          placeholder="정보 입력"
                        />
                        <button
                          onClick={() =>
                            setEditedExtraInfo(
                              editedExtraInfo.filter((_, i) => i !== index),
                            )
                          }
                          className="p-1 text-gray-400 transition-colors hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {editedExtraInfo.length < 5 && (
                      <button
                        onClick={() =>
                          setEditedExtraInfo([...editedExtraInfo, ""])
                        }
                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#0AA1F2] hover:text-[#0AA1F2] transition-colors text-sm"
                      >
                        + 정보 추가
                      </button>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        className={btnPrimary}
                        onClick={() => setIsEditingExtraInfo(false)}
                      >
                        저장
                      </button>
                      <button
                        className={btnSecondary}
                        onClick={() => {
                          setEditedExtraInfo(persona.extra_info || []);
                          setIsEditingExtraInfo(false);
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editedExtraInfo.length > 0 ? (
                      editedExtraInfo.map((info, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-700 p-2 bg-[#ECF0F9] rounded"
                        >
                          • {info}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        등록된 정보가 없습니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 오른쪽: 부가정보 */}
          <div className="p-8 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F1C46]">부가정보</h3>
              {!isEditingSubInfo && (
                <button
                  className={editBtn}
                  onClick={() => setIsEditingSubInfo(true)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  수정
                </button>
              )}
            </div>

            {isEditingSubInfo ? (
              <div className="space-y-3">
                <textarea
                  value={editedSubInfo}
                  onChange={(e) => setEditedSubInfo(e.target.value)}
                  rows={10}
                  placeholder="마크다운 형식으로 입력하세요"
                  className="w-full px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    className={btnPrimary}
                    onClick={() => setIsEditingSubInfo(false)}
                  >
                    저장
                  </button>
                  <button
                    className={btnSecondary}
                    onClick={() => {
                      setEditedSubInfo(persona.sub_info || "");
                      setIsEditingSubInfo(false);
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : editedSubInfo ? (
              <div className="prose-sm prose text-gray-700 max-w-none">
                <ReactMarkdown>{editedSubInfo}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                등록된 부가정보가 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* ── 하단: 에피소드 섹션 */}
        <div className="p-8 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F1C46] mb-6">에피소드</h3>
            <button
              onClick={handleGoCreateEpisode}
              className="p-2 transition-colors rounded-full hover:bg-gray-100"
              style={{ color: "#587CF0" }}
              aria-label="Create new room"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                에피소드 검색
              </label>
              <input
                type="text"
                placeholder="에피소드 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
              />
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                디스크 필터
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedDiskColor(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDiskColor === null
                      ? "bg-[#0AA1F2] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  전체
                </button>
                {activeDiskColors.map((color) => {
                  const diskData = disks.find((d) => d.name === color);
                  return (
                    <button
                      key={color}
                      onClick={() =>
                        setSelectedDiskColor(
                          selectedDiskColor === color ? null : color,
                        )
                      }
                      className={`relative w-10 h-10 rounded-full transition-all overflow-hidden ${
                        selectedDiskColor === color
                          ? "ring-2 ring-offset-2 ring-[#0AA1F2]"
                          : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300"
                      }`}
                      title={color}
                    >
                      {diskData?.img_url ? (
                        <img
                          src={diskData.img_url}
                          alt={color}
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {filteredEpisodes.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                검색 결과가 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {filteredEpisodes.map((episode) => {
                  const disk = disks.find((d) => d.id === episode.disk_id);
                  const formattedDate = episode.created_at
                    ? episode.created_at.slice(0, 10)
                    : "";
                  return (
                    <div
                      key={episode.id}
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() =>
                        navigate(`/persona/${id}/episode/${episode.id}`)
                      }
                    >
                      <div className="relative w-20 h-20">
                        <div
                          className="w-20 h-20 overflow-hidden rounded-full shadow-md"
                          style={{
                            animation: `diskSpin ${DISK_SPIN_DURATION}ms linear infinite`,
                            animationDelay: getDiskAnimationDelay(),
                          }}
                        >
                          {disk?.img_url ? (
                            <img
                              src={disk.img_url}
                              alt={disk.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300" />
                          )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-4 h-4 bg-white border border-gray-200 rounded-full shadow-inner" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-medium text-[#0F1C46] text-center line-clamp-2 group-hover:text-[#0AA1F2]">
                        {episode.name}
                      </p>
                      <p className="mt-1 text-xs text-center text-gray-500">
                        {formattedDate}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes diskSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PersonaDetailPage;
