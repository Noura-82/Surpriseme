import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface RegistrationProps {
  onComplete: () => void;
}

// List of interests for Saudi youth (18-35)
const interestsList = [
  { id: "tech", nameAr: "تقنية وقادجت", nameEn: "Tech & Gadgets" },
  { id: "gaming", nameAr: "ألعاب إلكترونية", nameEn: "Gaming" },
  { id: "fashion", nameAr: "أزياء عصرية", nameEn: "Fashion" },
  { id: "sports", nameAr: "رياضة ولياقة", nameEn: "Sports & Fitness" },
  { id: "travel", nameAr: "سفر ومغامرات", nameEn: "Travel & Adventure" },
  { id: "local", nameAr: "منتجات محلية عصرية", nameEn: "Modern Local Products" },
  { id: "coffee", nameAr: "قهوة وكافيهات", nameEn: "Coffee & Cafes" },
  { id: "entertainment", nameAr: "ترفيه وفعاليات", nameEn: "Entertainment & Events" },
  { id: "oud", nameAr: "عطور وبخور", nameEn: "Perfumes" },
  { id: "selfcare", nameAr: "العناية الشخصية", nameEn: "Self-care" }
];

// List of local occasions
const occasions = [
  { id: "birthday", nameAr: "عيد ميلاد", nameEn: "Birthday" },
  { id: "eid", nameAr: "عيد الفطر/الأضحى", nameEn: "Eid" },
  { id: "graduation", nameAr: "تخرج", nameEn: "Graduation" },
  { id: "promotion", nameAr: "ترقية وظيفية", nameEn: "Job Promotion" },
  { id: "newjob", nameAr: "وظيفة جديدة", nameEn: "New Job" },
  { id: "engagement", nameAr: "خطوبة", nameEn: "Engagement" },
  { id: "friendship", nameAr: "صداقة", nameEn: "Friendship" },
  { id: "seasonal", nameAr: "مواسم الترفيه", nameEn: "Entertainment Seasons" },
  { id: "thanks", nameAr: "شكر وتقدير", nameEn: "Thank You" }
];

export default function Registration({ onComplete }: RegistrationProps) {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [budget, setBudget] = useState(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Form validation for step 1
  useEffect(() => {
    if (step === 1) {
      setIsFormValid(name.trim() !== "" && 
                    email.trim() !== "" && 
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
                    phone.trim() !== "");
    } else if (step === 2) {
      setIsFormValid(interests.length > 0 && selectedOccasion !== "");
    }
  }, [step, name, email, phone, interests, selectedOccasion]);

  // Toggle interests selection
  const toggleInterest = (interestId: string) => {
    setInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId) 
        : [...prev, interestId]
    );
  };

  // Go to next step
  const goToNextStep = async () => {
    if (step === 2) {
      try {
        setIsSubmitting(true);
        // Submit user data to the server
        await apiRequest("POST", "/api/users/register", {
          name,
          email,
          phone,
          interests,
          occasion: selectedOccasion,
          budget
        });
        setStep(3);
      } catch (error) {
        console.error("Error submitting user data:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  // Go to previous step
  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  // Complete registration
  const completeRegistration = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center w-full max-w-xs">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-green-500" : "bg-gray-200"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>3</div>
        </div>
      </div>

      {/* Step 1: Account Creation */}
      {step === 1 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">{t("إنشاء حسابك", "Create Your Account")}</h1>
          <p className="text-gray-600 text-center">{t("تعرف على تفضيلاتك في الهدايا وابدأ تجربتك", "Learn about your gift preferences and start your experience")}</p>
          
          <div className="space-y-3 mt-6">
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{t("الاسم الكامل", "Full Name")}</label>
              <Input
                id="fullName"
                type="text"
                placeholder={t("ادخل اسمك الكامل", "Enter your full name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring focus:ring-green-300 focus:border-green-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t("البريد الإلكتروني", "Email Address")}</label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring focus:ring-green-300 focus:border-green-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t("رقم الجوال", "Phone Number")}</label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("05xxxxxxxx", "05xxxxxxxx")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring focus:ring-green-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          
          <Button
            onClick={goToNextStep}
            disabled={!isFormValid}
            variant="success"
            size="xl"
            className="w-full"
          >
            {t("التالي", "Next")}
          </Button>
        </div>
      )}

      {/* Step 2: Interests & Preferences */}
      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">{t("اختر اهتماماتك", "Select Your Interests")}</h1>
          <p className="text-gray-600 text-center">{t("ساعدنا في التعرف على تفضيلاتك للهدايا", "Help us understand your gift preferences")}</p>
          
          <div className="space-y-6 mt-6">
            {/* Interests Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{t("ما هي اهتماماتك؟", "What are your interests?")}</h2>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      interests.includes(interest.id)
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {language === "ar" ? interest.nameAr : interest.nameEn}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Occasion Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{t("مناسبات تهتم بها", "Occasions you're interested in")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {occasions.map((occasion) => (
                  <button
                    key={occasion.id}
                    onClick={() => setSelectedOccasion(occasion.id)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedOccasion === occasion.id
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {language === "ar" ? occasion.nameAr : occasion.nameEn}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Budget Setting */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{t("حدد الميزانية (ريال سعودي)", "Set Budget (SAR)")}</h2>
              <PriceRangeSlider
                min={100}
                max={1000}
                step={50}
                defaultValue={budget}
                onChange={setBudget}
              />
            </div>
          </div>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              onClick={goToPreviousStep}
              variant="outline"
              size="xl"
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-300"
            >
              {t("رجوع", "Back")}
            </Button>
            <Button
              onClick={goToNextStep}
              disabled={!isFormValid || isSubmitting}
              variant="success"
              size="xl"
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("جاري التحميل...", "Loading...")}
                </>
              ) : (
                t("التالي", "Next")
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Final & Welcome */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t("مرحباً بك في هدايا!", "Welcome to GIFT IT!")}</h1>
            <p className="text-gray-600 mt-2">{t("تم إعداد حسابك بنجاح. يمكنك الآن استكشاف الهدايا وإدارة قوائم الأمنيات.", "Your account has been successfully set up. You can now explore gifts and manage wishlists.")}</p>
          </div>
          
          <div className="bg-indigo-100 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-700 mb-2">{t("نصائح سريعة للبدء:", "Quick tips to get started:")}</h3>
            <ul className="text-indigo-700 space-y-1 text-sm list-disc list-inside">
              <li>{t("استكشف الهدايا المخصصة لاهتماماتك", "Explore gifts tailored to your interests")}</li>
              <li>{t("أضف الهدايا التي تعجبك إلى قائمة أمنياتك", "Add gifts you like to your wishlist")}</li>
              <li>{t("شارك قائمتك مع الأصدقاء والعائلة", "Share your list with friends and family")}</li>
              <li>{t("اكتشف قوائم أمنيات أصدقائك", "Discover your friends' wishlists")}</li>
            </ul>
          </div>
          
          <Button
            onClick={completeRegistration}
            variant="success"
            size="xl"
            className="w-full"
          >
            {t("ابدأ التصفح", "Start Browsing")}
          </Button>
        </div>
      )}
    </div>
  );
}
