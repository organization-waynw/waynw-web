import { useNavigate } from "react-router-dom";

function AddPersonaCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/persona/create")}
      className="cursor-pointer group"
    >
      {/* 앨범 커버 영역 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-[#0F1C46] group-hover:scale-[1.02] group-active:scale-[0.98] transition-all flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#0F1C46] transition-colors">
          <div className="flex items-center justify-center w-12 h-12 border-2 border-current rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </div>
      </div>

      {/* 텍스트 */}
      <div className="px-1 mt-2">
        <p className="text-sm font-semibold text-gray-400 group-hover:text-[#0F1C46] transition-colors">
          페르소나 추가
        </p>
      </div>
    </div>
  );
}

export default AddPersonaCard;
