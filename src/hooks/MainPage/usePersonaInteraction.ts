import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function usePersonaInteraction() {
  const navigate = useNavigate();
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeChatPersona, setActiveChatPersona] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleClick = (persona: { id: string; name: string }) => {
    if (clickTimeout.current) return;

    clickTimeout.current = setTimeout(() => {
      setActiveChatPersona(persona);
      clickTimeout.current = null;
    }, 200);
  };

  const handleDoubleClick = (id: string) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    navigate(`/persona/${id}`);
  };

  return {
    activeChatPersona,
    setActiveChatPersona,
    handleClick,
    handleDoubleClick,
  };
}
