import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const FRAME_COUNT = 220;
const HERO_DURATION_SEC = 10;

const framePath = (index: number) =>
  `/black-frames/frame_${String(index).padStart(6, "0")}.jpg`;

const HEADING = "AI-Powered Hospital Knowledge Assistant";
const MICRO_CTA = "Your AI-powered clinical assistant is ready.";

const ROTATING_PHRASES = [
  "Intelligent Patient Insights",
  "Smart Medicine Lookup",
  "Real-Time Inventory Search",
  "Clinical Decision Support",
  "Secure Local AI with RAG",
] as const;

const DESCRIPTION =
  "Retrieve patient records, medicine information, and hospital inventory instantly using Retrieval-Augmented Generation (RAG) powered by a locally hosted AI model. Designed for fast, secure, and accurate clinical assistance.";

const CYAN = "#4FD1C5";
const SKY = "#38BDF8";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeInOut(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function progressToSeconds(progress: number) {
  return clamp01(progress) * HERO_DURATION_SEC;
}

function headingOpacity(seconds: number) {
  if (seconds <= 0) return 0;
  if (seconds < 2) return easeInOut(seconds / 2);
  return 1;
}

function headingTranslate(seconds: number) {
  if (seconds >= 2) return 0;
  return (1 - easeInOut(seconds / 2)) * 18;
}

function activePhrase(seconds: number): {
  index: number;
  opacity: number;
  offsetY: number;
} | null {
  if (seconds < 2 || seconds >= 8) return null;
  const local = seconds - 2;
  const slot = 6 / ROTATING_PHRASES.length;
  const index = Math.min(
    ROTATING_PHRASES.length - 1,
    Math.floor(local / slot),
  );
  const within = (local - index * slot) / slot;
  let opacity = 1;
  let offsetY = 0;
  if (within < 0.18) {
    const t = easeInOut(within / 0.18);
    opacity = t;
    offsetY = (1 - t) * 10;
  } else if (within > 0.82) {
    const t = easeInOut((1 - within) / 0.18);
    opacity = t;
    offsetY = (1 - t) * -8;
  }
  return { index, opacity, offsetY };
}

function finaleOpacity(seconds: number) {
  if (seconds < 8) return 0;
  return easeInOut((seconds - 8) / 1.1);
}

function finaleTranslate(seconds: number) {
  if (seconds < 8) return 14;
  return (1 - easeInOut((seconds - 8) / 1.1)) * 14;
}

/** Scroll-driven frame hero — stethoscope + clean copy only. */
export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadT, setLoadT] = useState(0);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img?.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;

    const targetW = Math.floor(width * dpr);
    const targetH = Math.floor(height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    // Keep clear space between left copy and stethoscope
    const x = (width - drawW) / 2 + width * 0.11;
    const y = (height - drawH) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);
  };

  useEffect(() => {
    let cancelled = false;
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = images;

    let loaded = 0;
    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i);
      const mark = () => {
        if (cancelled) return;
        images[i] = img;
        loaded += 1;
        setLoadedCount(loaded);
        if (i === 0 || loaded === 1) drawFrame(frameRef.current);
      };
      img.onload = mark;
      img.onerror = () => {
        loaded += 1;
        setLoadedCount(loaded);
      };
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = clamp01((now - start) / 1200);
      setLoadT(easeInOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const updateFromScroll = () => {
      rafRef.current = null;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const scrollProgress = scrolled / total;
      setProgress(scrollProgress);

      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(scrollProgress * (FRAME_COUNT - 1))),
      );

      if (frameIndex !== frameRef.current) {
        frameRef.current = frameIndex;
      }
      drawFrame(frameIndex);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(updateFromScroll);
    };

    const onResize = () => {
      drawFrame(frameRef.current);
      updateFromScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateFromScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCount]);

  const scrollHeight = `calc(100vh + ${FRAME_COUNT * 14}px)`;
  const ready = loadedCount > 0;
  const seconds = progressToSeconds(progress);
  const idleFactor = clamp01(1 - progress / 0.1) * loadT;

  const hOpacity = Math.max(headingOpacity(seconds), idleFactor);
  const hY =
    progress < 0.02 ? (1 - loadT) * 16 : headingTranslate(seconds);
  const phrase = activePhrase(seconds);
  const fOpacity = finaleOpacity(seconds);
  const fY = finaleTranslate(seconds);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="block h-full w-full bg-black" />

        {/* Soft static cyan glow behind the stethoscope only */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 46% at 78% 50%, rgba(79,209,197,0.14), transparent 68%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />

        <div className="absolute inset-0 z-10 flex items-center px-5 sm:px-10 lg:px-16">
          <div className="relative w-full max-w-xl font-ibm-plex-mono lg:max-w-[34rem]">
            {!ready && (
              <p className="text-sm text-white/50">Loading frames…</p>
            )}

            <div
              className="will-change-transform"
              style={{
                opacity: hOpacity,
                transform: `translateY(${hY}px)`,
              }}
            >
              <h1
                className="text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
                style={{
                  textShadow: `0 0 28px rgba(79,209,197,0.35), 0 0 56px rgba(56,189,248,0.2)`,
                }}
              >
                {HEADING}
              </h1>
              <p
                className="mt-4 max-w-md text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  opacity: idleFactor * 0.95,
                }}
              >
                {MICRO_CTA}
              </p>
            </div>

            <div className="relative mt-6 h-10 overflow-hidden sm:h-11">
              {phrase && (
                <div
                  className="absolute inset-x-0 top-0 flex items-center gap-3 will-change-transform"
                  style={{
                    opacity: phrase.opacity,
                    transform: `translateY(${phrase.offsetY}px)`,
                  }}
                >
                  <span
                    className="h-4 w-px shrink-0 sm:h-5"
                    style={{
                      background: `linear-gradient(180deg, ${CYAN}, ${SKY})`,
                    }}
                  />
                  <p className="text-base font-medium text-white/90 sm:text-lg">
                    {ROTATING_PHRASES[phrase.index]}
                  </p>
                </div>
              )}
            </div>

            <div
              className="mt-6 will-change-transform"
              style={{
                opacity: fOpacity,
                transform: `translateY(${fY}px)`,
                pointerEvents: fOpacity > 0.45 ? "auto" : "none",
              }}
            >
              <p
                className="max-w-xl text-sm leading-relaxed font-normal sm:text-[15px]"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {DESCRIPTION}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/medibot"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0B3C5D] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all duration-300 hover:scale-[1.02] hover:bg-[#0a3350] hover:shadow-[0_0_24px_rgba(11,60,93,0.55)]"
                >
                  Explore Medibot
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-[#0B3C5D] bg-transparent px-5 py-2.5 text-sm font-medium text-white no-underline transition-all duration-300 hover:bg-[#0B3C5D] hover:shadow-[0_0_20px_rgba(11,60,93,0.45)]"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
