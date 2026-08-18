import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const IMG = "/medimages";
const mediratorLogo = `${IMG}/mediratorlogo.png`;
const registerIcon = `${IMG}/register.png`;
const loginIcon = `${IMG}/login.png`;
const logoutImg = `${IMG}/logout.png`;
const editIcon = `${IMG}/edit.png`;

const navBtn =
  "bg-black border-4 border-[#0B3C5D] hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-2xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap";

const outlineBtn =
  "bg-black border rounded-2xl border-[#0B3C5D] hover:text-white text-white hover:bg-gray-800 p-2 px-4 text-sm transition-all duration-300 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const links = [
    { name: t("navbar", "home", "Home"), href: "/" },
    { name: t("navbar", "howItWorks", "How it works"), href: "/how-it-works" },
    { name: t("navbar", "aboutUs", "About Us"), href: "/about" },
    { name: t("navbar", "faqs", "FAQs"), href: "/faqs" },
    { name: t("navbar", "medibot", "Medibot"), href: "/medibot" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between bg-black px-4 py-2 md:flex-nowrap md:px-6">
      <div className="flex items-center">
        <Link to="/" className="flex items-center p-2 no-underline">
          <img
            src={mediratorLogo}
            alt="Medirator Logo"
            className="h-8 w-8"
            loading="lazy"
          />
          <div className="ml-1 font-eczar text-xl font-bold text-white md:text-2xl">
            Medirator
          </div>
        </Link>

        <div className="relative hidden p-4 lg:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group m-2 flex items-center justify-center whitespace-nowrap rounded p-2 font-ibm-plex-mono text-sm font-medium text-white no-underline transition-all duration-200 hover:bg-[#0B3C5D]"
            >
              <span className="flex items-center group-hover:text-white">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <div className="hidden gap-1 md:flex">
          {!isAuthenticated && (
            <>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className={navBtn}
              >
                <img
                  src={registerIcon}
                  alt="Register"
                  className="h-4 w-4 rounded object-cover"
                  loading="lazy"
                />
                {t("navbar", "register", "Register")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={navBtn}
              >
                <img
                  src={loginIcon}
                  alt="Login"
                  className="h-5 w-5 rounded object-cover"
                  loading="lazy"
                />
                {t("navbar", "login", "Login")}
              </button>
            </>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className={outlineBtn}
            >
              <img
                src={editIcon}
                alt="Edit profile"
                className="h-5 w-5 rounded object-cover"
                loading="lazy"
              />
              {t("navbar", "profile", "Profile")}
            </button>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className={outlineBtn}
            >
              <img
                src={logoutImg}
                alt="Logout"
                className="h-5 w-5 rounded object-cover"
                loading="lazy"
              />
              {t("navbar", "logout", "Logout")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
