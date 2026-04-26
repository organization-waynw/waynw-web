// interface는 추후 types로 분리
export interface Episode {
  id: string;
  persona_id: string;
  name: string;
  one_line_explanation: string;
  sub_info?: string;
  disk_id: string;
  created_at: string;
}

export type DiskName =
  | "red"
  | "pink"
  | "gold"
  | "yellow"
  | "purple"
  | "turquoise";

export interface DiskInfo {
  music?: {
    title: string;
    artist: string;
    artist_channel?: string;
  };
  license?: {
    name: string;
    type: string;
  };
  links?: {
    download?: string;
    youtube?: string;
  };
  source?: string;
}

export interface EpisodeNode {
  id: number;
  name?: string;
  one_line_explanation?: string;
  content?: string;
  episode_id?: string;
  created_at: string;
}

export interface Disk {
  id: string;
  name: DiskName;
  img_url: string;
  disk_info: DiskInfo;
  emotion: string[];
  music_url: string; // 추가
  created_at: string;
}
