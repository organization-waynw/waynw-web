import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.svg";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/main");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0AA1F2] via-[#0F1C46] to-[#0F1C46] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#34DDD9] rounded-3xl transform rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[#0AA1F2] rounded-3xl transform -rotate-12"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="mb-6 text-4xl font-bold leading-tight">
            지금 로그인하고
            <br />
            최적의 모니터링 환경을
            <br />
            경험하세요.
          </h1>
          <p className="text-lg opacity-90">
            Mobile Performance
            <br />
            Management Solution
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#ECF0F9] px-6">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-2">
              <img src={Logo} alt="Logo" className="w-12 h-12 mr-2" />
              <h2 className="text-3xl font-bold text-[#0F1C46]">IMQA</h2>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="아이디를 입력하세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#0AA1F2] border-gray-300 rounded focus:ring-[#0AA1F2]"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-700"
              >
                아이디 저장
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0AA1F2] text-white py-3 rounded-lg font-medium hover:bg-[#0890D9] transition-colors"
            >
              로그인
            </button>

            <div className="flex justify-center space-x-4 text-sm">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-gray-600 hover:text-[#0AA1F2]"
              >
                회원가입하기
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                className="text-gray-600 hover:text-[#0AA1F2]"
              >
                비밀번호 찾기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
