import { supabase } from "../db/supabase";
import { Disk } from "../types/Disk/disk";
import { Episode, EpisodeNode } from "../types/Episodes/episodes";

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

export async function getEpisodeById(
  episodeId: string,
): Promise<Episode | null> {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("id", episodeId)
    .single();

  if (error) throw error;

  return data;
}

export async function getDisks(): Promise<Disk[]> {
  const { data, error } = await supabase.from("disks").select("*");

  if (error) throw error;

  return data ?? [];
}

interface CreateEpisodeParams {
  personaId: string;
  diskId: string;
  name: string;
  oneLineExplanation: string;
  subInfo?: string;
}

export async function createEpisode({
  personaId,
  diskId,
  name,
  oneLineExplanation,
  subInfo = "",
}: CreateEpisodeParams): Promise<Episode> {
  console.log(diskId, name, oneLineExplanation);
  const { data, error } = await supabase
    .from("episodes")
    .insert({
      persona_id: personaId,
      disk_id: diskId,
      name,
      one_line_explanation: oneLineExplanation,
      sub_info: subInfo,
    })
    .select()
    .single();

  if (error) {
    console.error("에피소드 생성 실패:", error);
    throw error;
  }

  return data;
}

interface UpdateEpisodeParams {
  episodeId: string;
  diskId: string;
  name: string;
  oneLineExplanation: string;
  subInfo?: string;
}

export async function updateEpisode({
  episodeId,
  diskId,
  name,
  oneLineExplanation,
  subInfo = "",
}: UpdateEpisodeParams): Promise<Episode> {
  const { data, error } = await supabase
    .from("episodes")
    .update({
      disk_id: diskId,
      name,
      one_line_explanation: oneLineExplanation,
      sub_info: subInfo,
    })
    .eq("id", episodeId)
    .select()
    .single();

  if (error) {
    console.error("에피소드 수정 실패:", error);
    throw error;
  }

  return data;
}

interface CreateEpisodeNodesParams {
  episodeId: string;
  nodes: {
    name: string;
    one_line_explanation: string;
    content: string;
  }[];
}

export async function createEpisodeNodes({
  episodeId,
  nodes,
}: CreateEpisodeNodesParams): Promise<void> {
  if (nodes.length === 0) return;

  const { error } = await supabase.from("episode_node").insert(
    nodes.map((node) => ({
      episode_id: episodeId,
      name: node.name,
      one_line_explanation: node.one_line_explanation,
      content: node.content,
    })),
  );

  if (error) {
    console.error("노드 저장 실패:", error);
    throw error;
  }
}

export async function getEpisodeNodes(
  episodeId: string,
): Promise<EpisodeNode[]> {
  const { data, error } = await supabase
    .from("episode_node")
    .select("*")
    .eq("episode_id", episodeId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

interface UpsertEpisodeNodesParams {
  episodeId: string;
  nodes: EpisodeNode[];
}

// 노드 전체를 덮어쓰는 방식 (삭제 후 재삽입)
export async function upsertEpisodeNodes({
  episodeId,
  nodes,
}: UpsertEpisodeNodesParams): Promise<void> {
  // 1. 기존 노드 전체 삭제
  const { error: deleteError } = await supabase
    .from("episode_node")
    .delete()
    .eq("episode_id", episodeId);

  if (deleteError) throw deleteError;

  // 2. 새 노드 삽입 (노드가 없으면 스킵)
  if (nodes.length === 0) return;

  const { error: insertError } = await supabase.from("episode_node").insert(
    nodes.map((node) => ({
      episode_id: episodeId,
      name: node.name,
      one_line_explanation: node.one_line_explanation,
      content: node.content,
    })),
  );

  if (insertError) throw insertError;
}

export async function deleteEpisode(episodeId: string): Promise<void> {
  // 1. 노드 먼저 삭제
  const { error: nodeError } = await supabase
    .from("episode_node")
    .delete()
    .eq("episode_id", episodeId);

  if (nodeError) {
    console.error("노드 삭제 실패:", nodeError);
    throw nodeError;
  }

  // 2. 에피소드 삭제
  const { error: episodeError } = await supabase
    .from("episodes")
    .delete()
    .eq("id", episodeId);

  if (episodeError) {
    console.error("에피소드 삭제 실패:", episodeError);
    throw episodeError;
  }
}
