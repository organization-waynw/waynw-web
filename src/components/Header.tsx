import { Search } from "lucide-react";
import { HeaderProps } from "../types/Header";
import Logo from "../assets/images/logo.svg";

function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-2xl font-bold text-[#0F1C46]">IMQA</h1>
          </div>

          {searchQuery !== undefined && setSearchQuery && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  placeholder="페르소나 이름으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#ECF0F9] border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0AA1F2] focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="w-10"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;
