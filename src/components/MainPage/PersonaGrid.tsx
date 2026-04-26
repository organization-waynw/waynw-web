import PersonaCard from "./PersonaCard";
import AddPersonaCard from "./AddPersonaCard";

interface Persona {
  id: string;
  name: string;
  title: string;
  sub_info?: string;
  profile_img_path?: string;
}

interface Props {
  personas: Persona[];
  onClick: (p: Persona) => void;
  onDoubleClick: (id: string) => void;
}

function PersonaGrid({ personas, onClick, onDoubleClick }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AddPersonaCard />

      {personas.map((p) => (
        <PersonaCard
          key={p.id}
          persona={p}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        />
      ))}
    </div>
  );
}

export default PersonaGrid;
