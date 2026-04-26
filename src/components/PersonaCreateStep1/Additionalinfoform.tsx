interface AdditionalInfoFormProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdditionalInfoForm({
  value,
  onChange,
}: AdditionalInfoFormProps) {
  return (
    <div className="flex flex-col flex-1 gap-3 p-6 bg-white shadow-sm rounded-2xl">
      <h2 className="text-base font-bold text-[#0F1C46]">부가 정보</h2>
      <textarea
        placeholder="이 페르소나에 대한 자세한 설명을 입력하세요. (성격, 말투, 배경 등)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors resize-none"
      />
    </div>
  );
}
