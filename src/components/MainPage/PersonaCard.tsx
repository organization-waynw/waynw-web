interface Persona {
  id: string;
  name: string;
  title: string;
  sub_info?: string;
  profile_img_path?: string;
}

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
  );
}

export default PersonaCard;
