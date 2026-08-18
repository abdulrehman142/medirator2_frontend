import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navLinkClass =
    "block py-2 px-2 text-white hover:bg-[#0B3C5D] rounded w-max transition-all duration-200 no-underline";

  const col1 = [
    { label: t("navbar", "home", "Home"), path: "/" },
    { label: t("navbar", "howItWorks", "How it works"), path: "/how-it-works" },
    { label: t("navbar", "medibot", "Medibot"), path: "/medibot" },
  ];
  const col2 = [
    { label: t("navbar", "faqs", "FAQs"), path: "/faqs" },
    { label: t("navbar", "aboutUs", "About Us"), path: "/about" },
    { label: t("complaints", "nav", "Complaints"), path: "/#complaints" },
  ];

  return (
    <div>
      <div className="w-full bg-black p-5 xl:p-8">
        <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-start">
          <div className="grid grid-cols-1 gap-6 font-ibm-plex-mono font-medium text-white sm:grid-cols-3 sm:gap-10">
            <div className="flex flex-col">
              {col1.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col">
              {col2.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                  className={`${navLinkClass} cursor-pointer border-0 bg-transparent text-left font-ibm-plex-mono font-medium`}
                >
                  {t("navbar", "logout", "Logout")}
                </button>
              ) : (
                <Link to="/login" className={navLinkClass}>
                  {t("navbar", "login", "Login")}
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-y-4 xl:items-end">
            <div className="whitespace-nowrap text-left font-ibm-plex-mono text-base leading-8 text-white xl:text-right">
              {t("footer", "tagline", "Wellness, effortless with Medirator.")}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-y-4 xl:flex-row xl:items-center">
          <p className="font-ibm-plex-mono text-sm text-white">
            {t("footer", "rights", "© 2026 Medirator All Rights Reserved.")}
          </p>

          <div className="flex flex-row items-start gap-4">
            <Link
              to="/privacy-policy"
              className="block font-ibm-plex-mono text-xs text-white no-underline hover:underline"
            >
              {t("footer", "privacyPolicy", "Privacy Policy")}
            </Link>
            <Link
              to="/terms"
              className="block font-ibm-plex-mono text-xs text-white no-underline hover:underline"
            >
              {t("footer", "terms", "Terms & Conditions")}
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-black px-4 py-5 sm:px-5 xl:px-8">
        <h1 className="m-0 whitespace-nowrap text-center font-jersey tracking-tight text-white text-[clamp(0.7rem,5.5vw,5.5rem)]">
          {t(
            "footer",
            "heroLine",
            "Medirator-AI-Powered Hospital Knowledge Assistant",
          )}
        </h1>
      </div>
    </div>
  );
}
