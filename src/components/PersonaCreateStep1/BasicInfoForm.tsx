import { SubInfo } from "../../types/Persona/Personacreate1.types";
import { SubInfoList } from "./Subinfolist";

interface BasicInfoFormProps {
  name: string;
  title: string;
  subInfos: SubInfo[];
  onNameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onAddSubInfo: () => void;
  onRemoveSubInfo: (index: number) => void;
  onSubInfoChange: (index: number, field: keyof SubInfo, value: string) => void;
}

export function BasicInfoForm({
  name,
  title,
  subInfos,
  onNameChange,
  onTitleChange,
  onAddSubInfo,
  onRemoveSubInfo,
  onSubInfoChange,
}: BasicInfoFormProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white shadow-sm rounded-2xl">
      <h2 className="text-base font-bold text-[#0F1C46]">기본 정보</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-xs font-medium text-gray-500">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-xs font-medium text-gray-500">
            호칭 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 선배님, 멘토님"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F1C46] transition-colors"
          />
        </div>
      </div>
      <SubInfoList
        subInfos={subInfos}
        onAdd={onAddSubInfo}
        onRemove={onRemoveSubInfo}
        onChange={onSubInfoChange}
      />
    </div>
  );
}
