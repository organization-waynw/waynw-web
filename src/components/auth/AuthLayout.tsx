import Logo from "../../assets/images/logo.svg";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0AA1F2] via-[#0F1C46] to-[#0F1C46] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#34DDD9] rounded-3xl rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[#0AA1F2] rounded-3xl -rotate-12"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="mb-6 text-4xl font-bold leading-tight whitespace-pre-line">
            {title}
          </h1>
          <p className="text-lg whitespace-pre-line opacity-90">{subtitle}</p>
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

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
