/**
 * EpisodeHeader
 * 페이지 헤더 (돌아가기, 제목)
 */

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EpisodeHeader() {
  const navigate = useNavigate();

  return (
    <header className="z-20 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center justify-between px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#0F1C46] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm">돌아가기</span>
        </button>
        <h1 className="text-base font-semibold text-[#0F1C46]">
          에피소드 생성
        </h1>
        <div className="w-20" />
      </div>
    </header>
  );
}