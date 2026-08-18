import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ur";

type Dict = Record<string, Record<string, string>>;

const translations: Record<Lang, Dict> = {
  en: {
    navbar: {
      home: "Home",
      howItWorks: "How it works",
      aboutUs: "About Us",
      faqs: "FAQs",
      medibot: "Medibot",
      language: "Language",
      english: "English",
      urdu: "Urdu",
      register: "Register",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      dataExplorer: "Data Explorer",
    },
    footer: {
      tagline: "Wellness, effortless with Medirator.",
      rights: "© 2026 Medirator All Rights Reserved.",
      privacyPolicy: "Privacy Policy",
      terms: "Terms & Conditions",
      heroLine: "Medirator-AI-Powered Hospital Knowledge Assistant",
    },
    complaints: {
      nav: "Complaints",
      eyebrow: "Case intake",
      title: "Resolving your complaints!",
      subtitle:
        "Help us improve Medirator — share your complaint so we can serve you better.",
      from: "From",
      to: "To Email",
      subject: "Subject",
      subjectPlaceholder: "Brief summary of the issue",
      complaint: "Complaint",
      messagePlaceholder: "Describe the issue in detail…",
      attachment: "Attachment",
      attachHint: "Click to attach one file",
      removeFile: "Remove attachment",
      sending: "Sending complaint...",
      sendMessage: "Send complaint",
      success: "Complaint sent successfully",
      contactLine: "Or email us at",
      loginPrompt: "Sign in to submit a complaint with your account email.",
      checkingAuth: "Checking session…",
      errorAuth: "Please sign in to submit a complaint.",
      errorFill: "Please fill in recipient email, subject, and complaint.",
      errorEmail: "Please enter a valid recipient email.",
      errorLength: "Complaint should be at least 10 characters.",
      errorFileType: "Attachment must be PNG, JPG, MP4, or WEBM.",
      errorFileSize: "Attachment must be 10MB or smaller.",
      errorFailed: "Failed to send complaint. Please try again later.",
    },
    legal: {},
  },
  ur: {
    navbar: {
      home: "ہوم",
      howItWorks: "کیسے کام کرتا ہے",
      aboutUs: "ہمارے بارے میں",
      faqs: "عمومی سوالات",
      medibot: "میڈی بوٹ",
      language: "زبان",
      english: "انگریزی",
      urdu: "اردو",
      register: "رجسٹر",
      login: "لاگ اِن",
      logout: "لاگ آؤٹ",
      profile: "پروفائل",
      dataExplorer: "ڈیٹا ایکسپلورر",
    },
    footer: {
      tagline: "میڈیریٹر کے ساتھ صحت آسان۔",
      rights: "© 2026 میڈیریٹر جملہ حقوق محفوظ۔",
      privacyPolicy: "پرائیویسی پالیسی",
      terms: "شرائط و ضوابط",
      heroLine: "میڈیریٹر — آپ کا صحت معاون",
    },
    complaints: {
      nav: "شکایات",
      eyebrow: "کیس انٹیک",
      title: "آپ کی شکایات حل کرنا!",
      subtitle:
        "میڈیریٹر کو بہتر بنانے میں مدد کریں — اپنی شکایت شیئر کریں۔",
      from: "منجانب",
      to: "وصول کنندہ ای میل",
      subject: "موضوع",
      subjectPlaceholder: "مسئلے کا مختصر خلاصہ",
      complaint: "شکایت",
      messagePlaceholder: "مسئلہ تفصیل سے بیان کریں…",
      attachment: "منسلکہ",
      attachHint: "ایک فائل منسلک کرنے کے لیے کلک کریں",
      removeFile: "منسلکہ ہٹائیں",
      sending: "شکایت بھیجی جا رہی ہے...",
      sendMessage: "شکایت بھیجیں",
      success: "شکایت کامیابی سے بھیج دی گئی",
      contactLine: "یا ہمیں ای میل کریں",
      loginPrompt: "شکایت جمع کرانے کے لیے سائن ان کریں۔",
      checkingAuth: "سیشن چیک ہو رہا ہے…",
      errorAuth: "شکایت جمع کرانے کے لیے سائن ان کریں۔",
      errorFill: "وصول کنندہ ای میل، موضوع اور شکایت بھریں۔",
      errorEmail: "درست وصول کنندہ ای میل درج کریں۔",
      errorLength: "شکایت کم از کم ۱۰ حروف کی ہو۔",
      errorFileType: "منسلکہ PNG، JPG، MP4 یا WEBM ہونا چاہیے۔",
      errorFileSize: "منسلکہ ۱۰MB یا اس سے کم ہو۔",
      errorFailed: "شکایت بھیجنے میں ناکامی۔ دوبارہ کوشش کریں۔",
    },
    legal: {},
  },
};

interface LanguageContextValue {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: (section: string, key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>(() => {
    const saved = localStorage.getItem("medirator_lang");
    return saved === "ur" ? "ur" : "en";
  });

  const setLanguage = (next: Lang) => {
    setLanguageState(next);
    localStorage.setItem("medirator_lang", next);
    document.documentElement.lang = next === "ur" ? "ur" : "en";
    document.documentElement.dir = next === "ur" ? "rtl" : "ltr";
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (section: string, key: string, fallback: string) =>
        translations[language]?.[section]?.[key] ?? fallback,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
