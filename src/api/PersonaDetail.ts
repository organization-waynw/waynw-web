import { supabase } from "../db/supabase";
import { Persona, ExtraInfo } from "../types/Persona/persona";

function base64ToBytes(base64: string): Uint8Array {
  const base64Data = base64.split(",")[1];
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function uploadProfileImageInternal(params: {
  base64: string;
  userId: string;
  personaId: string;
  personaName: string;
}): Promise<string> {
  const { base64, userId, personaId, personaName } = params;

  const bytes = base64ToBytes(base64);
  const filePath = `${userId}/${personaId}/${personaName}.png`;

  const { error } = await supabase.storage
    .from("persona_profile_img")
    .upload(filePath, bytes, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw error;
  return filePath;
}

export async function getPersonas(userId?: string): Promise<Persona[]> {
  let query = supabase
    .from("personas")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}

export async function createPersona(params: {
  name: string;
  title: string;
  subInfo: string;
  extraInfo: ExtraInfo[];
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

export async function uploadProfileImage(params: {
  base64: string;
  userId: string;
  personaId: string;
  personaName: string;
}): Promise<string> {
  return uploadProfileImageInternal(params);
}

export async function getPersonaDetail(
  personaId: string,
): Promise<Persona | null> {
  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("id", personaId)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePersonaProfile(params: {
  personaId: string;
  name: string;
  title: string;
  profileImgBase64?: string | null;
  userId: string;
  personaName: string;
}): Promise<string | null> {
  const { personaId, name, title, profileImgBase64, userId, personaName } =
    params;

  let profileImgPath: string | null = null;

  if (profileImgBase64) {
    profileImgPath = await uploadProfileImageInternal({
      base64: profileImgBase64,
      userId,
      personaId,
      personaName,
    });
  }

  const updatePayload: Record<string, unknown> = { name, title };

  if (profileImgPath) {
    updatePayload.profile_img_path = profileImgPath;
  }

  const { error } = await supabase
    .from("personas")
    .update(updatePayload)
    .eq("id", personaId);

  if (error) throw error;

  return profileImgPath;
}

export async function updatePersonaSubInfo(params: {
  personaId: string;
  subInfo: string;
}): Promise<void> {
  const { error } = await supabase
    .from("personas")
    .update({ sub_info: params.subInfo })
    .eq("id", params.personaId);

  if (error) throw error;
}

export async function updatePersonaExtraInfo(params: {
  personaId: string;
  extraInfo: ExtraInfo[];
}): Promise<void> {
  const { error } = await supabase
    .from("personas")
    .update({ extra_info: params.extraInfo })
    .eq("id", params.personaId);

  if (error) throw error;
}
