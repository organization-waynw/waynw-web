import { useEffect, useRef, useState } from "react";
import { generateId, Message } from "../../../types/Chat/Chat";

export function useChatSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const streamingIdRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket;
    let closed = false;

    const connect = () => {
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (closed) {
          ws.close();
          return;
        }
        console.log("[WS] connected", ws.readyState);
        setIsConnected(true);
      };

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

        if (data.type === "error") {
          console.error("[WS] server error:", data.message);
          streamingIdRef.current = null;
          setIsStreaming(false);
        }
      };

      ws.onclose = () => {
        if (closed) return;
        console.log("[WS] closed", ws.readyState);
        setIsConnected(false);
      };

      ws.onerror = (e) => {
        if (closed) return;
        console.error("[WS] error", e);
      };
    };

    connect();

    return () => {
      closed = true;
      ws?.close();
      wsRef.current = null;
    };
  }, [url]);

  return {
    wsRef,
    messages,
    setMessages,
    isStreaming,
    isConnected,
    streamingIdRef,
  };
}
