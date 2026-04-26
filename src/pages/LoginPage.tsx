import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginPage/LoginForm";

function LoginPage() {
  return (
    <AuthLayout
      title={`지금 로그인하고\n최적의 모니터링 환경을\n경험하세요.`}
      subtitle={`Mobile Performance\nManagement Solution`}
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
