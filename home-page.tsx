import { useState, useEffect } from "react";
import Registration from "@/pages/Registration";
import Dashboard from "@/pages/Dashboard";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function HomePage() {
  const { t, language, dir, fontClass } = useLanguage();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Check if user is already registered on component mount
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/user/profile", undefined);
        const userData = await response.json();
        if (userData && userData.id) {
          setIsRegistered(true);
          setUserProfile(userData);
        }
      } catch (error) {
        // User not registered, show registration flow
        setIsRegistered(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);

  // Handle registration completion
  const handleRegistrationComplete = () => {
    setIsRegistered(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      setIsRegistered(false);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={`min-h-screen page-background flex items-center justify-center p-4 md:p-8 ${fontClass}`} dir={dir}>
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl overflow-hidden relative">
        {/* App Header */}
        <header className="p-4 md:p-6 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="font-bold text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
              {t("هدايا - مفاجآت", "GIFT IT")}
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
              {t("جديد!", "NEW!")}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <LanguageToggle />
            
            {isRegistered && userProfile && (
              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userProfile.avatar ? (
                    <img 
                      src={userProfile.avatar} 
                      alt={t("صورة الملف الشخصي", "Profile Picture")} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <div className="py-1">
                    <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t("الملف الشخصي", "Profile")}
                    </a>
                    <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t("الإعدادات", "Settings")}
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      {t("تسجيل الخروج", "Logout")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {isLoading ? (
            // Loading state
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
          ) : isRegistered ? (
            // Dashboard for registered users
            <Dashboard />
          ) : (
            // Registration flow for new users
            <Registration onComplete={handleRegistrationComplete} />
          )}
        </main>
      </div>
    </div>
  );
}
