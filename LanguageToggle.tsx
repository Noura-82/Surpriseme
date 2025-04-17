import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors border-gray-300"
    >
      {t("English", "العربية")}
    </Button>
  );
}
