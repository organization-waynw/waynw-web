interface CustomOptionCardProps {
  isSelected: boolean;
  isEditing: boolean;
  customText: string;
  customInputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onClick: (e: React.MouseEvent) => void;
}

export function CustomOptionCard({
  isSelected,
  isEditing,
  customText,
  customInputValue,
  onInputChange,
  onKeyDown,
  onBlur,
  onClick,
}: CustomOptionCardProps) {
  return (
    <div
      style={{
        width: 202,
        height: 288,
        background: isSelected ? "#e8ecf5" : "#f1f5f9",
        border: isSelected ? "2px dashed #0F1C46" : "2px dashed #94a3b8",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "16px 12px",
      }}
      onClick={onClick}
    >
      {isSelected && isEditing ? (
        <textarea
          autoFocus
          value={customInputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={"내용을 입력하세요\n(Enter로 저장)"}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: 16,
            fontWeight: 500,
            color: "#0F1C46",
            textAlign: "center",
            lineHeight: 1.5,
            cursor: "text",
          }}
        />
      ) : (
        <>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isSelected ? "#0F1C46" : "#94a3b8"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span
            style={{
              color: isSelected ? "#0F1C46" : "#64748b",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            기타
          </span>
          <span
            style={{
              color: isSelected ? "#3b4f8a" : "#94a3b8",
              fontSize: 15,
              textAlign: "center",
              padding: "0 12px",
              lineHeight: 1.4,
            }}
          >
            {isSelected && customText ? customText : "직접 입력"}
          </span>
          {isSelected && (
            <span style={{ color: "#94a3b8", fontSize: 11 }}>
              클릭하여 수정
            </span>
          )}
        </>
      )}
    </div>
  );
}
