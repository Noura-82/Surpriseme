import { useLanguage } from "@/hooks/use-language";

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  const { t } = useLanguage();
  
  const tabs = [
    {
      id: "discover",
      label: t("اكتشف", "Discover"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      id: "wishlist",
      label: t("قائمة أمنياتي", "My Wishlist"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 118 0v7M6 8h.01M6 16h.01" />
        </svg>
      )
    },
    {
      id: "friends",
      label: t("الأصدقاء", "Friends"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="flex border-b mb-6">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 font-medium ${activeTab === tab.id ? "text-green-700 border-b-2 border-green-500" : "text-gray-500 hover:text-gray-700"}`}
          aria-selected={activeTab === tab.id}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
