import { EpisodeSection } from "../components/PersonaDetailPage/Episodesection";
import { PersonaDetailHeader } from "../components/PersonaDetailPage/Personadetailheader";
import { ProfileCard } from "../components/PersonaDetailPage/Profilecard";
import { SubInfoCard } from "../components/PersonaDetailPage/Subinfocard";
import { usePersonaDetail } from "../hooks/PersonaDetailPage/usepersonadetail";

function PersonaDetailPage() {
  const {
    persona,
    loading,
    navigate,
    isEditingProfile,
    setIsEditingProfile,
    editedName,
    setEditedName,
    editedTitle,
    setEditedTitle,
    displayImg,
    handleProfileSave,
    handleProfileCancel,
    handleProfileImageChange,
    isEditingSubInfo,
    setIsEditingSubInfo,
    editedSubInfo,
    setEditedSubInfo,
    handleSubInfoSave,
    handleSubInfoCancel,
    isEditingExtraInfo,
    setIsEditingExtraInfo,
    editedExtraInfo,
    handleExtraInfoChange,
    handleExtraInfoRemove,
    handleExtraInfoAdd,
    handleExtraInfoSave,
    handleExtraInfoCancel,
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
        <p className="text-gray-400">불러오는 중...</p>
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
            isEditingProfile={isEditingProfile}
            editedName={editedName}
            editedTitle={editedTitle}
            displayImg={displayImg}
            isEditingExtraInfo={isEditingExtraInfo}
            editedExtraInfo={editedExtraInfo}
            onEditProfileStart={() => setIsEditingProfile(true)}
            onNameChange={setEditedName}
            onTitleChange={setEditedTitle}
            onImageChange={handleProfileImageChange}
            onProfileSave={handleProfileSave}
            onProfileCancel={handleProfileCancel}
            onEditExtraInfoStart={() => setIsEditingExtraInfo(true)}
            onExtraInfoChange={handleExtraInfoChange}
            onExtraInfoRemove={handleExtraInfoRemove}
            onExtraInfoAdd={handleExtraInfoAdd}
            onExtraInfoSave={handleExtraInfoSave}
            onExtraInfoCancel={handleExtraInfoCancel}
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
