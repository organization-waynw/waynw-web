interface EpisodeSubInfoProps {
  isEditing: boolean;
  editedSubInfo: string;
  onEditStart: () => void;
  onSubInfoChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EpisodeSubInfo({
  isEditing,
  editedSubInfo,
  onEditStart,
  onSubInfoChange,
  onSave,
  onCancel,
}: EpisodeSubInfoProps) {
  return (
    <div className="pt-20 pb-20 pl-10 pr-8 overflow-y-auto shrink-0 w-96">
      <div className="bg-gray-100 rounded-2xl p-6 min-h-[480px]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-500">부가정보</p>
          {!isEditing && (
            <button
              onClick={onEditStart}
              className="text-[#0AA1F2] hover:text-[#0890D9] text-xs"
            >
              수정
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedSubInfo}
              onChange={(e) => onSubInfoChange(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg text-sm"
              >
                저장
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 whitespace-pre-wrap">
            {editedSubInfo || "등록된 부가정보가 없습니다."}
          </p>
        )}
      </div>
    </div>
  );
}
