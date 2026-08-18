import { Link } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Register() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 text-white">
      <h1 className="font-eczar text-3xl font-semibold text-white">Medirator</h1>
      <p className="mt-1 font-ibm-plex-mono text-sm text-white/60">
        Register with Google to access Medibot.
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(79,209,197,0.08)] backdrop-blur-xl">
        <h2 className="font-ibm-plex-mono text-sm font-semibold tracking-[0.14em] text-[#4FD1C5] uppercase">
          Register
        </h2>
        <div className="mt-5">
          <GoogleAuthButton mode="register" />
        </div>
      </div>

      <p className="mt-6 font-ibm-plex-mono text-xs text-white/50">
        Already have an account?{" "}
        <Link to="/login" className="text-[#4FD1C5] no-underline hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
