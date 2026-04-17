import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface SubInfo {
  title: string;
  content: string;
}

export interface PersonaFormData {
  name: string;
  title: string;
  subInfos: SubInfo[];
  additionalInfo: string;
  autoGenerate: boolean;
  profileImage: File | null;
  profileImagePreview: string | null;
}

function PersonaCreateStep1() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PersonaFormData>({
    name: "",
    title: "",
    subInfos: [{ title: "", content: "" }],
    additionalInfo: "",
    autoGenerate: false,
    profileImage: null,
    profileImagePreview: null,
  });

  const handleAddSubInfo = () => {
    setFormData((prev) => ({
      ...prev,
      subInfos: [...prev.subInfos, { title: "", content: "" }],
    }));
  };

  const handleRemoveSubInfo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subInfos: prev.subInfos.filter((_, i) => i !== index),
    }));
  };

  const handleSubInfoChange = (
    index: number,
    field: keyof SubInfo,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      subInfos: prev.subInfos.map((info, i) =>
        i === index ? { ...info, [field]: value } : info
      ),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profileImagePreview: ev.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    // formData를 state/context/sessionStorage로 넘김
    sessionStorage.setItem("personaFormStep1", JSON.stringify({
      ...formData,
      profileImage: null, // File은 직렬화 불가, preview만 보존
    }));
    navigate("/persona/create/step2");
  };

  const isValid = formData.name.trim() && formData.title.trim();

  return (
    <div className="min-h-screen bg-[#ECF0F9]">
      {/* <Header searchQuery="" setSearchQuery={() => {}} /> */}

      <main className="max-w-5xl px-6 py-8 mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/main")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F1C46] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            돌아가기
          </button>
          <h1 className="mt-3 text-2xl font-bold text-[#0F1C46]">페르소나 생성</h1>
          <p className="mt-1 text-sm text-gray-500">새로운 AI 페르소나를 만들어보세요.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="flex flex-col items-center gap-3 lg:w-64">
            {/* 자동 생성 토글 */}
            <div className="flex items-center justify-between w-full px-4 py-3 bg-white shadow-sm rounded-xl">
              <span className="text-sm font-medium text-[#0F1C46]">자동생성</span>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    autoGenerate: !prev.autoGenerate,
                  }))
                }
                className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors focus:outline-none ${
                  formData.autoGenerate ? "bg-[#0F1C46]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    formData.autoGenerate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 프로필 이미지 업로드 */}
            <div
              onClick={() => !formData.autoGenerate && fileInputRef.current?.click()}
              className={`w-48 h-48 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 border-4 border-white shadow-md transition-all ${
                formData.autoGenerate
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-300"
              }`}
            >
              {formData.profileImagePreview ? (
                <img
                  src={formData.profileImagePreview}
                  alt="프로필 미리보기"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {formData.autoGenerate && (
                    <span className="px-2 text-xs text-center">자동 생성됩니다</span>
                  )}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {!formData.autoGenerate && (
              <p className="text-xs text-center text-gray-400">
                클릭하여 이미지를 업로드하세요
              </p>
            )}
          </div>

          {/* 오른쪽: 기본 정보 + 부가정보 */}
          <div className="flex flex-col flex-1 gap-4">
            {/* 이름, 호칭 */}
            <div className="flex flex-col gap-4 p-6 bg-white shadow-sm rounded-2xl">
              <h2 className="text-base font-bold text-[#0F1C46]">기본 정보</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 text-xs font-medium text-gray-500">이름 *</label>
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-xs font-medium text-gray-500">호칭 *</label>
                  <input
                    type="text"
                    placeholder="예: 선배님, 멘토님"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
                  />
                </div>
              </div>

              {/* 추가정보 (제목 + 내용 쌍) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">추가 정보</label>
                  <button
                    onClick={handleAddSubInfo}
                    className="text-xs text-[#0F1C46] hover:underline flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    항목 추가
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {formData.subInfos.map((info, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-28">
                        <input
                          type="text"
                          placeholder="제목"
                          value={info.title}
                          onChange={(e) =>
                            handleSubInfoChange(index, "title", e.target.value)
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="내용"
                          value={info.content}
                          onChange={(e) =>
                            handleSubInfoChange(index, "content", e.target.value)
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
                        />
                      </div>
                      {formData.subInfos.length > 1 && (
                        <button
                          onClick={() => handleRemoveSubInfo(index)}
                          className="flex-shrink-0 mt-2 text-gray-400 transition-colors hover:text-red-400"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 부가 정보 (자유 textarea) */}
            <div className="flex flex-col flex-1 gap-3 p-6 bg-white shadow-sm rounded-2xl">
              <h2 className="text-base font-bold text-[#0F1C46]">부가 정보</h2>
              <textarea
                placeholder="이 페르소나에 대한 자세한 설명을 입력하세요. (성격, 말투, 배경 등)"
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    additionalInfo: e.target.value,
                  }))
                }
                rows={8}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors resize-none"
              />
            </div>

            {/* 등록 버튼 */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleNext}
                disabled={!isValid}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isValid
                    ? "bg-[#0F1C46] text-white hover:bg-[#1a2d6b]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음 단계 →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonaCreateStep1;