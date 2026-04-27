export interface ExtraInfo {
  title: string;
  content: string;
}

export interface Persona {
  id: string;
  user_id: string;
  name: string;
  title: string;
  extra_info?: ExtraInfo[];
  sub_info?: string;
  profile_img_path?: string;
  created_at: string;
}
