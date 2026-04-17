import { useState, useEffect, useRef, useCallback } from "react";
import { Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface Command {
  label: string;
  description: string;
  value: string;
}

interface ChatOverlayProps {
  personaName?: string;
  onClose: () => void;
}

// ─── Commands ─────────────────────────────────────────────────────────────────
const COMMANDS: Command[] = [
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

const COMMAND_LABELS = COMMANDS.map((c) => c.label);

// ─── Helper ───────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 메시지 텍스트에서 명령어 부분만 파란색 bold로 렌더링
 * 예: "/intention 오늘 친구한테..." → [blue"/intention"][" 오늘 친구한테..."]
 */
function renderMessageText(text: string) {
  const commandMatch = COMMAND_LABELS.find((cmd) => text.startsWith(cmd));
  if (commandMatch) {
    const rest = text.slice(commandMatch.length);
    return (
      <>
        <span className="text-[#1a56db] font-bold font-mono text-[13px]">
          {commandMatch}
        </span>
        {rest && <span>{rest}</span>}
      </>
    );
  }
  return <span>{text}</span>;
}

// ─── Overuse Warning Modal ────────────────────────────────────────────────────
function OveruseModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Backdrop — 클릭해도 닫히지 않음 */}
      <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-5">
        {/* Modal */}
        <div
          className="bg-white rounded-2xl max-w-[360px] w-full p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] animate-modalIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-[#fff7e0] flex items-center justify-center mx-auto mb-5">
            <span className="text-[22px]">💛</span>
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-bold text-[#1a1a1a] text-center leading-snug mb-3">
            AI에 너무 의존하고 있지는 않나요?
          </h2>

          {/* Body */}
          <p className="text-[13.5px] text-[#555] text-center leading-[1.7] mb-2">
            이 서비스는 인간관계를 <strong>돕는 도구</strong>예요.
            <br />
            하지만 대화하는 연습, 실수하면서 배우는 경험은
            <br />
            AI가 대신해 줄 수 없어요.
          </p>
          <p className="text-[13px] text-[#888] text-center leading-[1.65] mb-6">
            AI 조언에 지나치게 의존하면 스스로 관계를
            <br />
            만들어가는 힘이 약해질 수 있어요.
            <br />
            때로는 직접 부딪혀 보는 것이 가장 좋은 방법이에요.
          </p>

          {/* Divider */}
          <div className="h-px bg-[#f0f0f0] mb-5" />

          {/* Tips */}
          <div className="flex flex-col gap-2 mb-6">
            {[
              "💬 먼저 스스로 어떻게 말할지 생각해 보세요",
              "🤝 작은 것부터 직접 시도해 보세요",
              "📖 AI 조언은 참고용으로만 활용하세요",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-start gap-2 text-[12.5px] text-[#666] leading-[1.5]"
              >
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#1a1a1a] text-white text-[14px] font-semibold tracking-[-0.2px] hover:bg-[#333] transition-colors duration-150"
          >
            이해했어요
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalIn {
          animation: modalIn 0.22s cubic-bezier(0.32,0.72,0,1) forwards;
        }
      `}</style>
    </>
  );
}

// ─── Styled Textarea with command highlight ───────────────────────────────────
/**
 * textarea 위에 absolute overlay div를 두어 명령어 부분만 파란색 bold로 보여준다.
 * 실제 textarea는 color: transparent로 해서 커서/선택만 담당.
 * textarea는 내용에 따라 자동으로 높이가 늘어난다 (max 5줄).
 */
function CommandTextarea({
  value,
  onChange,
  onKeyDown,
  textareaRef,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  placeholder: string;
}) {
  const commandMatch = COMMAND_LABELS.find((cmd) => value.startsWith(cmd));
  const LINE_HEIGHT = 22; // px, textarea line-height
  const MAX_ROWS = 5;

  // 높이 자동 조정
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
      {/* Overlay (visual only) — mirrors textarea layout exactly */}
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
        {/* 줄바꿈이 생기면 위에서부터 정렬 */}
        <div
          className="w-full"
          style={{ alignSelf: value.includes("\n") ? "flex-start" : "center" }}
        >
          {renderOverlay()}
        </div>
      </div>

      {/* Real textarea — caret visible, text transparent */}
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
          // placeholder를 수직 중앙 정렬하기 위해 textarea 자체를 flex item으로
          display: "block",
          verticalAlign: "middle",
        }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatOverlay({
  personaName = "AI",
  onClose,
}: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [commandPalette, setCommandPalette] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(COMMANDS);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  // Mount animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasMessages) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasMessages]);

  // ESC: 모달이 열려 있으면 아무것도 안 함, 닫혀 있을 때만 chat 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showModal) return;
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showModal]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 350);
  }, [onClose]);

  // Input change — show/filter command palette
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    if (val.startsWith("/")) {
      const query = val.slice(1).toLowerCase();
      const filtered = COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query),
      );
      setFilteredCommands(filtered);
      setCommandPalette(true);
      setSelectedCommandIndex(0);
    } else {
      setCommandPalette(false);
    }
  };

  const applyCommand = (cmd: Command) => {
    // 명령어 뒤에 줄바꿈을 넣어 다음 줄로 커서 이동
    setInput(cmd.value + "\n");
    setCommandPalette(false);
    // 다음 tick에서 커서를 맨 끝으로
    setTimeout(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.selectionStart = el.selectionEnd = el.value.length;
    }, 0);
  };

  // Fix 1: sendMessage는 오직 버튼 onClick 또는 Enter keydown에서만 호출.
  // 중복 호출 방지를 위해 isSending ref 사용.
  const isSendingRef = useRef(false);

  const sendMessage = useCallback(() => {
    if (isSendingRef.current) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    isSendingRef.current = true;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    if (trimmed.startsWith("/")) {
      console.log(`[COMMAND] ${trimmed}`);
    } else {
      console.log(`[CHAT] ${trimmed}`);
    }

    setInput("");
    setCommandPalette(false);

    // 다음 tick에서 해제
    setTimeout(() => {
      isSendingRef.current = false;
    }, 0);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (commandPalette && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedCommandIndex((i) => (i + 1) % filteredCommands.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedCommandIndex(
          (i) => (i - 1 + filteredCommands.length) % filteredCommands.length,
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        applyCommand(filteredCommands[selectedCommandIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setCommandPalette(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/25 z-40 transition-opacity duration-[350ms] ease-out ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — slides up from bottom */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="bg-[#1a1a1a] text-white px-5 h-[56px] flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleClose}
            className="bg-none border-none text-white text-[18px] cursor-pointer p-1 py-2 leading-none font-inherit"
          >
            ✕
          </button>
          <span className="font-bold text-[15px] tracking-[-0.3px]">
            {personaName}님과의 대화
          </span>
          <div className="w-10" />
        </div>

        {/* ── Messages area ── */}
        <div className="flex flex-col flex-1 gap-1 px-4 pt-6 pb-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[#999]">
              <div className="text-[32px]">💬</div>
              <p className="text-[15px] font-medium">
                {personaName}님과 어떤 대화를 하고 있으신가요?
              </p>
              <p className="text-[13px] text-[#bbb]">
                / 를 입력하면 명령어를 볼 수 있어요
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col mb-2 animate-fadeSlideIn ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[72%] p-[10px_14px] text-[14px] leading-[1.55] break-words ${
                    isUser
                      ? "bg-[#FEE500] text-[#1a1a1a] rounded-[18px_18px_4px_18px]"
                      : "bg-[#f0f0f0] text-[#1a1a1a] rounded-[18px_18px_18px_4px]"
                  }`}
                >
                  {/* Fix 2: 명령어 부분만 파란색 */}
                  {renderMessageText(msg.text)}
                </div>
                <span
                  className={`text-[11px] text-[#bbb] mt-1 ${
                    isUser ? "pr-1" : "pl-1"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Command Palette ── */}
        {commandPalette && filteredCommands.length > 0 && (
          <div className="mx-4 bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] animate-fadeSlideInShort">
            {filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.label}
                onClick={() => applyCommand(cmd)}
                onMouseEnter={() => setSelectedCommandIndex(idx)}
                className={`flex items-center gap-2.5 p-[11px_16px] cursor-pointer transition-colors duration-100 ${
                  idx === selectedCommandIndex
                    ? "bg-[#f0f4ff]"
                    : "bg-transparent"
                } ${
                  idx < filteredCommands.length - 1
                    ? "border-b border-[#f3f4f6]"
                    : ""
                }`}
              >
                <span className="text-[#1a56db] font-bold font-mono text-[13px] min-w-[100px]">
                  {cmd.label}
                </span>
                <span className="text-[13px] text-[#6b7280]">
                  {cmd.description}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Input bar ── */}
        <div className="p-[10px_16px_20px] bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-[#f3f4f6] rounded-[20px] px-[18px] py-[11px] pr-[8px]">
            {/* textarea 기반 명령어 하이라이트 입력창 */}
            <CommandTextarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              textareaRef={inputRef}
              placeholder="메세지를 입력하세요..."
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 self-end transition-colors duration-200 ${
                input.trim()
                  ? "bg-[#FEE500] cursor-pointer"
                  : "bg-[#e5e7eb] cursor-default"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke={input.trim() ? "#1a1a1a" : "#9ca3af"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Fix 4: 안내 텍스트 + Info 아이콘 */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <p className="text-center text-[11px] text-[#838485]">
              ai는 실수를 할수 있으며 여기서 표시되는 방법은 조언, 참고용
              입니다.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center text-[#b0b1b2] hover:text-[#555] transition-colors duration-150 flex-shrink-0"
              aria-label="과도한 사용 경고 보기"
            >
              <Info size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Fix 4 & 5: Overuse Modal */}
      {showModal && <OveruseModal onClose={() => setShowModal(false)} />}

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.2s ease forwards;
        }
        .animate-fadeSlideInShort {
          animation: fadeSlideIn 0.15s ease forwards;
        }
        /* textarea placeholder 수직 중앙 정렬 */
        .chat-textarea::placeholder {
          line-height: 22px;
          vertical-align: middle;
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}
