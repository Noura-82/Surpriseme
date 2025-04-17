import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  onChange: (value: number) => void;
}

export default function PriceRangeSlider({ 
  min, 
  max, 
  step, 
  defaultValue, 
  onChange 
}: PriceRangeSliderProps) {
  const [value, setValue] = useState(defaultValue);
  const { t } = useLanguage();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{min} {t("ر.س", "SAR")}</span>
          <span>{max}+ {t("ر.س", "SAR")}</span>
        </div>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>
      <div className="bg-gray-100 p-3 rounded-lg text-center">
        <span className="font-bold text-green-700">{value}</span> {t("ريال سعودي", "SAR")}
      </div>
    </div>
  );
}
