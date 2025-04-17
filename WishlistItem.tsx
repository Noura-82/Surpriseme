import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export type ItemStatus = "available" | "reserved" | "gifted";

export interface WishlistItemType {
  id: number;
  name: string;
  category?: string;
  imageUrl?: string;
  price: string | number;
  link?: string;
  stores?: string[];
  status?: ItemStatus;
}

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (id: number) => void;
  onEdit?: (id: number) => void;
  onShare?: (item: WishlistItemType) => void;
  onReserve?: (id: number) => void;
  isFriendItem?: boolean;
}

export default function WishlistItem({ 
  item, 
  onRemove, 
  onEdit, 
  onShare,
  onReserve,
  isFriendItem = false
}: WishlistItemProps) {
  const { t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError 
    ? `https://placehold.co/150x150/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`
    : item.imageUrl || `https://source.unsplash.com/random/150x150/?gift`;

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

  // Determine if item is available for reservation
  const isAvailable = !item.status || item.status === "available";

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden relative">
      {/* Status badge (top right corner) */}
      {item.status && (
        <div className={`absolute top-0 right-0 rtl:left-0 rtl:right-auto px-2 py-1 text-xs font-medium rounded-bl-lg rtl:rounded-bl-none rtl:rounded-br-lg ${getStatusColor(item.status)}`}>
          {getStatusText(item.status)}
        </div>
      )}
      
      <div className="flex">
        <div className="w-1/4">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="w-3/4 p-3 flex flex-col justify-between">
          <div className="flex justify-between">
            <h3 className="font-bold text-gray-800">{item.name}</h3>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {!isFriendItem && onShare && (
                <button 
                  onClick={() => onShare(item)}
                  className="text-gray-500 hover:text-indigo-600"
                  aria-label={t("مشاركة", "Share")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
              {!isFriendItem && onEdit && (
                <button 
                  onClick={() => onEdit(item.id)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={t("تعديل", "Edit")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {!isFriendItem && (
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-gray-500 hover:text-red-500"
                  aria-label={t("حذف", "Delete")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {(item.category || item.stores) && (
            <div className="mt-1">
              {item.category && (
                <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {item.category}
                </span>
              )}
              {item.stores && item.stores.length > 0 && (
                <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-600 mr-1 rtl:mr-0 rtl:ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {item.stores[0]}
                </span>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <div className="font-bold text-green-700">{item.price} {t("ر.س", "SAR")}</div>
            
            {/* Friends wishlist item - Reserve button */}
            {isFriendItem && onReserve && isAvailable ? (
              <button
                onClick={() => onReserve(item.id)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1 rtl:ml-0 rtl:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("حجز الهدية", "Reserve Gift")}
              </button>
            ) : (
              // Regular item - Product link
              item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 text-sm hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1 rtl:ml-0 rtl:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t("رابط المنتج", "Product Link")}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
