export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface Command {
  label: string;
  description: string;
  value: string;
}



export const COMMANDS: Command[] = [
  {
    label: "/organize",
    description: "대화전 정리가 필요해요",
    value: "/organize",
  },
  {
    label: "/feedback",
    description: "대화후 피드백이 필요해요",
    value: "/feedback",
  },
  { label: "/intention", description: "조언을 구해요", value: "/intention" },
];

export const COMMAND_LABELS = COMMANDS.map((c) => c.label);

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
