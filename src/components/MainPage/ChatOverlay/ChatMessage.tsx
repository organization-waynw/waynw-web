import ReactMarkdown from "react-markdown";
import { Message, COMMAND_LABELS, formatTime } from "../../../types/Chat/Chat";

function renderMessageText(text: string) {
  const commandMatch = COMMAND_LABELS.find((cmd) => text.startsWith(cmd));
  if (commandMatch) {
    const rest = text.slice(commandMatch.length);
    return (
      <>
        <span className="text-[#1a56db] font-bold font-mono text-[13px]">
          {commandMatch}
        </span>
        {rest && (
          <div className="inline">
            <ReactMarkdown
              components={{ p: ({ children }) => <span>{children}</span> }}
            >
              {rest}
            </ReactMarkdown>
          </div>
        )}
      </>
    );
  }
  return (
    <div>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => (
            <p className="text-base font-bold">{children}</p>
          ),
          h2: ({ children }) => <p className="text-sm font-bold">{children}</p>,
          h3: ({ children }) => <p className="text-sm font-bold">{children}</p>,
          hr: () => <hr className="my-2 border-gray-300" />,
          ul: ({ children }) => (
            <ul className="pl-4 mb-1 list-disc">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="pl-4 mb-1 list-decimal">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-0.5">{children}</li>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 bg-black/10 rounded text-[12px] font-mono">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="pl-3 italic text-gray-600 border-l-2 border-gray-400">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
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
