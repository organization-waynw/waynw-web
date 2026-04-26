import { ChevronLeft } from "lucide-react";

interface PersonaDetailHeaderProps {
  onBack: () => void;
}

export function PersonaDetailHeader({ onBack }: PersonaDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="flex items-center text-[#0F1C46] hover:text-[#0AA1F2] transition-colors"
        >
          <ChevronLeft className="w-6 h-6 mr-2" />
          <span>돌아가기</span>
        </button>
        <h1 className="text-2xl font-bold text-[#0F1C46]">페르소나 상세</h1>
        <div className="w-20" />
      </div>
    </header>
  );
}
