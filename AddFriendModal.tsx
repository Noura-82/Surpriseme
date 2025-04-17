import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFriend?: (friend: any) => void;
}

export default function AddFriendModal({ 
  open, 
  onOpenChange,
  onAddFriend
}: AddFriendModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [friendUsername, setFriendUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const searchFriend = async () => {
    if (!friendUsername) return;
    
    try {
      setIsSearching(true);
      
      // In a real app, we would call the API to search for users
      // const response = await apiRequest("GET", `/api/users/search?q=${friendUsername}`, undefined);
      // const data = await response.json();
      // if (data) {
      //   setSearchResults(data);
      // }
      
      // Mock search results for now
      setTimeout(() => {
        setSearchResults([
          {
            id: 101,
            name: "سارة الأحمد",
            username: "sarah93",
            avatar: "https://source.unsplash.com/random/100x100/?woman"
          },
          {
            id: 102,
            name: "أحمد العلي",
            username: "ahmed.a",
            avatar: "https://source.unsplash.com/random/100x100/?man"
          }
        ]);
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      console.error("Error searching for friend:", error);
      toast({
        variant: "destructive",
        title: t("خطأ في البحث", "Search Error"),
        description: t("حدث خطأ أثناء البحث عن المستخدم", "An error occurred while searching for users")
      });
      setIsSearching(false);
    }
  };
  
  const addFriend = async (friend: any) => {
    try {
      // In a real app, we would call the API to add a friend
      // await apiRequest("POST", "/api/friends", { friendId: friend.id });
      
      if (onAddFriend) {
        onAddFriend(friend);
      }
      
      toast({
        title: t("تمت الإضافة بنجاح", "Added Successfully"),
        description: t("تمت إضافة الصديق بنجاح", "Friend added successfully")
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        variant: "destructive",
        title: t("خطأ في الإضافة", "Error Adding Friend"),
        description: t("حدث خطأ أثناء إضافة الصديق", "An error occurred while adding the friend")
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("إضافة صديق", "Add a Friend")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("البحث عن صديق", "Search for a friend")}</label>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Input
                type="text"
                placeholder={t("اسم المستخدم أو البريد الإلكتروني", "Username or email")}
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={searchFriend}
                disabled={!friendUsername || isSearching}
                variant="default"
              >
                {isSearching ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("جارٍ البحث...", "Searching...")}
                  </span>
                ) : t("بحث", "Search")}
              </Button>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("نتائج البحث", "Search Results")}</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((friend) => (
                  <div 
                    key={friend.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-gray-500">@{friend.username}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => addFriend(friend)}
                      variant="outline"
                      size="sm"
                    >
                      {t("إضافة", "Add")}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("إلغاء", "Cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}