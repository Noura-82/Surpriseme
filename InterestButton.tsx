import { useLanguage } from "@/hooks/use-language";

export interface Interest {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface InterestButtonProps {
  interest: Interest;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function InterestButton({ interest, selected, onToggle }: InterestButtonProps) {
  const { language } = useLanguage();
  
  return (
    <button
      type="button"
      key={interest.id}
      onClick={() => onToggle(interest.id)}
      className={`px-4 py-2 rounded-lg border transition-colors ${
        selected
          ? "bg-green-600 text-white border-green-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
      aria-pressed={selected}
    >
      {language === "ar" ? interest.nameAr : interest.nameEn}
    </button>
  );
}
