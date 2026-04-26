import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { personas } from "../data/PERSONAS";
import Header from "../components/Header";
import ChatOverlay from "../components/MainPage/ChatOverlay";
import PersonaGrid from "../components/MainPage/PersonaGrid";

function MainPage() {
  const navigate = useNavigate();
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatPersona, setActiveChatPersona] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) return personas;
    return personas.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleClick = (persona: { id: string; name: string }) => {
    if (clickTimeout.current) return;

    clickTimeout.current = setTimeout(() => {
      setActiveChatPersona({ id: persona.id, name: persona.name });
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

  return (
    <div className="min-h-screen bg-[#ECF0F9]">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="px-6 py-8 mx-auto max-w-7xl">
        {filteredPersonas.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <PersonaGrid
            personas={filteredPersonas}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </main>

      {activeChatPersona && (
        <ChatOverlay
          personaName={activeChatPersona.name}
          onClose={() => setActiveChatPersona(null)}
        />
      )}
    </div>
  );
}

export default MainPage;
