/**
 * SaveZone
 * 오른쪽에 나타나는 드래그 드롭 저장 영역
 */

import { Save } from "lucide-react";
import { forwardRef } from "react";

interface SaveZoneProps {
  isDragging: boolean;
  isOverSaveZone: boolean;
}

export const SaveZone = forwardRef<HTMLDivElement, SaveZoneProps>(
   ({ isDragging, isOverSaveZone }, ref) => {

    console.log(isOverSaveZone);
    return (
      <div
        ref={ref}
        className="fixed top-0 right-0 z-30 flex items-center justify-center h-full transition-all duration-300 ease-out"
        style={{
          width: "120px",
          transform: isDragging ? "translateX(0)" : "translateX(100%)",
          background: isOverSaveZone
            ? "linear-gradient(135deg, #0AA1F2, #0F1C46)"
            : "rgba(200, 210, 230, 0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex flex-col items-center gap-3 select-none">
          <Save
            className="w-8 h-8 transition-transform duration-200"
            style={{
              transform: isOverSaveZone ? "scale(1.2)" : "scale(1)",
              color: isOverSaveZone ? "#fff" : "#6b7280",
            }}
          />
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: isOverSaveZone ? "#fff" : "#6b7280" }}
          >
            생성
          </span>
        </div>
      </div>
    );
  }
)
