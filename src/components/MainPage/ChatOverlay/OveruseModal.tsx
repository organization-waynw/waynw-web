export function OveruseModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-5">
        <div
          className="bg-white rounded-2xl max-w-[360px] w-full p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] animate-modalIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-[#fff7e0] flex items-center justify-center mx-auto mb-5">
            <span className="text-[22px]">💛</span>
          </div>
          <h2 className="text-[17px] font-bold text-[#1a1a1a] text-center leading-snug mb-3">
            AI에 너무 의존하고 있지는 않나요?
          </h2>
          <p className="text-[13.5px] text-[#555] text-center leading-[1.7] mb-2">
            이 서비스는 인간관계를 <strong>돕는 도구</strong>예요.
            <br />
            하지만 대화하는 연습, 실수하면서 배우는 경험은
            <br />
            AI가 대신해 줄 수 없어요.
          </p>
          <p className="text-[13px] text-[#888] text-center leading-[1.65] mb-6">
            AI 조언에 지나치게 의존하면 스스로 관계를
            <br />
            만들어가는 힘이 약해질 수 있어요.
            <br />
            때로는 직접 부딪혀 보는 것이 가장 좋은 방법이에요.
          </p>
          <div className="h-px bg-[#f0f0f0] mb-5" />
          <div className="flex flex-col gap-2 mb-6">
            {[
              "💬 먼저 스스로 어떻게 말할지 생각해 보세요",
              "🤝 작은 것부터 직접 시도해 보세요",
              "📖 AI 조언은 참고용으로만 활용하세요",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-start gap-2 text-[12.5px] text-[#666] leading-[1.5]"
              >
                <span>{tip}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#1a1a1a] text-white text-[14px] font-semibold tracking-[-0.2px] hover:bg-[#333] transition-colors duration-150"
          >
            이해했어요
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalIn { animation: modalIn 0.22s cubic-bezier(0.32,0.72,0,1) forwards; }
      `}</style>
    </>
  );
}
