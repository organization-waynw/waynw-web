import { Disk } from "../../types/Disk/disk";

interface EpisodeDiskModalProps {
  isOpen: boolean;
  disks: Disk[];
  selectedDiskId: string;
  onSelect: (diskId: string) => void;
  onClose: () => void;
}

export function EpisodeDiskModal({
  isOpen,
  disks,
  selectedDiskId,
  onSelect,
  onClose,
}: EpisodeDiskModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 w-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#0F1C46]">
            디스크를 골라주세요
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
          >
            X
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {disks.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                selectedDiskId === d.id
                  ? "ring-2 ring-[#0AA1F2] bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-24 h-24 overflow-hidden rounded-full shadow-md">
                <img
                  src={d.img_url}
                  alt={d.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
