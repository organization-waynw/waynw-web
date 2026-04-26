import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginField from "../LoginField";

function SignupForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/main");
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

      <button
        type="submit"
        className="w-full bg-[#0AA1F2] text-white py-3 rounded-lg font-medium hover:bg-[#0890D9]"
      >
        회원가입
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
