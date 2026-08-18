import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  mode?: "login" | "register";
}

export default function GoogleAuthButton({ mode = "login" }: Props) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  if (!clientId) {
    return (
      <div className="rounded-lg border border-alert/30 bg-alert/10 px-4 py-3 text-sm text-alert">
        Set <code className="font-ibm-plex-mono">VITE_GOOGLE_CLIENT_ID</code> in{" "}
        <code className="font-ibm-plex-mono">frontend/.env</code> to enable Google
        sign-in.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center rounded-lg bg-white p-2 shadow-md">
        {loading ? (
          <div className="px-4 py-2 text-sm text-black/60">Connecting…</div>
        ) : (
          <GoogleLogin
            onSuccess={async (response) => {
              if (!response.credential) {
                setError("No credential returned from Google.");
                return;
              }
              setLoading(true);
              setError(null);
              try {
                await loginWithGoogle(response.credential);
                navigate("/medibot", { replace: true });
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : `${mode} failed. Please try again.`,
                );
              } finally {
                setLoading(false);
              }
            }}
            onError={() => setError("Google sign-in was cancelled or failed.")}
            theme="outline"
            size="large"
            text={mode === "register" ? "signup_with" : "continue_with"}
            shape="rectangular"
            width="320"
          />
        )}
      </div>
      <p className="text-center text-xs text-white/50">
        Continue with Google
      </p>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
