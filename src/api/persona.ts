import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../db/supabase";
import { Persona } from "../types/Persona/persona";

export async function createPersona(params: {
  name: string;
  title: string;
  subInfo: string; // AI 생성 1문장
  extraInfo: { title: string; content: string }[];
  profileImgPath: string | null;
  userId: string;
}): Promise<Persona> {
  const { data, error } = await supabase
    .from("personas")
    .insert({
      user_id: params.userId,
      name: params.name,
      title: params.title,
      sub_info: params.subInfo,
      extra_info: params.extraInfo,
      profile_img_path: params.profileImgPath,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePersona(id: string, userId: string): Promise<void> {
  // 1) 해당 페르소나의 에피소드 id 목록 조회
  const { data: episodeList, error: episodeFetchError } = await supabase
    .from("episodes")
    .select("id")
    .eq("persona_id", id);

  if (episodeFetchError) throw episodeFetchError;

  const episodeIds = (episodeList ?? []).map((e) => e.id);

  // 2) episode_node 삭제
  if (episodeIds.length > 0) {
    const { error: nodeError } = await supabase
      .from("episode_node")
      .delete()
      .in("episode_id", episodeIds);

    if (nodeError) throw nodeError;
  }

  // 3) episodes 삭제
  const { error: episodeError } = await supabase
    .from("episodes")
    .delete()
    .eq("persona_id", id);

  if (episodeError) throw episodeError;

  // 4) 스토리지 이미지 삭제 (userId/personaId/ 폴더 전체)
  const { data: fileList, error: listError } = await supabase.storage
    .from("persona_profile_img")
    .list(`${userId}/${id}`);

  if (!listError && fileList && fileList.length > 0) {
    const filePaths = fileList.map((f) => `${userId}/${id}/${f.name}`);
    await supabase.storage.from("persona_profile_img").remove(filePaths);
  }

  // 5) persona 삭제
  const { error: personaError } = await supabase
    .from("personas")
    .delete()
    .eq("id", id);

  if (personaError) throw personaError;
}

// base64 → Storage 업로드 (유저가 직접 업로드한 이미지)
export async function uploadProfileImage(params: {
  base64: string; // "data:image/png;base64,..." 형태
  userId: string;
  personaId: string;
}): Promise<string> {
  const { base64, userId, personaId } = params;

  // data URL에서 순수 base64만 추출
  const base64Data = base64.split(",")[1];
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const filePath = `private/${userId}/${personaId}/${crypto.randomUUID()}.png`;

  const { error } = await supabase.storage
    .from("persona_profile_img")
    .upload(filePath, bytes, { contentType: "image/png", upsert: true });

  if (error) throw error;
  return filePath;
}
