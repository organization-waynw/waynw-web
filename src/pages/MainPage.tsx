import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { personas } from "../data/personas";
import Header from "../components/Header";
import ChatOverlay from "../components/MainPage/ChatOverlay";

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
    }, 200); // 더블클릭 판별 시간
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPersonas.map((persona) => (
              <div
                key={persona.id}
                onClick={() => handleClick(persona)}
                onDoubleClick={() => handleDoubleClick(persona.id)}
                className="hover:scale-[1.02] active:scale-[0.98] overflow-hidden transition-shadow bg-white shadow-sm cursor-pointer rounded-2xl hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-200 rounded-full">
                      {persona.profile_img_path ? (
                        <img
                          src={persona.profile_img_path}
                          alt={persona.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-2xl font-bold">
                          {persona.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#0F1C46] truncate">
                        [{persona.name}] [{persona.title}]
                      </h3>
                      {persona.sub_info && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {persona.sub_info}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
