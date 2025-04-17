import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import LanguageToggle from "@/components/LanguageToggle";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppHeader() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState({ name: "محمد", avatar: "https://source.unsplash.com/random/100x100/?person" });
  
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 36 36" 
              className="text-indigo-600" 
              fill="currentColor"
            >
              <path d="M18 3.787l13.607 7.848v12.73L18 32.213 4.393 24.365V11.635L18 3.787zm0-3.787L0 12v12l18 10.392L36 24V12L18 0z" />
              <path d="M16.154 9.006c1.013.228 2.02.44 3.035.647 1.016.206 2.064.375 3.128.503.38.046.659.205.847.479.187.274.249.574.186.9-.065.326-.243.593-.534.8-.291.208-.62.272-.985.192-1.063-.205-2.127-.433-3.189-.685-.35-.083-.684-.04-1.003.128-.319.168-.524.42-.615.759-.111.405-.064.786.14 1.146.204.359.52.597.947.714.562.13 1.13.235 1.7.314.571.08 1.141.145 1.711.196.538.049.995.27 1.372.664.377.394.569.862.575 1.404.007.556-.178 1.042-.554 1.46-.376.417-.854.662-1.434.734l-1.941.244c-.672.085-1.346.143-2.022.175-.676.033-1.346.025-2.01-.023-.597-.043-1.082-.281-1.454-.715-.371-.433-.557-.946-.556-1.538 0-.571.191-1.063.573-1.476.382-.413.852-.651 1.41-.715 1.072-.124 2.134-.302 3.189-.535.306-.068.546-.225.719-.47.173-.245.209-.509.107-.79-.088-.26-.263-.452-.528-.58-.264-.125-.54-.16-.83-.102-1.1.22-2.204.413-3.312.577-.392.058-.721-.043-.987-.302-.267-.26-.384-.581-.351-.967.019-.325.147-.609.383-.85.236-.242.522-.38.858-.417.87-.095 1.737-.218 2.604-.37.866-.153 1.73-.32 2.59-.503.64-.133 1.167-.461 1.58-.982.413-.521.62-1.116.62-1.784 0-.668-.178-1.268-.54-1.8-.36-.533-.858-.915-1.493-1.144-.57-.2-1.172-.34-1.804-.418-.633-.078-1.26-.095-1.88-.05-.62.046-1.224.15-1.81.312-.587.161-1.133.391-1.64.687-.379.229-.65.541-.81.937-.16.395-.173.794-.038 1.197.129.39.381.71.756.96.375.25.795.323 1.26.218.375-.084.708-.256.997-.517.288-.261.49-.583.603-.967.11-.37.307-.665.595-.884.288-.219.614-.317.978-.295.341.023.659.148.953.377.295.229.476.526.544.89.055.367.008.73-.143 1.087-.15.357-.396.66-.737.908-.418.309-.894.527-1.426.653z" />
            </svg>
            <span className="ml-2 rtl:mr-2 rtl:ml-0 text-xl font-bold text-gray-800">
              {t("سِرْبرايز مِي", "SURPRISE ME")}
            </span>
          </div>
        </Link>
        
        {/* Right side controls */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <LanguageToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t("البروفايل", "Profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("الإعدادات", "Settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/auth")}>
                {t("تسجيل الخروج", "Logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}