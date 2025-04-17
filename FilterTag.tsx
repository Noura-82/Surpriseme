import { useLanguage } from "@/hooks/use-language";

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

export default function FilterTag({ label, onRemove }: FilterTagProps) {
  const { t } = useLanguage();
  
  return (
    <button 
      onClick={onRemove}
      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm flex items-center"
      aria-label={t(`إزالة الفلتر: ${label}`, `Remove filter: ${label}`)}
    >
      {label}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1 rtl:mr-1 rtl:ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
