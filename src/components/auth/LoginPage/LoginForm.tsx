import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginField from "../LoginField";
import { signIn } from "../../../api/auth";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn({ email, password });
      navigate("/main");
    } catch (e: any) {
      setError(e.message ?? "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
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

      {error && <p className="text-sm text-center text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0AA1F2] text-white py-3 rounded-lg font-medium hover:bg-[#0890D9] disabled:opacity-50"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <div className="flex justify-center text-sm">
        <span className="text-gray-600">아직 계정이 없으신가요?</span>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="ml-2 text-[#0AA1F2] hover:underline"
        >
          회원가입
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
