import { formatTime, Message } from "../../../../types/Chat/chat";
import renderMessageText from "./renderMessageText";

interface ChatMessageProps {
  message: Message;
  isStreaming: boolean;
}

export default function ChatMessage({
  message,
  isStreaming,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  if (!isUser && !message.text && isStreaming) {
    return (
      <div className="flex flex-col items-start mb-2">
        <div className="p-[10px_14px] bg-[#f0f0f0] rounded-[18px_18px_18px_4px]">
          <span className="inline-block w-[2px] h-[14px] bg-gray-500 animate-pulse align-middle" />
        </div>
      </div>
    );
  }

  // 텍스트도 없고 스트리밍도 아니면 렌더링 안 함
  if (!isUser && !message.text) return null;

  return (
    <div
      className={`flex flex-col mb-2 animate-fadeSlideIn ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[72%] p-[10px_14px] text-[14px] leading-[1.55] break-words ${
          isUser
            ? "bg-[#FEE500] text-[#1a1a1a] rounded-[18px_18px_4px_18px]"
            : "bg-[#f0f0f0] text-[#1a1a1a] rounded-[18px_18px_18px_4px]"
        }`}
      >
        {renderMessageText(message.text)}
        {isStreaming && (
          <span className="inline-block w-[2px] h-[14px] bg-gray-500 ml-0.5 animate-pulse align-middle" />
        )}
      </div>
      <span
        className={`text-[11px] text-[#bbb] mt-1 ${isUser ? "pr-1" : "pl-1"}`}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}
