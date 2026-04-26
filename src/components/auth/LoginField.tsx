interface LoginFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function LoginField({ type, placeholder, value, onChange }: LoginFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2]"
    />
  );
}

export default LoginField;
