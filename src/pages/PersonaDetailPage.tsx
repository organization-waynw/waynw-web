import { useRef, useState } from "react";
import { EpisodeSection } from "../components/PersonaDetailPage/Episodesection";
import { PersonaDetailHeader } from "../components/PersonaDetailPage/Personadetailheader";
import { ProfileCard } from "../components/PersonaDetailPage/Profilecard";
import { SubInfoCard } from "../components/PersonaDetailPage/Subinfocard";
import { usePersonaDetail } from "../hooks/PersonaDetailPage/usepersonadetail";

function PersonaDetailPage() {
  const [deleteReady, setDeleteReady] = useState(false);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeleteClick = () => {
    if (deleteReady) {
      // 두 번째 클릭 → 실제 삭제
      handleDelete();
      setDeleteReady(false);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    } else {
      // 첫 번째 클릭 → 3초 대기
      setDeleteReady(true);
      deleteTimerRef.current = setTimeout(() => {
        setDeleteReady(false);
      }, 3000);
    }
  };

  const {
    persona,
    navigate,
    loading,

    isEditingProfile,
    setIsEditingProfile,

    editedName,
    setEditedName,
    editedTitle,
    setEditedTitle,
    displayImg,
    handleProfileImageChange,

    editedExtraInfo,
    handleExtraInfoChange,
    handleExtraInfoRemove,
    handleExtraInfoAdd,

    handleAllSave,
    handleAllCancel,

    isEditingSubInfo,
    setIsEditingSubInfo,
    editedSubInfo,
    setEditedSubInfo,
    handleSubInfoSave,
    handleSubInfoCancel,

    searchQuery,
    setSearchQuery,
    selectedDiskColor,
    setSelectedDiskColor,
    filteredEpisodes,
    activeDiskColors,
    handleGoCreateEpisode,
    handleGoEpisodeDetail,

    handleDelete, // ← 추가
  } = usePersonaDetail();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F9] flex items-center justify-center">
        <p className="text-gray-500">로딩중 입니다.</p>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-[#ECF0F9] flex items-center justify-center">
        <p className="text-gray-500">페르소나를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECF0F9]">
      <PersonaDetailHeader onBack={() => navigate("/main")} />

      <main className="px-6 py-8 mx-auto space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProfileCard
            isEditing={isEditingProfile}
            editedName={editedName}
            editedTitle={editedTitle}
            displayImg={displayImg}
            editedExtraInfo={editedExtraInfo}
            onEditStart={() => setIsEditingProfile(true)}
            onNameChange={setEditedName}
            onTitleChange={setEditedTitle}
            onImageChange={handleProfileImageChange}
            onSave={handleAllSave}
            onCancel={handleAllCancel}
            onExtraInfoChange={handleExtraInfoChange}
            onExtraInfoRemove={handleExtraInfoRemove}
            onExtraInfoAdd={handleExtraInfoAdd}
          />

          <SubInfoCard
            isEditing={isEditingSubInfo}
            editedSubInfo={editedSubInfo}
            onEditStart={() => setIsEditingSubInfo(true)}
            onInfoChange={setEditedSubInfo}
            onSave={handleSubInfoSave}
            onCancel={handleSubInfoCancel}
          />
        </div>

        <EpisodeSection
          searchQuery={searchQuery}
          selectedDiskColor={selectedDiskColor}
          activeDiskColors={activeDiskColors}
          filteredEpisodes={filteredEpisodes}
          onSearchChange={setSearchQuery}
          onDiskColorSelect={setSelectedDiskColor}
          onEpisodeClick={handleGoEpisodeDetail}
          onCreateEpisode={handleGoCreateEpisode}
        />
      </main>

      {/* 삭제 버튼 — 우측 하단 고정 */}
      <button
        onClick={handleDeleteClick}
        className={`
          fixed bottom-6 right-6 text-white font-semibold px-6 py-3 rounded-full shadow-lg
          transition-all duration-300 ease-in-out
          ${
            deleteReady
              ? "bg-red-600 scale-110 ring-4 ring-red-300"
              : "bg-red-500 hover:bg-red-600 scale-100"
          }
        `}
      >
        {deleteReady ? "한 번 더 누르면 삭제" : "삭제"}
      </button>

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
