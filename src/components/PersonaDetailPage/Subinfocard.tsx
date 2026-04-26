import { CreditCard as Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const btnPrimary =
  "flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg font-medium hover:bg-[#0890D9] transition-colors text-sm";
const btnSecondary =
  "flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors";

interface SubInfoCardProps {
  isEditing: boolean;
  editedSubInfo: string;
  onEditStart: () => void;
  onInfoChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function SubInfoCard({
  isEditing,
  editedSubInfo,
  onEditStart,
  onInfoChange,
  onSave,
  onCancel,
}: SubInfoCardProps) {
  return (
    <div className="p-8 bg-white shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#0F1C46]">부가정보</h3>
        {!isEditing && (
          <button
            className="flex items-center text-[#0AA1F2] hover:text-[#0890D9] transition-colors text-sm"
            onClick={onEditStart}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            수정
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedSubInfo}
            onChange={(e) => onInfoChange(e.target.value)}
            rows={10}
            placeholder="마크다운 형식으로 입력하세요"
            className="w-full px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
          />
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={onSave}>
              저장
            </button>
            <button className={btnSecondary} onClick={onCancel}>
              취소
            </button>
          </div>
        </div>
      ) : editedSubInfo ? (
        <div className="prose-sm prose text-gray-700 max-w-none">
          <ReactMarkdown>{editedSubInfo}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-gray-400">등록된 부가정보가 없습니다.</p>
      )}
    </div>
  );
}
