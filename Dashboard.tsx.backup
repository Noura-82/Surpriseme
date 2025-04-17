import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import GiftCard, { GiftItem } from "@/components/GiftCard";
import WishlistItem, { WishlistItemType, ItemStatus } from "@/components/WishlistItem";
import FriendWishlist, { FriendWishlistData } from "@/components/FriendWishlist";
import ShareModal from "@/components/ShareModal";
import AddFriendModal from "@/components/AddFriendModal";
import { apiRequest } from "@/lib/queryClient";

// Mock data for initial rendering (will be replaced with API calls)
const mockGifts = [
  { 
    id: 1, 
    nameAr: "سماعات لاسلكية فاخرة", 
    nameEn: "Premium Wireless Earbuds", 
    category: "tech",
    price: 699,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?headphones",
    stores: ["جرير", "اكسترا", "أمازون"],
    rating: 4.7,
    trending: true
  },
  { 
    id: 2, 
    nameAr: "اشتراك منصة ألعاب", 
    nameEn: "Gaming Platform Subscription", 
    category: "gaming",
    price: 240,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?gaming",
    stores: ["إلكترونيات", "نون", "متجر بلاي ستيشن"],
    rating: 4.9,
    trending: true
  },
  { 
    id: 3, 
    nameAr: "حقيبة ظهر للسفر والمغامرات", 
    nameEn: "Adventure Travel Backpack", 
    category: "travel",
    price: 450,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?backpack",
    stores: ["دكاثلون", "نمشي", "أمازون"],
    rating: 4.6,
    trending: false
  },
  { 
    id: 4, 
    nameAr: "قسيمة لفعالية موسم الرياض", 
    nameEn: "Riyadh Season Event Voucher", 
    category: "entertainment",
    price: 350,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?ticket",
    stores: ["تذاكري", "موقع موسم الرياض"],
    rating: 4.8,
    trending: true
  }
];

const mockCompactGifts = [
  { 
    id: 6, 
    nameAr: "عطر عربي بلمسة عصرية", 
    nameEn: "Modern Arabic Perfume", 
    category: "oud",
    price: 450,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?perfume",
    stores: ["العربية للعود", "سيفورا", "نون"],
    rating: 4.5,
    trending: false
  },
  { 
    id: 7, 
    nameAr: "اشتراك نادي رياضي", 
    nameEn: "Gym Membership", 
    category: "sports",
    price: 750,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?gym",
    stores: ["فتنس تايم", "نادي وقت اللياقة", "جولدز جيم"],
    rating: 4.4,
    trending: true
  },
  { 
    id: 8, 
    nameAr: "قميص بتصميم سعودي معاصر", 
    nameEn: "Contemporary Saudi Design T-shirt", 
    category: "local",
    price: 180,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?tshirt",
    stores: ["تراثنا", "مركز الموضة", "H&M"],
    rating: 4.2,
    trending: false
  },
  { 
    id: 9, 
    nameAr: "مجموعة مستحضرات عناية شخصية فاخرة", 
    nameEn: "Luxury Self-care Kit", 
    category: "selfcare",
    price: 350,
    currency: "SAR",
    imageUrl: "https://source.unsplash.com/random/300x300/?skincare",
    stores: ["سيفورا", "وجوه", "بات باث آند بيوند"],
    rating: 4.6,
    trending: true
  }
];

// Initial friends wishlist data
const initialFriendsWishlists: FriendWishlistData[] = [
  {
    id: 1,
    friend: { 
      name: "سارة الأحمد", 
      avatar: "https://source.unsplash.com/random/100x100/?woman" 
    },
    occasion: "عيد ميلاد",
    date: "2025-05-10",
    items: [
      { id: 101, name: "سماعات لاسلكية", link: "#", price: "349", icon: "gift" },
      { id: 102, name: "كتاب رواية", link: "#", price: "85", icon: "book" }
    ]
  },
  {
    id: 2,
    friend: { 
      name: "محمد العتيبي", 
      avatar: "https://source.unsplash.com/random/100x100/?man" 
    },
    occasion: "تخرج",
    date: "2025-06-20",
    items: [
      { id: 201, name: "ساعة ذكية", link: "#", price: "1200", icon: "clock" },
      { id: 202, name: "حقيبة لابتوب", link: "#", price: "350" }
    ]
  }
];

