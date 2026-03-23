import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/main');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0AA1F2] via-[#0F1C46] to-[#0F1C46] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#34DDD9] rounded-3xl transform rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[#0AA1F2] rounded-3xl transform -rotate-12"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            회원가입하고<br />
            최적의 모니터링 환경을<br />
            경험하세요.
          </h1>
          <p className="text-lg opacity-90">
            Mobile Performance<br />
            Management Solution
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#ECF0F9] px-6">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-2">
              <img src="/unnamed_3.png" alt="Logo" className="h-12 w-12 mr-2" />
              <h2 className="text-3xl font-bold text-[#0F1C46]">IMQA</h2>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="이름을 입력하세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="이메일을 입력하세요."
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

            <div>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0AA1F2] text-white py-3 rounded-lg font-medium hover:bg-[#0890D9] transition-colors"
            >
              회원가입
            </button>

            <div className="flex justify-center text-sm">
              <span className="text-gray-600">이미 계정이 있으신가요?</span>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="ml-2 text-[#0AA1F2] hover:underline"
              >
                로그인
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>슈푸션트는 전문 컨설턴트가 도와드립니다.</p>
            <p>support@imqa.io / Tel : 02-541-0080</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
