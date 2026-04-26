import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { personas } from "../../data/PERSONAS";
import { episodes, disks } from "../../data/EPISODES";
import { DiskName } from "../../types/Episodes/Rpisodes";

export function usePersonaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const persona = personas.find((p) => p.id === id);

  // ── 프로필 수정
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(persona?.name || "");
  const [editedTitle, setEditedTitle] = useState(persona?.title || "");
  const [editedProfileImg, setEditedProfileImg] = useState<string | null>(null);

  // ── 부가정보 수정
  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);
  const [editedSubInfo, setEditedSubInfo] = useState(persona?.sub_info || "");

  // ── 추가정보 수정
  const [isEditingExtraInfo, setIsEditingExtraInfo] = useState(false);
  const [editedExtraInfo, setEditedExtraInfo] = useState<string[]>(
    persona?.extra_info || [],
  );

  // ── 에피소드 필터
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiskColor, setSelectedDiskColor] = useState<DiskName | null>(
    null,
  );

  const personaEpisodes = useMemo(
    () => episodes.filter((ep) => ep.persona_id === id),
    [id],
  );

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

  const activeDiskColors = useMemo(
    () =>
      Array.from(
        new Set(
          personaEpisodes
            .map((ep) => disks.find((d) => d.id === ep.disk_id)?.name)
            .filter((color): color is DiskName => color !== undefined),
        ),
      ).sort(),
    [personaEpisodes],
  );

  const displayImg = editedProfileImg ?? persona?.profile_img_path ?? null;

  // ── Esc 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/main");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleProfileSave = () => setIsEditingProfile(false);

  const handleProfileCancel = () => {
    setEditedName(persona?.name || "");
    setEditedTitle(persona?.title || "");
    setEditedProfileImg(null);
    setIsEditingProfile(false);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditedProfileImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtraInfoChange = (index: number, value: string) => {
    const next = [...editedExtraInfo];
    next[index] = value;
    setEditedExtraInfo(next);
  };

  const handleExtraInfoRemove = (index: number) => {
    setEditedExtraInfo(editedExtraInfo.filter((_, i) => i !== index));
  };

  const handleExtraInfoAdd = () => {
    setEditedExtraInfo([...editedExtraInfo, ""]);
  };

  const handleExtraInfoCancel = () => {
    setEditedExtraInfo(persona?.extra_info || []);
    setIsEditingExtraInfo(false);
  };

  const handleSubInfoCancel = () => {
    setEditedSubInfo(persona?.sub_info || "");
    setIsEditingSubInfo(false);
  };

  const handleGoCreateEpisode = () => navigate(`/persona/${id}/episode/create`);

  const handleGoEpisodeDetail = (episodeId: string) =>
    navigate(`/persona/${id}/episode/${episodeId}`);

  return {
    id,
    persona,
    navigate,
    // 프로필
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
    // 부가정보
    isEditingSubInfo,
    setIsEditingSubInfo,
    editedSubInfo,
    setEditedSubInfo,
    handleSubInfoCancel,
    // 추가정보
    isEditingExtraInfo,
    setIsEditingExtraInfo,
    editedExtraInfo,
    handleExtraInfoChange,
    handleExtraInfoRemove,
    handleExtraInfoAdd,
    handleExtraInfoCancel,
    // 에피소드
    searchQuery,
    setSearchQuery,
    selectedDiskColor,
    setSelectedDiskColor,
    filteredEpisodes,
    activeDiskColors,
    handleGoCreateEpisode,
    handleGoEpisodeDetail,
  };
}
