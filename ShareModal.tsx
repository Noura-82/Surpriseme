import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { WishlistItemType } from "./WishlistItem";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WishlistItemType | null;
  username?: string;
}

export default function ShareModal({ open, onOpenChange, item, username = "user" }: ShareModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState("");
  
  // Base URL for sharing (would be actual domain in production)
  const baseUrl = window.location.origin;
  
  // Create share URL
  const shareUrl = item 
    ? `${baseUrl}/u/${username}/item/${item.id}`
    : `${baseUrl}/u/${username}`;
  
  // Default share text based on whether an item is being shared or the whole list
  const defaultText = item
    ? t(`أتمنى الحصول على "${item.name}"! شاهد قائمة أمنياتي على تطبيق SURPRISE ME`, 
        `I wish for "${item.name}"! Check out my wishlist on SURPRISE ME app`)
    : t(`هذه قائمة أمنياتي! شاهد ما أتمناه على تطبيق SURPRISE ME`, 
        `This is my wishlist! Check out what I wish for on SURPRISE ME app`);
  
  // Prepare full share text based on custom message or default
  const getShareText = () => {
    const shareText = customMessage || defaultText;
    return `${shareText} ${shareUrl}`;
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t("تم النسخ بنجاح!", "Copied successfully!"),
        description: t("تم نسخ الرابط إلى الحافظة", "Link copied to clipboard"),
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        variant: "destructive",
        title: t("فشل النسخ", "Copy failed"),
        description: t("لم نتمكن من نسخ الرابط", "Could not copy the link"),
      });
    });
  };
  
  // Share functions for different platforms
  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, "_blank");
    onOpenChange(false);
  };
  
  const shareViaSnapchat = () => {
    // Snapchat sharing isn't directly available via URL, so we'll just copy the link
    copyToClipboard(shareUrl);
    toast({
      title: t("تم نسخ الرابط", "Link copied"),
      description: t("يمكنك الآن لصق الرابط في سناب شات", "You can now paste the link in Snapchat"),
    });
    onOpenChange(false);
  };
  
  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, "_blank");
    onOpenChange(false);
  };
  
  const shareViaEmail = () => {
    const subject = item 
      ? t(`أتمنى الحصول على: ${item.name}`, `I wish for: ${item.name}`)
      : t("قائمة أمنياتي", "My Wishlist");
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getShareText())}`, "_blank");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span role="img" aria-label="share" className="text-xl">🔗</span>
            {t("مشاركة", "Share")} 
            {item ? t(` "${item.name}"`, ` "${item.name}"`) : t(" قائمة أمنياتي", " my wishlist")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Custom message */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="share-message">
              {t("رسالة مخصصة (اختياري)", "Custom message (optional)")}
            </label>
            <Textarea 
              id="share-message"
              placeholder={defaultText}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Share link */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="share-link">
              {t("رابط المشاركة", "Share link")}
            </label>
            <div className="flex">
              <Input 
                id="share-link"
                value={shareUrl}
                readOnly
                className="flex-grow"
              />
              <Button 
                variant="outline"
                className="ml-2 rtl:mr-2 rtl:ml-0" 
                onClick={() => copyToClipboard(shareUrl)}
              >
                {t("نسخ", "Copy")}
              </Button>
            </div>
          </div>
          
          {/* Sharing platforms */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("مشاركة عبر", "Share via")}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border-green-200"
                onClick={shareViaWhatsApp}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 13.9 2.5 15.6 3.4 17.1L2.6 21L6.6 20.2C8 21 9.9 21.5 12 21.5C17.5 21.5 22 17 22 11.5C22 6 17.5 1.5 12 2ZM17 15.3C16.8 15.9 15.8 16.4 15.2 16.5C14.7 16.5 14.1 16.7 11.8 15.8C9.9 15 8.5 13.1 8.3 12.8C8.2 12.6 7.3 11.4 7.3 10.1C7.3 8.9 7.9 8.3 8.1 8C8.3 7.8 8.6 7.7 8.8 7.7C8.9 7.7 9.1 7.7 9.2 7.7C9.4 7.7 9.6 7.6 9.8 8.1C10 8.5 10.4 9.8 10.5 9.9C10.6 10.1 10.6 10.2 10.5 10.4C10.4 10.6 10.4 10.7 10.2 10.9C10.1 11.1 9.9 11.2 9.7 11.5C9.6 11.6 9.4 11.8 9.6 12.1C9.8 12.4 10.4 13.3 11.2 14C12.1 14.8 12.9 15.1 13.2 15.2C13.5 15.3 13.7 15.3 13.9 15.1C14.1 14.9 14.4 14.6 14.7 14.3C14.9 14.1 15.1 14 15.3 14.1C15.5 14.2 16.7 14.8 17 14.9C17.3 15.1 17.5 15.1 17.6 15.2C17.6 15.5 17.2 15.9 17 15.3Z"/>
                </svg>
                WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                onClick={shareViaSnapchat}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFFC00">
                  <path d="M12.1 2C9.3 2 6.9 4.4 6.8 7.2C6.8 7.6 6.7 8.8 6.4 9.8C6.2 10.4 5.7 10.7 5.2 10.9C4.9 11.1 4.6 11.2 4.4 11.3C4.2 11.5 4.1 11.7 4.1 11.9C4.1 12.2 4.3 12.5 4.8 12.6C5.1 12.7 5.4 12.7 5.8 12.8C6.1 12.8 6.4 12.9 6.5 13.1C6.7 13.3 6.6 13.7 6.5 14.1L6.5 14.1C6.2 15.3 5.5 16.4 4.1 16.4V16.8C4.1 17.1 4.2 17.3 4.3 17.5C4.6 18.1 5.2 18.5 6 18.9C6.1 18.9 6.1 19 6.2 19C6.6 19.2 7.2 19.4 8.1 19.7C8.1 19.9 8.2 20.2 8.4 20.4C8.6 20.7 9 21 9.9 21C10.7 21 11.3 20.5 12 20.5C12.7 20.5 13.3 21 14.1 21C15 21 15.4 20.7 15.6 20.4C15.8 20.2 15.9 19.9 15.9 19.7C16.8 19.4 17.4 19.2 17.8 19C17.9 19 17.9 18.9 18 18.9C18.8 18.5 19.4 18.1 19.7 17.5C19.8 17.3 19.9 17.1 19.9 16.8V16.4C18.5 16.4 17.8 15.3 17.5 14.1L17.5 14.1C17.4 13.7 17.3 13.3 17.5 13.1C17.6 12.9 17.9 12.8 18.2 12.8C18.6 12.7 18.9 12.7 19.2 12.6C19.7 12.5 19.9 12.2 19.9 11.9C19.9 11.7 19.8 11.5 19.6 11.3C19.4 11.2 19.1 11.1 18.8 10.9C18.3 10.7 17.8 10.4 17.6 9.8C17.3 8.8 17.2 7.6 17.2 7.2C17.1 4.4 14.7 2 12.1 2Z"/>
                </svg>
                Snapchat
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                onClick={shareViaTwitter}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
                  <path d="M22 5.8a8.5 8.5 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3c-.8.5-1.6.8-2.6 1a4.2 4.2 0 0 0-7.2 3.8A11.8 11.8 0 0 1 3 4.9a4.2 4.2 0 0 0 1.3 5.6c-.7 0-1.3-.2-1.9-.5 0 1.8 1.3 3.3 3 3.7-.6.1-1.2.2-1.8 0a4.2 4.2 0 0 0 3.9 2.9 8.5 8.5 0 0 1-5.2 1.8c-.3 0-.7 0-1-.1a11.8 11.8 0 0 0 6.4 1.9c7.7 0 11.9-6.4 11.9-11.9v-.5c.8-.6 1.5-1.3 2-2.1z"/>
                </svg>
                Twitter
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border-gray-200"
                onClick={shareViaEmail}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#6B7280">
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7l-8 5.3-8-5.3V6l8 5.3L20 6v2.7z"/>
                </svg>
                {t("البريد الإلكتروني", "Email")}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            onClick={() => {
              copyToClipboard(shareUrl);
              onOpenChange(false);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {t("نسخ الرابط وإغلاق", "Copy link & close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}