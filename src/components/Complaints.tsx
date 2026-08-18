import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { deliverComplaintEmail, submitComplaint } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const CYAN = "#4FD1C5";
const ALLOWED = ["image/png", "image/jpeg", "video/mp4", "video/webm"];
const MAX_BYTES = 10 * 1024 * 1024;

function validateEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export default function Complaints() {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const toEmail = "abdulrehmantahir142@gmail.com";
  const [subject, setSubject] = useState("");
  const [complaint, setComplaint] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fromEmail = user?.email ?? "";

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isVideo = useMemo(
    () => Boolean(file && file.type.startsWith("video/")),
    [file],
  );

  const onFileChange = (selected: File | null) => {
    setError(null);
    setSuccess(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ALLOWED.includes(selected.type)) {
      setError(
        t(
          "complaints",
          "errorFileType",
          "Attachment must be PNG, JPG, MP4, or WEBM.",
        ),
      );
      setFile(null);
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError(
        t("complaints", "errorFileSize", "Attachment must be 10MB or smaller."),
      );
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAuthenticated || !fromEmail) {
      setError(
        t("complaints", "errorAuth", "Please sign in to submit a complaint."),
      );
      return;
    }
    if (!toEmail.trim() || !subject.trim() || !complaint.trim()) {
      setError(
        t(
          "complaints",
          "errorFill",
          "Please fill in recipient email, subject, and complaint.",
        ),
      );
      return;
    }
    if (!validateEmail(toEmail)) {
      setError(
        t("complaints", "errorEmail", "Please enter a valid recipient email."),
      );
      return;
    }
    if (complaint.trim().length < 10) {
      setError(
        t(
          "complaints",
          "errorLength",
          "Complaint should be at least 10 characters.",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      const savedSubject = subject.trim();
      const savedComplaint = complaint.trim();
      const savedFile = file;

      const res = await submitComplaint({
        toEmail: toEmail.trim(),
        subject: savedSubject,
        complaint: savedComplaint,
        attachment: savedFile,
      });

      // FormSubmit only works from a real web origin (e.g. Vite on localhost:5173)
      if (res.delivered !== "smtp") {
        await deliverComplaintEmail({
          to: res.to || toEmail,
          fromEmail: res.from_email || fromEmail,
          fromName: res.from_name || user?.name || fromEmail,
          subject: res.subject || savedSubject,
          messageBody: res.message_body || savedComplaint,
          attachment: savedFile,
        });
      }

      setSuccess(
        t("complaints", "success", "Complaint sent successfully"),
      );
      setSubject("");
      setComplaint("");
      setFile(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t(
              "complaints",
              "errorFailed",
              "Failed to send complaint. Please try again later.",
            ),
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition duration-300 placeholder:text-white/35 focus:border-[#4FD1C5] focus:shadow-[0_0_0_3px_rgba(79,209,197,0.15)]";

  return (
    <section
      id="complaints"
      className="relative overflow-hidden border-t border-white/10 bg-black px-4 py-16 sm:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 80% 20%, rgba(79,209,197,0.12), transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(56,189,248,0.08), transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md pt-2 font-ibm-plex-mono lg:pt-6">
          <p
            className="mb-3 text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ color: CYAN }}
          >
            {t("complaints", "eyebrow", "Case intake")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {t("complaints", "title", "Resolving your complaints!")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            {t(
              "complaints",
              "subtitle",
              "Help us improve Medirator — share your complaint so we can serve you better.",
            )}
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_40px_rgba(79,209,197,0.08)] backdrop-blur-xl sm:p-8">
            {authLoading ? (
              <p className="font-ibm-plex-mono text-sm text-white/50">
                {t("complaints", "checkingAuth", "Checking session…")}
              </p>
            ) : !isAuthenticated ? (
              <div className="font-ibm-plex-mono">
                <p className="text-sm text-white/70">
                  {t(
                    "complaints",
                    "loginPrompt",
                    "Sign in to submit a complaint with your account email.",
                  )}
                </p>
                <Link
                  to="/login"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0B3C5D] px-5 py-2.5 text-sm font-semibold text-white no-underline transition duration-300 hover:scale-[1.02] hover:bg-[#0a3350] hover:shadow-[0_0_24px_rgba(11,60,93,0.55)]"
                >
                  {t("navbar", "login", "Login")}
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 font-ibm-plex-mono text-sm text-red-300">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-ibm-plex-mono text-sm text-emerald-300">
                    {success}
                  </div>
                )}

                <form
                  onSubmit={(e) => void handleSubmit(e)}
                  className="space-y-4 font-ibm-plex-mono"
                >
                  <div>
                    <label className="mb-1 block text-xs text-white/55">
                      {t("complaints", "from", "From")}
                    </label>
                    <div className="rounded-xl border border-[#4FD1C5]/35 bg-black/50 px-3 py-2.5 text-sm text-[#4FD1C5]">
                      From: {fromEmail}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-white/55">
                      {t("complaints", "to", "To Email")}
                    </label>
                    <div className="rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white/80">
                      {toEmail}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-white/55">
                      {t("complaints", "subject", "Subject")}
                    </label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={fieldClass}
                      placeholder={t(
                        "complaints",
                        "subjectPlaceholder",
                        "Brief summary of the issue",
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-white/55">
                      {t("complaints", "complaint", "Complaint")}
                    </label>
                    <textarea
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      className={`${fieldClass} min-h-[140px] resize-y`}
                      placeholder={t(
                        "complaints",
                        "messagePlaceholder",
                        "Describe the issue in detail…",
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-white/55">
                      {t("complaints", "attachment", "Attachment")}{" "}
                      <span className="text-white/35">
                        (PNG, JPG, MP4, WEBM · max 10MB)
                      </span>
                    </label>
                    <label className="flex cursor-pointer flex-col gap-3 rounded-xl border border-dashed border-white/20 bg-black/30 px-4 py-4 transition duration-300 hover:border-[#4FD1C5]/50 hover:shadow-[0_0_20px_rgba(79,209,197,0.12)]">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.mp4,.webm,image/png,image/jpeg,video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) =>
                          onFileChange(e.target.files?.[0] ?? null)
                        }
                      />
                      <span className="text-sm text-white/70">
                        {file
                          ? file.name
                          : t(
                              "complaints",
                              "attachHint",
                              "Click to attach one file",
                            )}
                      </span>
                      {previewUrl && (
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          {isVideo ? (
                            <div className="flex items-center gap-3 bg-black/60 px-3 py-3 text-xs text-white/70">
                              <span
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-black"
                                style={{ background: CYAN }}
                              >
                                ▶
                              </span>
                              Video selected · {(file!.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </div>
                          ) : (
                            <img
                              src={previewUrl}
                              alt="Attachment preview"
                              className="max-h-40 w-full object-contain bg-black/60"
                            />
                          )}
                        </div>
                      )}
                    </label>
                    {file && (
                      <button
                        type="button"
                        onClick={() => onFileChange(null)}
                        className="mt-2 text-xs text-white/45 underline hover:text-white/80"
                      >
                        {t("complaints", "removeFile", "Remove attachment")}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0B3C5D] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:scale-[1.02] hover:bg-[#0a3350] hover:shadow-[0_0_24px_rgba(11,60,93,0.55)] disabled:opacity-50"
                    >
                      {loading
                        ? t("complaints", "sending", "Sending complaint...")
                        : t("complaints", "sendMessage", "Send complaint")}
                    </button>
                    <p className="text-xs text-white/40">
                      {t("complaints", "contactLine", "Or email us at")}{" "}
                      <a
                        href="mailto:abdulrehmantahir142@gmail.com"
                        className="text-[#0B3C5D] underline hover:text-white"
                      >
                        abdulrehmantahir142@gmail.com
                      </a>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
