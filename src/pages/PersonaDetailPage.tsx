import { EpisodeSection } from "../components/PersonaDetailPage/Episodesection";
import { PersonaDetailHeader } from "../components/PersonaDetailPage/Personadetailheader";
import { ProfileCard } from "../components/PersonaDetailPage/Profilecard";
import { SubInfoCard } from "../components/PersonaDetailPage/Subinfocard";
import { usePersonaDetail } from "../hooks/PersonaDetailPage/usepersonadetail";

function PersonaDetailPage() {
  const {
    persona,
    navigate,
    loading,

    // 프로필 + 추가정보 수정
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

    // 부가정보 수정
    isEditingSubInfo,
    setIsEditingSubInfo,

    editedSubInfo,
    setEditedSubInfo,

    handleSubInfoSave,
    handleSubInfoCancel,

    // 에피소드
    searchQuery,
    setSearchQuery,

    selectedDiskColor,
    setSelectedDiskColor,

    filteredEpisodes,
    activeDiskColors,

    handleGoCreateEpisode,
    handleGoEpisodeDetail,
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
        {/* 상단 2열 */}
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

        {/* 에피소드 섹션 */}
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

      <style>{`
        @keyframes diskSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default PersonaDetailPage;
