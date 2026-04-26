import { useNavigate } from "react-router-dom";

interface Step1ActionButtonsProps {
  isValid: boolean | string;
  onNext: () => void;
}

export function Step1ActionButtons({
  isValid,
  onNext,
}: Step1ActionButtonsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-3">
      <button
        onClick={() => navigate("/main")}
        className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        취소
      </button>
      <button
        onClick={onNext}
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
  );
}
