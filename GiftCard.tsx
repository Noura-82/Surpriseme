import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export interface GiftItem {
  id: number;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  stores: string[];
  rating: number;
  trending?: boolean;
}

interface GiftCardProps {
  gift: GiftItem;
  onAddToWishlist: (gift: GiftItem) => void;
  compact?: boolean;
}

export default function GiftCard({ gift, onAddToWishlist, compact = false }: GiftCardProps) {
  const { t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError 
    ? `https://placehold.co/300x300/e2e8f0/1e293b?text=${encodeURIComponent(language === "ar" ? gift.nameAr : gift.nameEn)}`
    : `https://source.unsplash.com/random/300x300/?${encodeURIComponent(gift.category)}`;
  
  if (compact) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden gift-card-gradient">
        <img 
          src={imageUrl} 
          alt={language === "ar" ? gift.nameAr : gift.nameEn} 
          className="w-full h-32 object-cover"
          onError={handleImageError}
        />
        <div className="p-2">
          <h3 className="font-bold text-gray-800 text-sm">{language === "ar" ? gift.nameAr : gift.nameEn}</h3>
          <div className="flex justify-between items-center mt-1">
            <div className="font-bold text-green-700 text-sm">{gift.price} {t("ر.س", "SAR")}</div>
            <button 
              onClick={() => onAddToWishlist(gift)}
              className="text-green-500 text-lg cursor-pointer hover:text-green-700"
              aria-label={t("إضافة إلى قائمة الأمنيات", "Add to wishlist")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden relative gift-card-gradient ${gift.trending ? 'trending-badge' : ''}`}>
      <div className="flex h-36">
        <div className="w-1/3">
          <img 
            src={imageUrl} 
            alt={language === "ar" ? gift.nameAr : gift.nameEn} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800">{language === "ar" ? gift.nameAr : gift.nameEn}</h3>
            <div className="flex text-sm text-gray-500 mt-1">
              <span className="ml-2 ltr:mr-2 ltr:ml-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1 ltr:mr-1 ltr:ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {t(getCategoryNameAr(gift.category), getCategoryNameEn(gift.category))}
              </span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline text-yellow-500 ml-1 ltr:mr-1 ltr:ml-0" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {gift.rating}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-green-700">{gift.price} {t("ر.س", "SAR")}</div>
            <button 
              onClick={() => onAddToWishlist(gift)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center transition-colors"
              aria-label={t("إضافة إلى قائمة الأمنيات", "Add to wishlist")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 ltr:mr-1 ltr:ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t("أضف", "Add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryNameAr(categoryId: string): string {
  const categories: Record<string, string> = {
    tech: "تقنية وقادجت",
    gaming: "ألعاب إلكترونية",
    fashion: "أزياء عصرية",
    sports: "رياضة ولياقة",
    travel: "سفر ومغامرات",
    local: "منتجات محلية عصرية",
    coffee: "قهوة وكافيهات",
    entertainment: "ترفيه وفعاليات",
    oud: "عطور وبخور",
    selfcare: "العناية الشخصية"
  };
  
  return categories[categoryId] || categoryId;
}

function getCategoryNameEn(categoryId: string): string {
  const categories: Record<string, string> = {
    tech: "Tech & Gadgets",
    gaming: "Gaming",
    fashion: "Fashion",
    sports: "Sports & Fitness",
    travel: "Travel & Adventure",
    local: "Modern Local Products",
    coffee: "Coffee & Cafes",
    entertainment: "Entertainment & Events",
    oud: "Perfumes",
    selfcare: "Self-care"
  };
  
  return categories[categoryId] || categoryId;
}
