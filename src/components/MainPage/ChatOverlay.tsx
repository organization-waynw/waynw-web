import { useState, useEffect, useRef, useCallback } from "react";

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
    label: "/introduce",
    description: "자기소개를 부탁해요",
    value: "/introduce",
  },
  { label: "/help", description: "도움말을 보여줘요", value: "/help" },
  {
    label: "/role",
    description: "역할과 전문 분야를 알려줘요",
    value: "/role",
  },
  { label: "/advice", description: "조언을 구해요", value: "/advice" },
  {
    label: "/reset",
    description: "대화를 처음부터 다시 시작해요",
    value: "/reset",
  },
];

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

  const inputRef = useRef<HTMLInputElement>(null);
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

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 350);
  }, [onClose]);

  // Input change — show/filter command palette
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setInput(cmd.value);
    setCommandPalette(false);
    inputRef.current?.focus();
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Console output
    if (trimmed.startsWith("/")) {
      console.log(`[COMMAND] ${trimmed}`);
    } else {
      console.log(`[CHAT] ${trimmed}`);
    }

    setInput("");
    setCommandPalette(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 40,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Panel — slides up from bottom */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "0 20px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: 1,
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
          <span
            style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}
          >
            {personaName}님과의 대화
          </span>
          <div style={{ width: 40 }} />
        </div>

        {/* ── Messages area ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
                color: "#999",
              }}
            >
              <div style={{ fontSize: 32 }}>💬</div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>
                {personaName}님과 어떤 대화를 하고 있으신가요?
              </p>
              <p style={{ fontSize: 13, color: "#bbb" }}>
                / 를 입력하면 명령어를 볼 수 있어요
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const isCommand = msg.text.startsWith("/");
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start",
                  marginBottom: 8,
                  animation: "fadeSlideIn 0.2s ease",
                }}
              >
                <div
                  style={{
                    maxWidth: "72%",
                    background: isUser ? "#FEE500" : "#f0f0f0",
                    color: "#1a1a1a",
                    borderRadius: isUser
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    padding: "10px 14px",
                    fontSize: 14,
                    lineHeight: 1.55,
                    wordBreak: "break-word",
                  }}
                >
                  {isCommand ? (
                    <span
                      style={{
                        color: "#1a56db",
                        fontWeight: 700,
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                        fontSize: 13,
                      }}
                    >
                      {msg.text}
                    </span>
                  ) : (
                    msg.text
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#bbb",
                    marginTop: 4,
                    paddingLeft: isUser ? 0 : 4,
                    paddingRight: isUser ? 4 : 0,
                  }}
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
          <div
            style={{
              margin: "0 16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
              animation: "fadeSlideIn 0.15s ease",
            }}
          >
            {filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.label}
                onClick={() => applyCommand(cmd)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 16px",
                  cursor: "pointer",
                  background:
                    idx === selectedCommandIndex ? "#f0f4ff" : "transparent",
                  borderBottom:
                    idx < filteredCommands.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={() => setSelectedCommandIndex(idx)}
              >
                <span
                  style={{
                    color: "#1a56db",
                    fontWeight: 700,
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    fontSize: 13,
                    minWidth: 100,
                  }}
                >
                  {cmd.label}
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {cmd.description}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Input bar ── */}
        <div
          style={{
            padding: "10px 16px 20px",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f3f4f6",
              borderRadius: 24,
              padding: "8px 8px 8px 18px",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="메세지를 입력하세요..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 15,
                color: "#1a1a1a",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: input.trim() ? "#FEE500" : "#e5e7eb",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
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
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#838485",
              marginTop: 8,
            }}
          >
            ai는 실수를 할수 있으며 여기서 표시되는 방법은 조언, 참고용 입니다.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
