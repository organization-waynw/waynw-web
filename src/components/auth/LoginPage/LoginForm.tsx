import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginField from "../LoginField";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/main");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <LoginField
        type="email"
        placeholder="아이디를 입력하세요."
        value={email}
        onChange={setEmail}
      />

      <LoginField
        type="password"
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={setPassword}
      />

      <button
        type="submit"
        className="w-full bg-[#0AA1F2] text-white py-3 rounded-lg font-medium hover:bg-[#0890D9]"
      >
        로그인
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
