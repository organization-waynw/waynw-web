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

export interface Disk {
  id: string;
  name: DiskName;
  img_url: string;
  disk_info: DiskInfo;
  emotion: string[];
  music_url: string; // 추가
  created_at: string;
}
