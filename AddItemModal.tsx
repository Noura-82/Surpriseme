import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface NewItemType {
  name: string;
  price: string;
  link?: string;
  description?: string;
}

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: NewItemType) => void;
}

export default function AddItemModal({
  open,
  onOpenChange,
  onAddItem,
}: AddItemModalProps) {
  const { t } = useLanguage();
  const [newItem, setNewItem] = useState<NewItemType>({
    name: "",
    price: "",
    link: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isValid = newItem.name.trim() !== "" && newItem.price.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      onAddItem(newItem);
      // Reset form
      setNewItem({ name: "", price: "", link: "", description: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("إضافة منتج جديد", "Add New Item")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t("اسم المنتج", "Item Name")}
            </label>
            <Input
              type="text"
              placeholder={t("ادخل اسم المنتج", "Enter item name")}
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t("سعر المنتج (ر.س)", "Item Price (SAR)")}
            </label>
            <Input
              type="number"
              placeholder={t("ادخل السعر", "Enter price")}
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t("رابط المنتج (اختياري)", "Item Link (Optional)")}
            </label>
            <Input
              type="url"
              placeholder="https://"
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t("وصف المنتج (اختياري)", "Item Description (Optional)")}
            </label>
            <Textarea
              placeholder={t("ادخل وصف المنتج", "Enter item description")}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring focus:ring-indigo-100 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-3 rtl:space-x-reverse mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium flex-1 transition-colors hover:bg-gray-300"
          >
            {t("إلغاء", "Cancel")}
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex-1 transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("جاري الإضافة...", "Adding...")}
              </>
            ) : (
              t("إضافة", "Add")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
