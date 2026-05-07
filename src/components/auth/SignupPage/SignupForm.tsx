import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginField from "../LoginField";
import { signUp } from "../../../api/auth";

function SignupForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await signUp({ name, email, password });
      navigate("/main");
    } catch (e: any) {
      setError(e.message ?? "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <LoginField
        type="text"
        placeholder="이름을 입력하세요."
        value={name}
        onChange={setName}
      />
      <LoginField
        type="email"
        placeholder="이메일을 입력하세요."
        value={email}
        onChange={setEmail}
      />
      <LoginField
        type="password"
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={setPassword}
      />
      <LoginField
        type="password"
        placeholder="비밀번호를 다시 입력하세요."
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      {error && <p className="text-sm text-center text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0AA1F2] text-white py-3 rounded-lg font-medium hover:bg-[#0890D9] disabled:opacity-50"
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>

      <div className="flex justify-center text-sm">
        <span className="text-gray-600">이미 계정이 있으신가요?</span>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="ml-2 text-[#0AA1F2] hover:underline"
        >
          로그인
        </button>
      </div>
    </form>
  );
}

export default SignupForm;
