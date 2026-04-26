/**
 * DetailDiskSelectModal
 * 에피소드 상세 페이지의 디스크 선택 모달
 */

import { X } from "lucide-react";
import { disks } from "../../data/EPISODES";
import { DISK_TEXT_COLORS } from "../../constants/episodedetail.constants";

interface DetailDiskSelectModalProps {
  isOpen: boolean;
  selectedDiskId: string;
  onSelect: (diskId: string) => void;
  onClose: () => void;
}

export function DetailDiskSelectModal({
  isOpen,
  selectedDiskId,
  onSelect,
  onClose,
}: DetailDiskSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 w-[720px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#0F1C46]">
            이 에피소드를 생각하면 어떤 감정이 느껴지나요?
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {disks.map((d, index) => (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedDiskId === d.id
                  ? "ring-2 ring-[#0AA1F2] bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="overflow-hidden rounded-full shadow-md w-28 h-28">
                <img
                  src={d.img_url}
                  alt={d.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {d.emotion && d.emotion.length > 0 && (
                <span
                  className="text-sm leading-snug text-center"
                  style={{
                    color: DISK_TEXT_COLORS[index % DISK_TEXT_COLORS.length],
                  }}
                >
                  {d.emotion.join(", ")}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
