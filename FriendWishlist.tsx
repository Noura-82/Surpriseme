import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { WishlistItemType, ItemStatus } from "./WishlistItem";

export interface Friend {
  name: string;
  avatar: string;
}

// Update to extend WishlistItemType for compatibility
export interface FriendWishlistItem extends WishlistItemType {
  icon?: string;
}

export interface FriendWishlistData {
  id: number;
  friend: Friend;
  occasion: string;
  date: string;
  items: FriendWishlistItem[];
}

interface FriendWishlistProps {
  wishlist: FriendWishlistData;
  onReserveItem?: (friendId: number, itemId: number) => void;
}

export default function FriendWishlist({ wishlist, onReserveItem }: FriendWishlistProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const avatarUrl = imageError
    ? `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(wishlist.friend.name.charAt(0))}`
    : wishlist.friend.avatar || `https://source.unsplash.com/random/100x100/?portrait`;

  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Calculate days remaining until the occasion
  const getDaysRemaining = (dateString: string) => {
    const occasionDate = new Date(dateString);
    const today = new Date();
    
    // Reset time portion for accurate day calculation
    occasionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const differenceInTime = occasionDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    if (differenceInDays < 0) return t("انتهت", "Passed");
    if (differenceInDays === 0) return t("اليوم!", "Today!");
    if (differenceInDays === 1) return t("غدًا!", "Tomorrow!");
    
    return t(`${differenceInDays} يوم متبقي`, `${differenceInDays} days left`);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Status styles and text
  const getStatusColor = (status?: ItemStatus) => {
    switch(status) {
      case "reserved": return "bg-orange-100 text-orange-800";
      case "gifted": return "bg-blue-100 text-blue-800";
      case "available":
      default: return "bg-green-100 text-green-700";
    }
  };

  const getStatusText = (status?: ItemStatus) => {
    switch(status) {
      case "reserved": return t("محجوز", "Reserved");
      case "gifted": return t("تم إهداؤه", "Gifted");
      case "available":
      default: return t("متاح", "Available");
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 rtl:ml-3 rtl:mr-0 ring-2 ring-white shadow">
            <img 
              src={avatarUrl} 
              alt={wishlist.friend.name} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-lg">{wishlist.friend.name}</div>
            <div className="text-xs flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 118 0v7M6 8h.01M6 16h.01" />
                </svg>
                {wishlist.occasion}
              </span>
              <span className="inline-flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(wishlist.date)}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getDaysRemaining(wishlist.date)}
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={toggleExpanded}
          variant="default"
          size="sm"
          className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg text-xs border border-indigo-200"
        >
          {expanded ? t("إخفاء القائمة", "Hide List") : t("عرض القائمة", "Show List")}
        </Button>
      </div>
      
      {/* Items List */}
      {expanded && (
        <div className="p-3 space-y-2">
          {wishlist.items.length > 0 ? (
            wishlist.items.map(item => {
              // Check if item is available for reservation
              const isAvailable = !item.status || item.status === "available";
              
              return (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative">
                  {/* Status badge */}
                  {item.status && (
                    <div className={`absolute top-0 right-0 rtl:left-0 rtl:right-auto px-2 py-0.5 text-xs font-medium rounded-bl-lg rtl:rounded-bl-none rtl:rounded-br-lg ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full text-indigo-600 flex items-center justify-center mr-2 rtl:ml-2 rtl:mr-0">
                        {getIconByName(item.icon)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block text-xs text-indigo-500 hover:underline mt-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {t("رابط المنتج", "Product Link")}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-green-700 font-bold text-sm">{item.price} {t("ر.س", "SAR")}</span>
                      {isAvailable && onReserveItem && (
                        <Button
                          onClick={() => onReserveItem(wishlist.id, item.id)}
                          variant="default"
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-xs rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t("حجز الهدية", "Reserve Gift")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p>{t("قائمة أمنيات فارغة", "Empty wishlist")}</p>
              <p className="text-sm">{t("لم يضف هذا الصديق أي عناصر بعد", "This friend hasn't added any items yet")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getIconByName(iconName?: string) {
  switch (iconName) {
    case "gift":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 118 0v7M6 8h.01M6 16h.01" />
        </svg>
      );
    case "book":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "clock":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
  }
}
