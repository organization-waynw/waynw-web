import ReactMarkdown from "react-markdown";
import { COMMAND_LABELS } from "../../../../types/Chat/Chat";

export default function renderMessageText(text: string) {
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
