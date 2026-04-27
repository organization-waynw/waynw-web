import { supabase } from "../db/supabase";
import { Persona } from "../types/Persona/Persona";

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
