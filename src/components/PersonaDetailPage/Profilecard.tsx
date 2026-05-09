import { CreditCard as Edit2 } from "lucide-react";
import { ExtraInfo } from "../../types/Persona/persona";

const btnPrimary =
  "flex-1 px-3 py-2 bg-[#0AA1F2] text-white rounded-lg font-medium hover:bg-[#0890D9] transition-colors text-sm";

const btnSecondary =
  "flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors";

const editBtn =
  "flex items-center text-[#0AA1F2] hover:text-[#0890D9] transition-colors text-sm";

// 키워드 타이틀 → 한국어 라벨 매핑
const KEYWORD_LABEL_MAP: Record<string, string> = {
  __mood__: "무드 & 색감",
  __expression__: "감정 & 인상",
  __item__: "상징 오브젝트",
  __vibe__: "아티스틱 바이브",
};

interface ProfileCardProps {
  isEditing: boolean;
  editedName: string;
  editedTitle: string;
  displayImg: string | null;
  editedExtraInfo: ExtraInfo[];
  onEditStart: () => void;
  onNameChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onExtraInfoChange: (
    index: number,
    field: keyof ExtraInfo,
    value: string,
  ) => void;
  onExtraInfoRemove: (index: number) => void;
  onExtraInfoAdd: () => void;
}

export function ProfileCard({
  isEditing,
  editedName,
  editedTitle,
  displayImg,
  editedExtraInfo,
  onEditStart,
  onNameChange,
  onTitleChange,
  onImageChange,
  onSave,
  onCancel,
  onExtraInfoChange,
  onExtraInfoRemove,
  onExtraInfoAdd,
}: ProfileCardProps) {
  // __prefix__ 키워드 항목 (읽기 전용)
  const keywordInfos = editedExtraInfo.filter((info) =>
    info.title.startsWith("__"),
  );

  // 일반 추가정보 항목 (수정 가능) — 실제 index는 editedExtraInfo 기준으로 유지
  const userInfoIndexes = editedExtraInfo
    .map((info, index) => ({ info, index }))
    .filter(({ info }) => !info.title.startsWith("__"));

  return (
    <div className="p-8 bg-white shadow-sm rounded-2xl">
      {/* ── 상단 프로필 영역 ── */}
      {isEditing ? (
        <div className="flex gap-8 mb-8">
          {/* 이미지 */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-48 h-48">
              <div className="w-48 h-48 overflow-hidden bg-gray-200 rounded-2xl">
                {displayImg ? (
                  <img
                    src={displayImg}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-5xl font-bold">
                    {editedName[0] || "?"}
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 w-10 h-10 bg-[#0AA1F2] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0890D9] transition-colors shadow">
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

          {/* 이름 / 호칭 */}
          <div className="flex flex-col justify-start flex-1 gap-3 pt-10">
            <input
              type="text"
              value={editedName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="이름"
              className="w-full px-3 py-3 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
            />
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="관계"
              className="w-full px-3 py-3 bg-[#ECF0F9] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-8 mb-8">
          <div className="w-48 h-48 overflow-hidden bg-gray-200 shrink-0 rounded-2xl">
            {displayImg ? (
              <img
                src={displayImg}
                alt={editedName}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#0F1C46] text-5xl font-bold">
                {editedName[0]}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-[#0F1C46]">
                  {editedName}
                </p>
                <p className="mt-1 text-lg text-[#0AA1F2] font-medium">
                  {editedTitle}
                </p>
              </div>
              <button className={editBtn} onClick={onEditStart}>
                <Edit2 className="w-4 h-4 mr-1" />
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 페르소나 키워드 (읽기 전용, 항상 표시) ── */}
      {keywordInfos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-[#0F1C46] mb-3">
            페르소나 키워드
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywordInfos.map((info) => {
              const firstKeyword = info.content.split(",")[0].trim();
              return (
                <span
                  key={info.title}
                  className="px-3 py-1.5 bg-[#F5F7FF] border border-[#D6E4FF] rounded-full text-sm text-[#0AA1F2] font-medium"
                >
                  {firstKeyword}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 추가정보 (수정 가능) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#0F1C46]">추가정보</h3>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {userInfoIndexes.map(({ info, index }) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-4 bg-[#ECF0F9] rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={info.title}
                    onChange={(e) =>
                      onExtraInfoChange(index, "title", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                    placeholder="제목"
                  />
                  <button
                    onClick={() => onExtraInfoRemove(index)}
                    className="p-1 text-gray-400 transition-colors hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  value={info.content}
                  onChange={(e) =>
                    onExtraInfoChange(index, "content", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
                  placeholder="내용"
                />
              </div>
            ))}

            {userInfoIndexes.length < 5 && (
              <button
                onClick={onExtraInfoAdd}
                className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#0AA1F2] hover:text-[#0AA1F2] transition-colors text-sm"
              >
                + 정보 추가
              </button>
            )}

            <div className="flex gap-2 pt-3">
              <button className={btnPrimary} onClick={onSave}>
                저장
              </button>
              <button className={btnSecondary} onClick={onCancel}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {userInfoIndexes.length > 0 ? (
              userInfoIndexes.map(({ info, index }) => (
                <div key={index} className="p-4 bg-[#ECF0F9] rounded-xl">
                  <p className="text-sm font-medium text-[#0F1C46]">
                    {info.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{info.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">등록된 정보가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
