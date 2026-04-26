/**
 * EpisodeDetail 페이지의 모든 상수값 모음
 */

// ── 색상 설정
export const DISK_TEXT_COLORS = [
  "#C76BB5", // 핑크/보라
  "#8B4513", // 주황/갈색
  "#2E9DAA", // 파랑/청록
  "#B8860B", // 골드/브라운
  "#C8B400", // 노랑
  "#7B68EE", // 보라/라벤더
] as const;

// ── 디스크 설정
export const DISK_SIZE = 560;
export const DISK_VISIBLE = DISK_SIZE / 2;

// ── 드래그 감지 임계값 (px)
export const DRAG_THRESHOLD = 5;

// ── 기본값
export const DEFAULT_NODE_NAME = "새 노드";
export const DEFAULT_NODE_EXPLANATION = "한줄 설명을 입력해주세요";

// ── 호버 타임아웃
export const HOVER_TIMEOUT = 150; // ms

// ── 톤스트 스타일
export const TOAST_SUCCESS_STYLE = {
  borderRadius: "12px",
  background: "#0F1C46",
  color: "#fff",
  fontSize: "14px",
} as const;

export const TOAST_SUCCESS_ICON_THEME = {
  primary: "#0AA1F2",
  secondary: "#fff",
} as const;

// ── 성공 메시지
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: "저장에 성공하였습니다",
} as const;
