import { RefObject } from "react";

interface ProfileImageUploadProps {
  autoGenerate: boolean;
  profileImagePreview: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  onToggleAutoGenerate: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileImageUpload({
  autoGenerate,
  profileImagePreview,
  fileInputRef,
  onToggleAutoGenerate,
  onImageChange,
}: ProfileImageUploadProps) {
  return (
    <div className="flex flex-col items-center gap-3 lg:w-64">
      {/* 자동 생성 토글 */}
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white shadow-sm rounded-xl">
        <span className="text-sm font-medium text-[#0F1C46]">자동생성</span>
        <button
          onClick={onToggleAutoGenerate}
          className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors focus:outline-none ${
            autoGenerate ? "bg-[#0F1C46]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${
              autoGenerate ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* 프로필 이미지 업로드 */}
      <div
        onClick={() => !autoGenerate && fileInputRef.current?.click()}
        className={`w-48 h-48 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 border-4 border-white shadow-md transition-all ${
          autoGenerate
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-300"
        }`}
      >
        {profileImagePreview ? (
          <img
            src={profileImagePreview}
            alt="프로필 미리보기"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {autoGenerate && (
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
        onChange={onImageChange}
      />
      {!autoGenerate && (
        <p className="text-xs text-center text-gray-400">
          클릭하여 이미지를 업로드하세요
        </p>
      )}
    </div>
  );
}