import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupPage/SignupForm";

function SignupPage() {
  return (
    <AuthLayout
      title={`회원가입하고\n최적의 모니터링 환경을\n경험하세요.`}
      subtitle={`Mobile Performance\nManagement Solution`}
    >
      <SignupForm />
    </AuthLayout>
  );
}

export default SignupPage;
