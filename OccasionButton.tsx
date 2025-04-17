import { useLanguage } from "@/hooks/use-language";

export interface Occasion {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface OccasionButtonProps {
  occasion: Occasion;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function OccasionButton({ occasion, selected, onSelect }: OccasionButtonProps) {
  const { language } = useLanguage();
  
  return (
    <button
      type="button"
      key={occasion.id}
      onClick={() => onSelect(occasion.id)}
      className={`px-4 py-2 rounded-lg border transition-colors ${
        selected
          ? "bg-green-600 text-white border-green-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
      aria-pressed={selected}
    >
      {language === "ar" ? occasion.nameAr : occasion.nameEn}
    </button>
  );
}
