import { SubInfo } from "../../types/Persona/personacreate1.types";

interface SubInfoListProps {
  subInfos: SubInfo[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof SubInfo, value: string) => void;
}

export function SubInfoList({
  subInfos,
  onAdd,
  onRemove,
  onChange,
}: SubInfoListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-500">추가 정보</label>
        <button
          onClick={onAdd}
          className="text-xs text-[#0F1C46] hover:underline flex items-center gap-1"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          항목 추가
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {subInfos.map((info, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0 w-28">
              <input
                type="text"
                placeholder="제목"
                value={info.title}
                onChange={(e) => onChange(index, "title", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="내용"
                value={info.content}
                onChange={(e) => onChange(index, "content", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
              />
            </div>
            {subInfos.length > 1 && (
              <button
                onClick={() => onRemove(index)}
                className="flex-shrink-0 mt-2 text-gray-400 transition-colors hover:text-red-400"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
