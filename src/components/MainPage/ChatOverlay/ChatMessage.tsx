import { Message, COMMAND_LABELS, formatTime } from "../../../types/Chat/chat";

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

interface ChatMessageProps {
  message: Message;
  isStreaming: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

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
