export interface SubInfo {
  title: string;
  content: string;
}

export interface PersonaFormData {
  name: string;
  title: string;
  subInfos: SubInfo[];
  additionalInfo: string;
  autoGenerate: boolean;
  profileImage: File | null;
  profileImagePreview: string | null;
}
