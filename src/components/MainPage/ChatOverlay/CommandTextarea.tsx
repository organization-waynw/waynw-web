import { useEffect } from "react";
import { COMMAND_LABELS } from "../../../types/Chat/chat";

const LINE_HEIGHT = 22;
const MAX_ROWS = 5;

interface CommandTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  placeholder: string;
}

export function CommandTextarea({
  value,
  onChange,
  onKeyDown,
  textareaRef,
  placeholder,
}: CommandTextareaProps) {
  const commandMatch = COMMAND_LABELS.find((cmd) => value.startsWith(cmd));

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = LINE_HEIGHT * MAX_ROWS;
    el.style.height = Math.min(el.scrollHeight, maxH) + "px";
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
  }, [value, textareaRef]);

  const renderOverlay = () => {
    if (!value) return null;
    if (commandMatch) {
      const rest = value.slice(commandMatch.length);
      return (
        <>
          <span className="text-[#1a56db] font-bold">{commandMatch}</span>
          <span className="text-[#1a1a1a] whitespace-pre-wrap">{rest}</span>
        </>
      );
    }
    return <span className="text-[#1a1a1a] whitespace-pre-wrap">{value}</span>;
  };

  return (
    <div
      className="relative flex items-center flex-1"
      style={{ minWidth: 0, minHeight: LINE_HEIGHT }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 text-[15px] pointer-events-none whitespace-pre-wrap break-words overflow-hidden flex items-center"
        style={{
          fontFamily: "inherit",
          lineHeight: `${LINE_HEIGHT}px`,
          padding: 0,
          wordBreak: "break-word",
        }}
      >
        <div
          className="w-full"
          style={{ alignSelf: value.includes("\n") ? "flex-start" : "center" }}
        >
          {renderOverlay()}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={1}
        className="chat-textarea relative w-full bg-transparent border-none outline-none text-[15px] font-inherit resize-none block"
        style={{
          color: value ? "transparent" : undefined,
          caretColor: "#1a1a1a",
          lineHeight: `${LINE_HEIGHT}px`,
          overflowY: "hidden",
          padding: 0,
          display: "block",
          verticalAlign: "middle",
        }}
      />
    </div>
  );
}
