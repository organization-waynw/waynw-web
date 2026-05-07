import { forwardRef } from "react";
import { Trash2 } from "lucide-react";

interface EpisodeDeleteZoneProps {
  isDragging: boolean;
  isOverDeleteZone: boolean;
}

export const EpisodeDeleteZone = forwardRef<
  HTMLDivElement,
  EpisodeDeleteZoneProps
>(({ isDragging, isOverDeleteZone }, ref) => {
  return (
    <div
      ref={ref}
      className="fixed bottom-0 left-0 z-30 flex items-center justify-center w-full transition-all duration-300 ease-out"
      style={{
        height: "120px",
        transform: isDragging ? "translateY(0)" : "translateY(100%)",
        background: isOverDeleteZone
          ? "linear-gradient(135deg, #ef4444, #991b1b)"
          : "rgba(230, 200, 200, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex flex-col items-center gap-3 select-none">
        <Trash2
          className="w-8 h-8 transition-transform duration-200"
          style={{
            transform: isOverDeleteZone ? "scale(1.2)" : "scale(1)",
            color: isOverDeleteZone ? "#fff" : "#6b7280",
          }}
        />
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: isOverDeleteZone ? "#fff" : "#6b7280" }}
        >
          삭제
        </span>
      </div>
    </div>
  );
});
