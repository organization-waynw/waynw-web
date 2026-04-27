// hooks/useChatSocket.ts
import { useEffect, useRef, useState } from "react";
import { Message, generateId } from "../../../types/Chat/chat";

export function useChatSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const streamingIdRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "stream_start") {
        const id = generateId();
        streamingIdRef.current = id;
        setIsStreaming(true);

        setMessages((prev) => [
          ...prev,
          { id, role: "assistant", text: "", timestamp: new Date() },
        ]);
      }

      if (data.type === "stream_chunk") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingIdRef.current
              ? { ...m, text: m.text + data.chunk }
              : m,
          ),
        );
      }

      if (data.type === "stream_end" || data.type === "aborted") {
        streamingIdRef.current = null;
        setIsStreaming(false);
      }
    };

    return () => ws.close();
  }, [url]);

  return {
    wsRef,
    messages,
    setMessages,
    isStreaming,
    streamingIdRef,
  };
}
