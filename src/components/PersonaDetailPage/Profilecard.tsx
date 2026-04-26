import { CreditCard as Edit2, X } from "lucide-react";

const btnPrimary =
  "flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg font-medium hover:bg-[#0890D9] transition-colors text-sm";
const btnSecondary =
  "flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors";
const editBtn =
  "flex items-center text-[#0AA1F2] hover:text-[#0890D9] transition-colors text-sm";

interface ProfileCardProps {
  isEditingProfile: boolean;
  editedName: string;
  editedTitle: string;
  displayImg: string | null;
  isEditingExtraInfo: boolean;
  editedExtraInfo: string[];
  onEditProfileStart: () => void;
  onNameChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileSave: () => void;
  onProfileCancel: () => void;
  onEditExtraInfoStart: () => void;
  onExtraInfoChange: (index: number, value: string) => void;
  onExtraInfoRemove: (index: number) => void;
  onExtraInfoAdd: () => void;
  onExtraInfoSave: () => void;
  onExtraInfoCancel: () => void;
}

export function ProfileCard({
  isEditingProfile,
  editedName,
  editedTitle,
  displayImg,
  isEditingExtraInfo,
  editedExtraInfo,
  onEditProfileStart,
  onNameChange,
  onTitleChange,
  onImageChange,
  onProfileSave,
  onProfileCancel,
  onEditExtraInfoStart,
  onExtraInfoChange,
  onExtraInfoRemove,
  onExtraInfoAdd,
  onExtraInfoSave,
  onExtraInfoCancel,
}: ProfileCardProps) {
  return (
    <div className="p-8 bg-white shadow-sm rounded-2xl">
      {isEditingProfile ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
                {displayImg ? (
                  <img
                    src={displayImg}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-4xl font-bold">
                    {editedName[0] || "?"}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#0AA1F2] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0890D9] transition-colors shadow">
                <Edit2 className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">아이콘을 눌러 이미지 변경</p>
          </div>
          <input
            type="text"
            value={editedName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="이름"
            className="w-full px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
          />
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="호칭"
            className="w-full px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
          />
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={onProfileSave}>
              저장
            </button>
            <button className={btnSecondary} onClick={onProfileCancel}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
              {displayImg ? (
                <img
                  src={displayImg}
                  alt={editedName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-4xl font-bold">
                  {editedName[0]}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center pb-6 mb-6 border-b">
            <div className="flex-1" />
            <p className="text-xl font-bold text-[#0F1C46]">
              [{editedName}] [{editedTitle}]
            </p>
            <div className="flex justify-end flex-1">
              <button className={editBtn} onClick={onEditProfileStart}>
                <Edit2 className="w-4 h-4 mr-1" />
                수정
              </button>
            </div>
          </div>

          {/* 추가정보 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#0F1C46]">추가정보</h3>
              {!isEditingExtraInfo && (
                <button className={editBtn} onClick={onEditExtraInfoStart}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  수정
                </button>
              )}
            </div>

            {isEditingExtraInfo ? (
              <div className="space-y-3">
                {editedExtraInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={info}
                      onChange={(e) => onExtraInfoChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                      placeholder="정보 입력"
                    />
                    <button
                      onClick={() => onExtraInfoRemove(index)}
                      className="p-1 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {editedExtraInfo.length < 5 && (
                  <button
                    onClick={onExtraInfoAdd}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#0AA1F2] hover:text-[#0AA1F2] transition-colors text-sm"
                  >
                    + 정보 추가
                  </button>
                )}
                <div className="flex gap-2 pt-2">
                  <button className={btnPrimary} onClick={onExtraInfoSave}>
                    저장
                  </button>
                  <button className={btnSecondary} onClick={onExtraInfoCancel}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {editedExtraInfo.length > 0 ? (
                  editedExtraInfo.map((info, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 p-2 bg-[#ECF0F9] rounded"
                    >
                      • {info}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    등록된 정보가 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
