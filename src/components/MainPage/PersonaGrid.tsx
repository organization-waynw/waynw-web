// PersonaGrid.tsx
import PersonaCard from "./PersonaCard";
import AddPersonaCard from "./AddPersonaCard";
import { Persona } from "../../types/Persona/persona";

interface Props {
  personas: Persona[];
  onClick: (p: Persona) => void;
  onDoubleClick: (id: string) => void;
}

function PersonaGrid({ personas, onClick, onDoubleClick }: Props) {
  return (
    <div className="grid grid-cols-4 gap-8">
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
