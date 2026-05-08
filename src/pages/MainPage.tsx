import { useState, useMemo } from "react";
import Header from "../components/Header";
import ChatOverlay from "../components/MainPage/ChatOverlay";
import PersonaGrid from "../components/MainPage/PersonaGrid";

import { useAuthGuard } from "../hooks/MainPage/useAuthGuard";
import { usePersonas } from "../hooks/MainPage/usePersonas";
import { usePersonaInteraction } from "../hooks/MainPage/usePersonaInteraction";

function MainPage() {
  useAuthGuard();

  const { personas, loading } = usePersonas();
  const {
    activeChatPersona,
    setActiveChatPersona,
    handleClick,
    handleDoubleClick,
  } = usePersonaInteraction();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) return personas;
    return personas.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, personas]);

  return (
    <div className="min-h-screen bg-[#ECF0F9]">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="px-6 py-8 mx-auto max-w-7xl">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">불러오는 중...</p>
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
          personaId={activeChatPersona.id} 
          personaName={activeChatPersona.name}
          onClose={() => setActiveChatPersona(null)}
        />
      )}
    </div>
  );
}

export default MainPage;
