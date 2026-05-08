import { useCallback, useRef } from "react";
import { generateId, Message } from "../../../types/Chat/Chat";
import { supabase } from "../../../db/supabase";
import { incrementMessageCount } from "../../../api/user";

export function useChatSend(params: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isStreaming: boolean;
  personaId: string;
  onOveruse: () => void; // 15 배수 도달 시 콜백
}) {
  const { wsRef, messages, setMessages, isStreaming, personaId, onOveruse } =
    params;
  const isSendingRef = useRef(false);

  const sendMessage = useCallback(
    async (input: string, resetInput: () => void, closeCommand: () => void) => {
      if (isSendingRef.current || isStreaming) return;
      const trimmed = input.trim();
      if (!trimmed) return;
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      isSendingRef.current = true;

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const next = [...prev, userMsg];
        ws.send(
          JSON.stringify({
            type: "chat",
            personaId,
            messages: next.map((m) => ({ role: m.role, text: m.text })),
          }),
        );
        return next;
      });

      resetInput();
      closeCommand();

      // message_count 증가 + 15 배수 체크
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (userId) {
          const newCount = await incrementMessageCount(userId);
          if (newCount % 15 === 0) {
            // 스트리밍 끝난 후에 모달 표시 (약간 딜레이)
            setTimeout(onOveruse, 500);
          }
        }
      } catch (e) {
        console.error("[message_count] 업데이트 실패:", e);
      }

      setTimeout(() => {
        isSendingRef.current = false;
      }, 0);
    },
    [isStreaming, personaId, onOveruse],
  );

  const abort = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "abort" }));
  }, []);

  return { sendMessage, abort };
}
