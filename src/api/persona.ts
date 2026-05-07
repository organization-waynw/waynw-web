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

// base64 → Storage 업로드 (유저가 직접 업로드한 이미지)
export async function uploadProfileImage(params: {
  base64: string; // "data:image/png;base64,..." 형태
  userId: string;
  personaId: string;
  personaName: string;
}): Promise<string> {
  const { base64, userId, personaId, personaName } = params;

  // data URL에서 순수 base64만 추출
  const base64Data = base64.split(",")[1];
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const filePath = `${userId}/${personaId}/${personaName}.png`;

  const { error } = await supabase.storage
    .from("persona_profile_img")
    .upload(filePath, bytes, { contentType: "image/png", upsert: true });

  if (error) throw error;
  return filePath;
}
