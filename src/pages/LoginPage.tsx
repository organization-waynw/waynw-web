import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginPage/LoginForm";

function LoginPage() {
  return (
    <AuthLayout title={`지금 로그인하고\n대화를 연습해보세요.`} subtitle={``}>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
