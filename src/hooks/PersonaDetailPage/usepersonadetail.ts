import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import { ExtraInfo, Persona } from "../../types/Persona/Persona";
import { Episode } from "../../types/Episodes/Episodes";
import { Disk, DiskName } from "../../types/Disk/Disk";
import { getPersonaDetail, updatePersonaExtraInfo, updatePersonaProfile, updatePersonaSubInfo } from "../../api/PersonaDetail";
import { getDisks, getEpisodesByPersonaId } from "../../api/episodes";


export function usePersonaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [persona, setPersona] = useState<Persona | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [disks, setDisks] = useState<Disk[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ── 프로필 수정
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedProfileImg, setEditedProfileImg] = useState<string | null>(null); // base64

  // ── 부가정보 수정
  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);
  const [editedSubInfo, setEditedSubInfo] = useState("");

  // ── 추가정보 수정
  const [isEditingExtraInfo, setIsEditingExtraInfo] = useState(false);
  const [editedExtraInfo, setEditedExtraInfo] = useState<ExtraInfo[]>([]);

  // ── 에피소드 필터
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiskColor, setSelectedDiskColor] = useState<DiskName | null>(
    null,
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        navigate("/login");
        return;
      }
      setUserId(uid);

      const [personaData, episodeData, diskData] = await Promise.all([
        getPersonaDetail(id),
        getEpisodesByPersonaId(id),
        getDisks(),
      ]);

      if (!personaData) {
        navigate("/main");
        return;
      }

      setPersona(personaData);
      setEpisodes(episodeData);
      setDisks(diskData);

      // 편집 상태 초기화
      setEditedName(personaData.name ?? "");
      setEditedTitle(personaData.title ?? "");
      setEditedSubInfo(personaData.sub_info ?? "");
      setEditedExtraInfo((personaData.extra_info as ExtraInfo[]) ?? []);
      setLoading(false);
    };

    init().catch(console.error);
  }, [id]);

  // ── Esc 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/main");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // ── 에피소드 필터링
  const filteredEpisodes = useMemo(() => {
    let filtered = episodes;
    if (searchQuery.trim()) {
      filtered = filtered.filter((ep) =>
        ep.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedDiskColor) {
      filtered = filtered.filter((ep) => {
        const disk = disks.find((d) => d.id === ep.disk_id);
        return disk?.name === selectedDiskColor;
      });
    }
    return filtered;
  }, [episodes, searchQuery, selectedDiskColor]);

  const activeDiskColors = useMemo(
    () =>
      Array.from(
        new Set(
          episodes
            .map((ep) => disks.find((d) => d.id === ep.disk_id)?.name)
            .filter((name) => name !== undefined),
        ),
      ).sort(),
    [episodes, disks],
  );

  // Storage에서 이미지 public URL 가져오기
  const getProfileImgUrl = (path: string | null) => {
    if (!path) return null;
    const { data } = supabase.storage
      .from("persona_profile_img")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const displayImg =
    editedProfileImg ?? getProfileImgUrl(persona?.profile_img_path ?? null);

  // ── 프로필 저장
  const handleProfileSave = async () => {
    if (!id || !userId || !persona) return;
    try {
      const newPath = await updatePersonaProfile({
        personaId: id,
        name: editedName,
        title: editedTitle,
        profileImgBase64: editedProfileImg,
        userId,
        personaName: editedName,
      });
      setPersona((prev) =>
        prev
          ? {
              ...prev,
              name: editedName,
              title: editedTitle,
              ...(newPath ? { profile_img_path: newPath } : {}),
            }
          : prev,
      );
      setEditedProfileImg(null);
      setIsEditingProfile(false);
    } catch (e) {
      console.error("프로필 저장 실패:", e);
    }
  };

  const handleProfileCancel = () => {
    setEditedName(persona?.name ?? "");
    setEditedTitle(persona?.title ?? "");
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

  // ── 부가정보 저장
  const handleSubInfoSave = async () => {
    if (!id) return;
    try {
      await updatePersonaSubInfo({ personaId: id, subInfo: editedSubInfo });
      setPersona((prev) =>
        prev ? { ...prev, sub_info: editedSubInfo } : prev,
      );
      setIsEditingSubInfo(false);
    } catch (e) {
      console.error("부가정보 저장 실패:", e);
    }
  };

  const handleSubInfoCancel = () => {
    setEditedSubInfo(persona?.sub_info ?? "");
    setIsEditingSubInfo(false);
  };

  // ── 추가정보 저장
  const handleExtraInfoSave = async () => {
    if (!id) return;
    try {
      await updatePersonaExtraInfo({
        personaId: id,
        extraInfo: editedExtraInfo,
      });
      setPersona((prev) =>
        prev ? { ...prev, extra_info: editedExtraInfo } : prev,
      );
      setIsEditingExtraInfo(false);
    } catch (e) {
      console.error("추가정보 저장 실패:", e);
    }
  };

  const handleExtraInfoChange = (
    index: number,
    field: keyof ExtraInfo,
    value: string,
  ) => {
    const next = [...editedExtraInfo];
    next[index] = { ...next[index], [field]: value };
    setEditedExtraInfo(next);
  };

  const handleExtraInfoRemove = (index: number) => {
    setEditedExtraInfo(editedExtraInfo.filter((_, i) => i !== index));
  };

  const handleExtraInfoAdd = () => {
    setEditedExtraInfo([...editedExtraInfo, { title: "", content: "" }]);
  };

  const handleExtraInfoCancel = () => {
    setEditedExtraInfo((persona?.extra_info as ExtraInfo[]) ?? []);
    setIsEditingExtraInfo(false);
  };

  const handleGoCreateEpisode = () => navigate(`/persona/${id}/episode/create`);
  const handleGoEpisodeDetail = (episodeId: string) =>
    navigate(`/persona/${id}/episode/${episodeId}`);

  return {
    id,
    persona,
    loading,
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
    handleSubInfoSave,
    handleSubInfoCancel,
    // 추가정보
    isEditingExtraInfo,
    setIsEditingExtraInfo,
    editedExtraInfo,
    handleExtraInfoChange,
    handleExtraInfoRemove,
    handleExtraInfoAdd,
    handleExtraInfoSave,
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
