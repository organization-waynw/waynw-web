import { supabase } from "../db/supabase";

export async function incrementMessageCount(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc("increment_message_count", {
    user_id_input: userId,
  });
  if (error) throw error;
  return data as number;
}
