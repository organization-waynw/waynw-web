import { useNavigate } from "react-router-dom";
import { usePersonaForm } from "../hooks/PersonaCreateStep1/usePersonaForm";
import { ProfileImageUpload } from "../components/PersonaCreateStep1/ProfileImageUpload";
import { BasicInfoForm } from "../components/PersonaCreateStep1/BasicInfoForm";
import { AdditionalInfoForm } from "../components/PersonaCreateStep1/Additionalinfoform";
import { Step1ActionButtons } from "../components/PersonaCreateStep1/Step1actionbuttons";


function PersonaCreateStep1() {
  const navigate = useNavigate();
  const {
    formData,
    isValid,
    fileInputRef,
    handleAddSubInfo,
    handleRemoveSubInfo,
    handleSubInfoChange,
    handleImageChange,
    handleToggleAutoGenerate,
    handleFieldChange,
    handleNext,
  } = usePersonaForm();

  return (
    <div className="min-h-screen bg-[#ECF0F9]">
      <main className="max-w-5xl px-6 py-8 mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/main")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F1C46] transition-colors"
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
            돌아가기
          </button>
          <h1 className="mt-3 text-2xl font-bold text-[#0F1C46]">
            페르소나 생성
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            새로운 AI 페르소나를 만들어보세요.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 왼쪽: 프로필 이미지 */}
          <ProfileImageUpload
            autoGenerate={formData.autoGenerate}
            profileImagePreview={formData.profileImagePreview}
            fileInputRef={fileInputRef}
            onToggleAutoGenerate={handleToggleAutoGenerate}
            onImageChange={handleImageChange}
          />

          {/* 오른쪽: 기본 정보 + 부가정보 */}
          <div className="flex flex-col flex-1 gap-4">
            <BasicInfoForm
              name={formData.name}
              title={formData.title}
              subInfos={formData.subInfos}
              onNameChange={(v) => handleFieldChange("name", v)}
              onTitleChange={(v) => handleFieldChange("title", v)}
              onAddSubInfo={handleAddSubInfo}
              onRemoveSubInfo={handleRemoveSubInfo}
              onSubInfoChange={handleSubInfoChange}
            />

            <AdditionalInfoForm
              value={formData.additionalInfo}
              onChange={(v) => handleFieldChange("additionalInfo", v)}
            />

            <Step1ActionButtons isValid={isValid} onNext={handleNext} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonaCreateStep1;