export default function Dashboard() {
  const { t, language, dir } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [wishlist, setWishlist] = useState<WishlistItemType[]>([]);
  const [friendsWishlists, setFriendsWishlists] = useState<FriendWishlistData[]>(initialFriendsWishlists);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItemType | null>(null);
  const [newItem, setNewItem] = useState<Partial<WishlistItemType>>({ name: "", price: "", link: "" });
  const [trendingGifts, setTrendingGifts] = useState<GiftItem[]>(mockGifts);
  const [recommendedGifts, setRecommendedGifts] = useState<GiftItem[]>(mockCompactGifts);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const userResponse = await apiRequest("GET", "/api/user/profile", undefined);
        const userData = await userResponse.json();
        if (userData) {
          setUserProfile(userData);
        }
        
        // Fetch gifts data
        const giftsResponse = await apiRequest("GET", "/api/gifts", undefined);
        const giftsData = await giftsResponse.json();
        
        // Filter trending gifts and recommended gifts
        if (giftsData && giftsData.length) {
          setTrendingGifts(giftsData.filter((gift: GiftItem) => gift.trending).slice(0, 4));
          setRecommendedGifts(giftsData.filter((gift: GiftItem) => !gift.trending).slice(0, 4));
        }
        
        // Fetch wishlist data
        const wishlistResponse = await apiRequest("GET", "/api/wishlist", undefined);
        const wishlistData = await wishlistResponse.json();
        if (wishlistData) {
          setWishlist(wishlistData);
        }
        
        // Fetch friends wishlist data
        const friendsResponse = await apiRequest("GET", "/api/friends/wishlists", undefined);
        const friendsData = await friendsResponse.json();
        if (friendsData) {
          setFriendsWishlists(friendsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Show error toast
        toast({
          variant: "destructive",
          title: t("خطأ في التحميل", "Loading Error"),
          description: t("حدث خطأ أثناء تحميل البيانات", "An error occurred while loading data")
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [t, toast]);
  
  // Add gift to wishlist
  const addToWishlist = async (gift: GiftItem) => {
    try {
      // Convert gift to wishlist item format
      const wishlistItem: WishlistItemType = {
        id: Date.now(),
        name: language === "ar" ? gift.nameAr : gift.nameEn,
        category: gift.category,
        imageUrl: gift.imageUrl,
        price: gift.price,
        stores: gift.stores,
        status: "available"
      };
      
      // Add to local state
      setWishlist(prev => [...prev, wishlistItem]);
      
      // Send to server
      await apiRequest("POST", "/api/wishlist", wishlistItem);
      
      // Show success toast
      toast({
        title: t("تمت الإضافة بنجاح", "Added Successfully"),
        description: t("تمت إضافة العنصر إلى قائمة أمنياتك", "Item added to your wishlist"),
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        variant: "destructive",
        title: t("خطأ في الإضافة", "Error Adding Item"),
        description: t("حدث خطأ أثناء إضافة العنصر", "An error occurred while adding the item")
      });
    }
  };
  
  // Add custom item to wishlist
  const addCustomItem = async () => {
    if (newItem.name && newItem.price) {
      try {
        const wishlistItem: WishlistItemType = {
          id: Date.now(),
          name: newItem.name,
          price: newItem.price,
          link: newItem.link || "",
          status: "available"
        };
        
        // Add to local state
        setWishlist(prev => [...prev, wishlistItem]);
        
        // Send to server
        await apiRequest("POST", "/api/wishlist", wishlistItem);
        
        // Reset form and close modal
        setNewItem({ name: "", price: "", link: "" });
        setShowAddItemModal(false);
        
        // Show success toast
        toast({
          title: t("تمت الإضافة بنجاح", "Added Successfully"),
          description: t("تمت إضافة العنصر إلى قائمة أمنياتك", "Item added to your wishlist"),
        });
      } catch (error) {
        console.error("Error adding custom item:", error);
        toast({
          variant: "destructive",
          title: t("خطأ في الإضافة", "Error Adding Item"),
          description: t("حدث خطأ أثناء إضافة العنصر", "An error occurred while adding the item")
        });
      }
    }
  };
  
  // Remove item from wishlist
  const removeFromWishlist = async (itemId: number) => {
    try {
      // Remove from local state
      setWishlist(prev => prev.filter(item => item.id !== itemId));
      
      // Send to server
      await apiRequest("DELETE", `/api/wishlist/${itemId}`, undefined);
      
      // Show success toast
      toast({
        title: t("تم الحذف بنجاح", "Deleted Successfully"),
        description: t("تم حذف العنصر من قائمة أمنياتك", "Item removed from your wishlist"),
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        variant: "destructive",
        title: t("خطأ في الحذف", "Error Deleting Item"),
        description: t("حدث خطأ أثناء حذف العنصر", "An error occurred while removing the item")
      });
    }
  };
  
  // Handle sharing
  const handleShareItem = (item: WishlistItemType) => {
    setSelectedItem(item);
    setShowShareModal(true);
  };
  
  const handleShareList = () => {
    setSelectedItem(null);
    setShowShareModal(true);
  };
  
  // Reserve item from friend's wishlist
  const reserveFriendItem = async (friendId: number, itemId: number) => {
    try {
      // In a real app, this would update the status in the database
      
      // Update local state
      const updatedWishlists = friendsWishlists.map(list => {
        if (list.id === friendId) {
          const updatedItems = list.items.map(item => {
            if (item.id === itemId) {
              return { ...item, status: "reserved" as ItemStatus };
            }
            return item;
          });
          return { ...list, items: updatedItems };
        }
        return list;
      });
      
      setFriendsWishlists(updatedWishlists);
      
      // In a real app, we would call the API to update the item status
      // await apiRequest("PUT", `/api/friends/${friendId}/items/${itemId}/reserve`, { status: "reserved" });
      
      // Show success toast
      toast({
        title: t("تم الحجز بنجاح", "Reserved Successfully"),
        description: t("تم حجز الهدية بنجاح، سيتم إخطار صديقك بذلك", "Gift reserved successfully, your friend will be notified"),
      });
    } catch (error) {
      console.error("Error reserving friend's item:", error);
      toast({
        variant: "destructive",
        title: t("خطأ في الحجز", "Reservation Error"),
        description: t("حدث خطأ أثناء حجز الهدية", "An error occurred while reserving the gift")
      });
    }
  };
  
  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 font-medium ${activeTab === "profile" ? "text-green-700 border-b-2 border-green-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t("الرئيسية", "Home")}
        </button>
        <button 
          onClick={() => setActiveTab("wishlists")}
          className={`px-4 py-3 font-medium ${activeTab === "wishlists" ? "text-green-700 border-b-2 border-green-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {t("قوائم أمنياتي", "My Wishlists")}
        </button>
        <button 
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-3 font-medium ${activeTab === "friends" ? "text-green-700 border-b-2 border-green-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {t("الأصدقاء", "Friends")}
        </button>
      </div>
      
      {/* Profile Tab Content */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mr-4 rtl:ml-4 rtl:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {userProfile?.name || t("مستخدم سربرايز", "Surprise User")}
                  </h2>
                  <p className="text-gray-600">
                    {userProfile?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1 border-r rtl:border-r-0 rtl:border-l">
                  <div className="text-3xl font-bold text-emerald-600">{wishlist.length}</div>
                  <div className="text-sm text-gray-600">{t("قوائم الأمنيات", "Wishlists")}</div>
                </div>
                <div className="text-center flex-1 border-r rtl:border-r-0 rtl:border-l">
                  <div className="text-3xl font-bold text-indigo-600">{friendsWishlists.length}</div>
                  <div className="text-sm text-gray-600">{t("الأصدقاء", "Friends")}</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-amber-600">3</div>
                  <div className="text-sm text-gray-600">{t("مناسبات قادمة", "Upcoming Events")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* My Upcoming Occasions Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{t("مناسباتي القادمة", "My Upcoming Occasions")} 🎂</h2>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => setShowAddItemModal(true)}
                variant="outline"
                className="border-2 border-dashed border-green-300 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg text-sm flex items-center justify-center transition-colors w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t("إضافة مناسبة جديدة", "Add New Occasion")}
              </Button>
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-600 mr-3 rtl:ml-3 rtl:mr-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t("عيد ميلادي", "My Birthday")}</h3>
                    <p className="text-sm text-gray-600">{t("15 أغسطس 2025", "August 15, 2025")}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-amber-600 border-amber-200 hover:bg-amber-50 text-sm flex-1"
                  >
                    {t("تعديل", "Edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-amber-600 border-amber-200 hover:bg-amber-50 text-sm flex-1"
                  >
                    {t("عرض قائمة الأمنيات", "View Wishlist")}
                  </Button>
                </div>
                <div className="absolute -right-6 -bottom-6 rtl:-left-6 rtl:-right-auto w-20 h-20 bg-amber-100 rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Occasions */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{t("المناسبات القادمة", "Upcoming Occasions")} 🎂</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg border border-pink-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 mr-3 rtl:ml-3 rtl:mr-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t("عيد ميلاد سارة", "Sarah's Birthday")}</h3>
                    <p className="text-sm text-gray-600">{t("10 مايو 2025", "May 10, 2025")}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-pink-600 border-pink-200 hover:bg-pink-50 text-sm w-full"
                  >
                    {t("عرض قائمة الأمنيات", "View Wishlist")}
                  </Button>
                </div>
                <div className="absolute -right-6 -bottom-6 rtl:-left-6 rtl:-right-auto w-20 h-20 bg-pink-100 rounded-full opacity-50"></div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 mr-3 rtl:ml-3 rtl:mr-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t("تخرج محمد", "Mohammed's Graduation")}</h3>
                    <p className="text-sm text-gray-600">{t("20 يونيو 2025", "June 20, 2025")}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-sm w-full"
                  >
                    {t("عرض قائمة الأمنيات", "View Wishlist")}
                  </Button>
                </div>
                <div className="absolute -right-6 -bottom-6 rtl:-left-6 rtl:-right-auto w-20 h-20 bg-indigo-100 rounded-full opacity-50"></div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-600 mr-3 rtl:ml-3 rtl:mr-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t("زواج خالد وفاطمة", "Khalid & Fatima's Wedding")}</h3>
                    <p className="text-sm text-gray-600">{t("5 يوليو 2025", "July 5, 2025")}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-green-600 border-green-200 hover:bg-green-50 text-sm w-full"
                  >
                    {t("عرض قائمة الأمنيات", "View Wishlist")}
                  </Button>
                </div>
                <div className="absolute -right-6 -bottom-6 rtl:-left-6 rtl:-right-auto w-20 h-20 bg-green-100 rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Wishlists Tab Content */}
      {activeTab === "wishlists" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{t("قوائم أمنياتي", "My Wishlists")}</h2>
            <Button
              onClick={() => {
                // Show modal to create new wishlist
                toast({
                  title: t("إنشاء قائمة أمنيات جديدة", "Create New Wishlist"),
                  description: t("تم إنشاء قائمة أمنيات جديدة", "New wishlist has been created"),
                });
              }}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t("إنشاء قائمة جديدة", "Create New List")}
            </Button>
          </div>
          
          {/* Create First Wishlist CTA */}
          {!isLoading && wishlist.length === 0 ? (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center border-b">
                <div className="w-16 h-16 bg-blue-100 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t("ابدأ بإنشاء قائمة أمنياتك الأولى", "Start by creating your first wishlist")}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">{t("أنشئ قوائم أمنيات لمناسباتك المختلفة وشاركها مع أصدقائك وعائلتك", "Create wishlists for your different occasions and share them with friends and family")}</p>
                <Button
                  onClick={() => {
                    // Show modal to create new wishlist
                    toast({
                      title: t("إنشاء قائمة أمنيات جديدة", "Create New Wishlist"),
                      description: t("تم إنشاء قائمة أمنيات جديدة", "New wishlist has been created"),
                    });
                  }}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t("إنشاء قائمة أمنيات", "Create a Wishlist")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* My Wishlists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Birthday Wishlist */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 mr-3 rtl:ml-3 rtl:mr-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{t("عيد ميلادي", "My Birthday")}</h3>
                        <p className="text-sm text-gray-600">{t("15 أغسطس 2025", "August 15, 2025")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 text-sm text-gray-600 flex justify-between">
                      <span>{t("4 عناصر", "4 items")}</span>
                      <span className="text-pink-600">{t("خاصة", "Private")}</span>
                    </div>
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mr-2 rtl:ml-2 rtl:mr-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-800 font-medium truncate">{t("عنصر في قائمة الأمنيات " + i, "Wishlist item " + i)}</p>
                              <p className="text-xs text-gray-500">{t("300 ر.س", "300 SAR")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setShowAddItemModal(true)}
                      variant="outline"
                      className="w-full mt-3 bg-white text-pink-600 border border-pink-200 hover:bg-pink-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {t("إضافة عنصر", "Add Item")}
                    </Button>
                  </div>
                </div>
                
                {/* Graduation Wishlist */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 mr-3 rtl:ml-3 rtl:mr-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{t("تخرجي", "My Graduation")}</h3>
                        <p className="text-sm text-gray-600">{t("20 يونيو 2025", "June 20, 2025")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 text-sm text-gray-600 flex justify-between">
                      <span>{t("3 عناصر", "3 items")}</span>
                      <span className="text-blue-600">{t("عام", "Public")}</span>
                    </div>
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mr-2 rtl:ml-2 rtl:mr-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-800 font-medium truncate">{t("عنصر في قائمة الأمنيات " + i, "Wishlist item " + i)}</p>
                              <p className="text-xs text-gray-500">{t("500 ر.س", "500 SAR")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setShowAddItemModal(true)}
                      variant="outline"
                      className="w-full mt-3 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {t("إضافة عنصر", "Add Item")}
                    </Button>
                  </div>
                </div>
                
                {/* Add New Wishlist Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{t("إنشاء قائمة أمنيات جديدة", "Create a New Wishlist")}</h3>
                  <p className="text-gray-500 text-sm mb-4">{t("أنشئ قائمة لمناسبة قادمة أو لهدية تخطط لها", "Create a list for an upcoming occasion or a gift you're planning")}</p>
                  <Button
                    onClick={() => {
                      // Show modal to create new wishlist
                      toast({
                        title: t("إنشاء قائمة أمنيات جديدة", "Create New Wishlist"),
                        description: t("تم إنشاء قائمة أمنيات جديدة", "New wishlist has been created"),
                      });
                    }}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    {t("إنشاء قائمة", "Create List")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Friends Tab Content */}
      {activeTab === "friends" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t("قوائم أمنيات الأصدقاء", "Friends' Wishlists")}</h2>
          
          {/* Friends Wishlists */}
          <div className="space-y-4">
            {isLoading ? (
              // Skeleton loaders for friends wishlist
              [...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border shadow-sm overflow-hidden animate-pulse">
                  <div className="bg-indigo-100 p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 rtl:ml-3 rtl:mr-0"></div>
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-40"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : friendsWishlists.length > 0 ? (
              friendsWishlists.map(wishlist => (
                <FriendWishlist 
                  key={wishlist.id} 
                  wishlist={wishlist} 
                  onReserveItem={reserveFriendItem} 
                />
              ))
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-600">{t("لم تتم إضافة أي أصدقاء بعد", "No friends added yet")}</p>
              </div>
            )}
          </div>
          
          {/* Add Friend Button */}
          <div className="text-center mt-4">
            <Button
              onClick={() => setShowAddFriendModal(true)}
              variant="outline"
              className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {t("إضافة صديق", "Add Friend")}
            </Button>
          </div>
        </div>
      )}
      
      {/* Add Item Modal */}
      <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("إضافة عنصر جديد", "Add New Item")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{t("اسم العنصر", "Item Name")}</label>
              <Input
                type="text"
                placeholder={t("ادخل اسم العنصر", "Enter item name")}
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{t("التكلفة التقديرية (ر.س)", "Estimated Cost (SAR)")}</label>
              <Input
                type="number"
                placeholder={t("ادخل التكلفة التقديرية", "Enter estimated cost")}
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{t("رابط العنصر (اختياري)", "Item Link (Optional)")}</label>
              <Input
                type="url"
                placeholder="https://"
                value={newItem.link}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{t("وصف العنصر (اختياري)", "Item Description (Optional)")}</label>
              <Textarea
                placeholder={t("ادخل وصف العنصر", "Enter item description")}
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-3 rtl:space-x-reverse mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddItemModal(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium flex-1 transition-colors hover:bg-gray-300"
            >
              {t("إلغاء", "Cancel")}
            </Button>
            <Button
              variant="default"
              onClick={addCustomItem}
              disabled={!newItem.name || !newItem.price}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex-1 transition-colors"
            >
              {t("إضافة", "Add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Modal */}
      <ShareModal 
        open={showShareModal}
        onOpenChange={setShowShareModal}
        item={selectedItem}
        username={userProfile?.name || "user"}
      />
      
      {/* Add Friend Modal */}
      <AddFriendModal
        open={showAddFriendModal}
        onOpenChange={setShowAddFriendModal} 
        onAddFriend={(friend) => {
          // In a real app, this would update the friends list
          setFriendsWishlists(prev => [
            ...prev,
            {
              id: Date.now(),
              friend: { 
                name: friend.name, 
                avatar: friend.avatar 
              },
              occasion: "",
              date: "",
              items: []
            }
          ]);
          
          toast({
            title: t("تمت الإضافة بنجاح", "Added Successfully"),
            description: t("تمت إضافة الصديق بنجاح", "Friend added successfully"),
          });
        }}
      />
    </div>
  );
}
