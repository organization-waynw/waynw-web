import { Persona } from "../../types/Persona/persona";

interface Props {
  persona: Persona;
  onClick: (p: Persona) => void;
  onDoubleClick: (id: string) => void;
}

function PersonaCard({ persona, onClick, onDoubleClick }: Props) {
  return (
    <div
      onClick={() => onClick(persona)}
      onDoubleClick={() => onDoubleClick(persona.id)}
      className="cursor-pointer group"
    >
      {/* 앨범 커버 영역 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-sm group-hover:shadow-md transition-shadow group-hover:scale-[1.02] group-active:scale-[0.98] transition-transform">
        {persona.profile_img_path ? (
          <img
            src={persona.profile_img_path}
            alt={persona.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#D6DCF0] text-[#0F1C46] text-5xl font-bold">
            {persona.name[0]}
          </div>
        )}
      </div>

      {/* 이름/타이틀 */}
      <div className="px-1 mt-2">
        <p className="text-sm font-semibold text-[#0F1C46] truncate">
          {persona.name}
        </p>
        <p className="text-xs text-gray-500 truncate">{persona.title}</p>
      </div>
    </div>
  );
}

export default PersonaCard;
