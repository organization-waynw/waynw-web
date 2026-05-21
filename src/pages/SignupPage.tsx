import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupPage/SignupForm";

function SignupPage() {
  return (
    <AuthLayout title={`회원가입하고\n대화를 연습해보세요.`} subtitle={""}>
      <SignupForm />
    </AuthLayout>
  );
}

export default SignupPage;
