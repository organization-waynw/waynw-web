
export interface Episode {
  id: string;
  persona_id: string;
  disk_id: string | null;
  name: string | null;
  one_line_explanation: string | null;
  sub_info: string | null;
  created_at: string;
}

export interface EpisodeNode {
  id: number;
  name?: string;
  one_line_explanation?: string;
  content?: string;
  episode_id?: string;
  created_at: string;
}

