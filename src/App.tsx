import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./index.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Medibot = lazy(() => import("./pages/Medibot"));
const DataExplorer = lazy(() => import("./pages/DataExplorer"));
const Profile = lazy(() => import("./pages/Profile"));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center font-ibm-plex-mono text-sm text-white/55">
      Loading…
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/medibot");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.removeItem("medirator_theme");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-black font-ibm-plex-mono text-white">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />

            <Route
              path="/medibot"
              element={
                <ProtectedRoute>
                  <Medibot />
                </ProtectedRoute>
              }
            />
            <Route path="/assistant" element={<Navigate to="/medibot" replace />} />
            <Route
              path="/data"
              element={
                <ProtectedRoute>
                  <DataExplorer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/doctor" element={<Navigate to="/medibot" replace />} />
            <Route path="/admin" element={<Navigate to="/medibot" replace />} />
            <Route path="/architecture" element={<Navigate to="/how-it-works" replace />} />
            <Route path="/demo" element={<Navigate to="/medibot" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

function AppShell() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

function App() {
  const googleClientId = (
    import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  )?.trim();

  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppShell />
      </GoogleOAuthProvider>
    );
  }

  return <AppShell />;
}

export default App;
