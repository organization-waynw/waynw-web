import { supabase } from "../db/supabase";
import { Disk } from "../types/Disk/Disk";
import { Episode } from "../types/Episodes/Episodes";

export async function getEpisodesByPersonaId(
  personaId: string,
): Promise<Episode[]> {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("persona_id", personaId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDisks(): Promise<Disk[]> {
  const { data, error } = await supabase.from("disks").select("*");
  if (error) throw error;
  return data ?? [];
}
