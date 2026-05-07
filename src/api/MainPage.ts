import { supabase } from "../db/supabase";
import { Persona } from "../types/Persona/persona";

function toPublicUrl(path: string | null) {
  if (!path) return null;

  const { data } = supabase.storage
    .from("persona_profile_img")
    .getPublicUrl(path);

  return data.publicUrl;
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

  return (data ?? []).map((p) => ({
    ...p,
    // 여기서 path → url로 변환해서 덮어씀
    profile_img_path: toPublicUrl(p.profile_img_path),
  }));
}
