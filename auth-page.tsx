import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const registerSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { t, language, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);
    setError("");

    try {
      // Call login API
      const response = await apiRequest("POST", "/api/login", values);
      const data = await response.json();

      // Navigate to dashboard on success
      setLocation("/");
    } catch (error: any) {
      setError(error.message || t("حدث خطأ أثناء تسجيل الدخول", "An error occurred during login"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true);
    setError("");

    try {
      // Call register API
      const response = await apiRequest("POST", "/api/register", values);
      const data = await response.json();

      // Navigate to dashboard on success
      setLocation("/");
    } catch (error: any) {
      setError(error.message || t("حدث خطأ أثناء إنشاء الحساب", "An error occurred during registration"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="lg:w-1/2 space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t("سِرْبرايز مِي", "SURPRISE ME")}
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-indigo-600">
                {t("منصة الهدايا المثالية", "The Perfect Gift Platform")}
              </h2>
            </div>
            
            <p className="text-gray-600 text-lg">
              {t(
                "اكتشف وشارك أفكار الهدايا المثالية بناءً على اهتماماتك والمناسبات. نساعدك في إدارة قوائم أمنياتك ومفاجأة أحبائك بالهدايا التي يرغبون بها حقًا.",
                "Discover and share perfect gift ideas based on interests and occasions. We help you manage your wishlists and surprise your loved ones with gifts they truly want."
              )}
            </p>
            
            <div className="space-y-3 py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 rtl:ml-3 rtl:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("أنشئ قائمة أمنياتك", "Create Your Wishlist")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("أضف الهدايا التي ترغب بها وشاركها مع أصدقائك", "Add gifts you want and share with friends")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 rtl:ml-3 rtl:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("تابع أصدقاءك", "Follow Your Friends")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("اكتشف قوائم أمنيات أصدقائك واحجز هداياهم", "Discover your friends' wishlists and reserve their gifts")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 rtl:ml-3 rtl:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("اكتشف أفكار هدايا مميزة", "Discover Unique Gift Ideas")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("توصيات مخصصة بناءً على الاهتمامات والمناسبات", "Personalized recommendations based on interests and occasions")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Auth Forms */}
          <div className="lg:w-1/2">
            <Card className="shadow-lg">
              <CardHeader>
                <Tabs defaultValue="login" onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("تسجيل الدخول", "Login")}</TabsTrigger>
                    <TabsTrigger value="register">{t("إنشاء حساب", "Register")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="p-0 pt-4">
                    <CardTitle>{t("تسجيل الدخول", "Login")}</CardTitle>
                    <CardDescription>{t("أدخل بيانات حسابك للوصول إلى منصة سربرايز مي", "Enter your account details to access Surprise Me platform")}</CardDescription>
                  </TabsContent>
                  
                  <TabsContent value="register" className="p-0 pt-4">
                    <CardTitle>{t("إنشاء حساب جديد", "Create New Account")}</CardTitle>
                    <CardDescription>{t("سجل معنا للوصول إلى كافة مميزات المنصة", "Sign up to access all platform features")}</CardDescription>
                  </TabsContent>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <TabsContent value="login" className="pt-2">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("اسم المستخدم", "Username")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("أدخل اسم المستخدم", "Enter username")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("كلمة المرور", "Password")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("جاري تسجيل الدخول...", "Logging in...")}
                          </span>
                        ) : (
                          t("تسجيل الدخول", "Login")
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register" className="pt-2">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("الاسم", "Name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("أدخل اسمك", "Enter your name")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("اسم المستخدم", "Username")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("أدخل اسم المستخدم", "Enter username")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("البريد الإلكتروني", "Email")}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder={t("أدخل بريدك الإلكتروني", "Enter your email")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("كلمة المرور", "Password")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("تأكيد كلمة المرور", "Confirm Password")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("جاري إنشاء الحساب...", "Creating account...")}
                          </span>
                        ) : (
                          t("إنشاء حساب", "Register")
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </CardContent>
              
              <CardFooter className="flex justify-center pt-2">
                <p className="text-xs text-gray-500">
                  {activeTab === "login" 
                    ? t("من خلال تسجيل الدخول، أنت توافق على شروط الاستخدام وسياسة الخصوصية.", "By logging in, you agree to our Terms of Use and Privacy Policy.")
                    : t("من خلال إنشاء حساب، أنت توافق على شروط الاستخدام وسياسة الخصوصية.", "By creating an account, you agree to our Terms of Use and Privacy Policy.")}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}