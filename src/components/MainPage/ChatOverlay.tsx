import { useEffect, useRef, useState, useCallback } from "react";
import { Info } from "lucide-react";
import { ChatMessage } from "./ChatOverlay/ChatMessage";
import { CommandTextarea } from "./ChatOverlay/CommandTextarea";
import { OveruseModal } from "./ChatOverlay/OveruseModal";
import { useCommandInput } from "../../hooks/MainPage/ChatOverlay/useCommandInput";
import { useChatSocket } from "../../hooks/MainPage/ChatOverlay/useChatSocket";
import { useChatSend } from "../../hooks/MainPage/ChatOverlay/useChatSend";

interface ChatOverlayProps {
  personaId: string;
  personaName?: string;
  onClose: () => void;
}

export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

export default function ChatOverlay({
  personaId,
  personaName = "AI",
  onClose,
}: ChatOverlayProps) {
  // ── Hooks ─────────────────────────────────────────
  const { wsRef, messages, setMessages, isStreaming, streamingIdRef } =
    useChatSocket(WS_URL);

  const { sendMessage, abort } = useChatSend({
    wsRef,
    messages,
    setMessages,
    isStreaming,
    personaId,
  });

  const {
    input,
    setInput,
    commandPalette,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    handleChange,
    applyCommand,
    setCommandPalette,
  } = useCommandInput();

  // ── UI 상태 ───────────────────────────────────────

  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  // ── Mount / scroll / ESC ──────────────────────────

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // ── 이벤트 ────────────────────────────────────────

  const handleSend = () => {
    sendMessage(
      input,
      () => setInput(""),
      () => setCommandPalette(false),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (commandPalette && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredCommands.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) => (i - 1 + filteredCommands.length) % filteredCommands.length,
        );
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        applyCommand(filteredCommands[selectedIndex]);
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
      handleSend();
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/25 z-40 transition-opacity duration-[350ms] ease-out ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
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

        {/* Messages */}
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
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isStreaming={msg.id === streamingIdRef.current}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Command Palette */}
        {commandPalette && filteredCommands.length > 0 && (
          <div className="mx-4 bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] animate-fadeSlideInShort">
            {filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.label}
                onClick={() => applyCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center gap-2.5 p-[11px_16px] cursor-pointer transition-colors duration-100 ${
                  idx === selectedIndex ? "bg-[#f0f4ff]" : "bg-transparent"
                } ${idx < filteredCommands.length - 1 ? "border-b border-[#f3f4f6]" : ""}`}
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

        {/* Input bar */}
        <div className="p-[10px_16px_20px] bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-[#f3f4f6] rounded-[20px] px-[18px] py-[11px] pr-[8px]">
            <CommandTextarea
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              textareaRef={inputRef}
              placeholder="메세지를 입력하세요..."
            />
            {isStreaming ? (
              <button
                onClick={abort}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 self-end bg-[#1a1a1a] cursor-pointer hover:bg-[#333] transition-colors duration-200"
                title="중단"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                  <rect x="2" y="2" width="8" height="8" rx="1" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSend}
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
            )}
          </div>
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

      {showModal && <OveruseModal onClose={() => setShowModal(false)} />}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn { animation: fadeSlideIn 0.2s ease forwards; }
        .animate-fadeSlideInShort { animation: fadeSlideIn 0.15s ease forwards; }
        .chat-textarea::placeholder {
          line-height: 22px;
          vertical-align: middle;
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}
