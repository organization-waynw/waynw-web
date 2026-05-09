import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import { ExtraInfo, Persona } from "../../types/Persona/persona";
import { Episode } from "../../types/Episodes/episodes";
import { Disk, DiskName } from "../../types/Disk/disk";
import {
  getPersonaDetail,
  updatePersonaExtraInfo,
  updatePersonaProfile,
  updatePersonaSubInfo,
} from "../../api/personaDetail";
import { getDisks, getEpisodesByPersonaId } from "../../api/episodes";
import { deletePersona } from "../../api/persona";

export function usePersonaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [persona, setPersona] = useState<Persona | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [disks, setDisks] = useState<Disk[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ── 수정 상태
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSubInfo, setIsEditingSubInfo] = useState(false);

  // ── 프로필
  const [editedName, setEditedName] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedProfileImg, setEditedProfileImg] = useState<string | null>(null);

  // ── 부가정보
  const [editedSubInfo, setEditedSubInfo] = useState("");

  // ── 추가정보
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
  }, [id, navigate]);

  // ESC 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/main");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  // 에피소드 필터링
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
  }, [episodes, searchQuery, selectedDiskColor, disks]);

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

  // Storage 이미지 URL
  const getProfileImgUrl = (path: string | null) => {
    if (!path) return null;

    const { data } = supabase.storage
      .from("persona_profile_img")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const displayImg =
    editedProfileImg ?? getProfileImgUrl(persona?.profile_img_path ?? null);

  // 이미지 변경
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      setEditedProfileImg(ev.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  // 추가정보 수정
  const handleExtraInfoChange = (
    index: number,
    field: keyof ExtraInfo,
    value: string,
  ) => {
    const next = [...editedExtraInfo];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    setEditedExtraInfo(next);
  };

  const handleExtraInfoRemove = (index: number) => {
    setEditedExtraInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtraInfoAdd = () => {
    setEditedExtraInfo((prev) => [
      ...prev,
      {
        title: "",
        content: "",
      },
    ]);
  };

  // 전체 저장
  const handleAllSave = async () => {
    if (!id || !userId || !persona) return;

    try {
      // 프로필 저장
      const newPath = await updatePersonaProfile({
        personaId: id,
        name: editedName,
        title: editedTitle,
        profileImgBase64: editedProfileImg,
        userId,
      });

      // 부가정보 저장
      await updatePersonaSubInfo({
        personaId: id,
        subInfo: editedSubInfo,
      });

      // 추가정보 저장
      await updatePersonaExtraInfo({
        personaId: id,
        extraInfo: editedExtraInfo,
      });

      // 로컬 상태 반영
      setPersona((prev) =>
        prev
          ? {
              ...prev,
              name: editedName,
              title: editedTitle,
              sub_info: editedSubInfo,
              extra_info: editedExtraInfo,
              ...(newPath
                ? {
                    profile_img_path: newPath,
                  }
                : {}),
            }
          : prev,
      );

      setEditedProfileImg(null);
      setIsEditingProfile(false);
    } catch (e) {
      console.error("전체 저장 실패:", e);
    }
  };

  // 전체 취소
  const handleAllCancel = () => {
    if (!persona) return;

    setEditedName(persona.name ?? "");
    setEditedTitle(persona.title ?? "");
    setEditedSubInfo(persona.sub_info ?? "");
    setEditedExtraInfo((persona.extra_info as ExtraInfo[]) ?? []);
    setEditedProfileImg(null);

    setIsEditingProfile(false);
  };

  //페르소나 삭제
  const handleDelete = async () => {
    if (!id || !persona || !userId) return;

    try {
      await deletePersona(id, userId); // userId 추가
      navigate("/main");
    } catch (e) {
      console.error("페르소나 삭제 실패:", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleGoCreateEpisode = () => {
    navigate(`/persona/${id}/episode/create`);
  };

  const handleGoEpisodeDetail = (episodeId: string) => {
    navigate(`/persona/${id}/episode/${episodeId}`);
  };

  //부가정보 수정
  const handleSubInfoSave = async () => {
    if (!id) return;

    try {
      await updatePersonaSubInfo({
        personaId: id,
        subInfo: editedSubInfo,
      });

      setPersona((prev) =>
        prev
          ? {
              ...prev,
              sub_info: editedSubInfo,
            }
          : prev,
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

  return {
    id,
    persona,
    loading,
    navigate,

    // 통합 수정
    isEditingProfile,
    setIsEditingProfile,
    isEditingSubInfo,
    setIsEditingSubInfo,

    // 프로필
    editedName,
    setEditedName,
    editedTitle,
    setEditedTitle,
    displayImg,
    handleProfileImageChange,

    // 부가정보
    editedSubInfo,
    setEditedSubInfo,

    // 추가정보
    editedExtraInfo,
    handleExtraInfoChange,
    handleExtraInfoRemove,
    handleExtraInfoAdd,

    // 저장 / 취소 / 삭제
    handleAllSave,
    handleAllCancel,
    handleDelete,
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
  };
}
