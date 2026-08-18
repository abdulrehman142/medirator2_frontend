import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryAssistant } from "../api/api";
import InstrumentPanel from "../components/InstrumentPanel";
import InventoryPanel from "../components/InventoryPanel";
import MedicineCard from "../components/MedicineCard";
import PatientSOAP from "../components/PatientSOAP";
import type { Category } from "../types/types";

const bot = "/medimages/medibotlogo.png";
const sendIcon = "/medimages/send.png";
const voiceIcon = "/medimages/voice.png";
const backIcon = "/medimages/back.png";
const deleteIcon = "/medimages/delete.png";
const editIcon = "/medimages/edit.png";

type UiMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  category?: string;
  structured?: Record<string, unknown> | null;
  confidence?: number;
  model?: string;
};

type Session = {
  id: string;
  title: string;
  category: Category | null;
  messages: UiMessage[];
};

const CATEGORY_META: Record<Category, { label: string; icon: string }> = {
  patients: { label: "Patients", icon: "/medimages/patient.png" },
  medicines: { label: "Medicines", icon: "/medimages/medicine.png" },
  inventory: { label: "Inventory", icon: "/medimages/inventory.png" },
  instruments: { label: "Instruments", icon: "/medimages/instruments.png" },
};

const CATEGORIES = (
  Object.entries(CATEGORY_META) as [Category, { label: string; icon: string }][]
).map(([value, meta]) => ({ value, ...meta }));

function makeChatTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New Chat";
  const capped = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return capped.length > 48 ? `${capped.slice(0, 48).trimEnd()}…` : capped;
}

function guessCategory(text: string): Category | null {
  const q = text.toLowerCase();
  if (/\b(patient|soap|mrn|diagnos|allerg|admission|symptom|vitals?)\b/.test(q))
    return "patients";
  if (/\b(medicine|medication|drug|dose|tablet|pill|prescription|rx|pharmacy)\b/.test(q))
    return "medicines";
  if (/\b(inventory|stock|supply|supplies|warehouse|reorder|sku)\b/.test(q))
    return "inventory";
  if (/\b(instrument|scalpel|forceps|equipment|device|surgical|tool)\b/.test(q))
    return "instruments";
  return null;
}

function newSession(category: Category | null = null): Session {
  return {
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "New Chat",
    category,
    messages: [],
  };
}

export default function Medibot() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<Session[]>(() => [newSession()]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening">("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const voiceBaseTextRef = useRef("");

  useEffect(() => {
    setCurrentChatId(sessions[0].id);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current =
    sessions.find((s) => s.id === currentChatId) ?? sessions[0] ?? null;
  const messages = current?.messages ?? [];
  const category = current?.category ?? null;

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  const updateSession = (id: string, updater: (s: Session) => Session) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
  };

  // Live title while composing the first message (don't overwrite sidebar category)
  useEffect(() => {
    if (!currentChatId) return;
    const title = makeChatTitle(input);
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentChatId || s.messages.length > 0) return s;
        if (s.title === title) return s;
        return { ...s, title };
      }),
    );
  }, [input, currentChatId]);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !current || loading) return;
    const trimmed = text.trim();
    const chatId = current.id;
    const isFirst = current.messages.length === 0;
    const selectedCategory = current.category;

    const userMsg: UiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setLoading(true);
    setInput("");
    updateSession(chatId, (s) => ({
      ...s,
      title: isFirst || s.title === "New Chat" ? makeChatTitle(trimmed) : s.title,
      category: s.category ?? guessCategory(trimmed),
      messages: [...s.messages, userMsg],
    }));

    try {
      // Use sidebar selection when set; otherwise backend auto-detects
      const res = await queryAssistant(trimmed, selectedCategory);
      const resolved =
        (res.category as Category | undefined) &&
        res.category in CATEGORY_META
          ? (res.category as Category)
          : selectedCategory ?? guessCategory(trimmed);
      const botMsg: UiMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: res.answer,
        category: res.category,
        structured: res.structured,
        confidence: res.confidence,
        model: res.model,
      };
      updateSession(chatId, (s) => ({
        ...s,
        category: resolved ?? s.category,
        title:
          isFirst || s.title === "New Chat" ? makeChatTitle(trimmed) : s.title,
        messages: [...s.messages, botMsg],
      }));
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "I could not process that message. Please try again.";
      updateSession(chatId, (s) => ({
        ...s,
        messages: [
          ...s.messages,
          { id: `e-${Date.now()}`, role: "bot", text: msg },
        ],
      }));
    } finally {
      setLoading(false);
      setVoiceState("idle");
      inputRef.current?.focus();
    }
  };

  const adjustComposerHeight = () => {
    const composer = inputRef.current;
    if (!composer) return;
    composer.style.height = "0px";
    composer.style.height = `${Math.max(Math.min(composer.scrollHeight, 160), 44)}px`;
  };

  const startVoiceInput = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError("Microphone access required");
      return;
    }
    setVoiceError(null);
    if (voiceState === "listening") {
      recognitionRef.current?.stop?.();
      setVoiceState("idle");
      setVoiceHint(null);
      return;
    }
    voiceBaseTextRef.current = input.trim();
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => {
      setVoiceState("listening");
      setVoiceHint("Listening...");
    };
    recognition.onresult = (event: {
      resultIndex: number;
      results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
    }) => {
      let finalTranscript = "";
      let liveTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const chunk = result[0]?.transcript ?? "";
        if (result.isFinal) finalTranscript += `${chunk} `;
        else liveTranscript += `${chunk} `;
      }
      const spoken = `${voiceBaseTextRef.current}${
        voiceBaseTextRef.current ? " " : ""
      }${(finalTranscript + liveTranscript).trim()}`.trim();
      if (spoken) {
        setInput(spoken);
        requestAnimationFrame(adjustComposerHeight);
      }
    };
    recognition.onerror = () => {
      setVoiceError("Voice input failed. Try again.");
      setVoiceState("idle");
    };
    recognition.onend = () => setVoiceState("idle");
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setVoiceError("Microphone access required");
      setVoiceState("idle");
    }
  };

  const renderBotBody = (m: UiMessage) => {
    if (m.structured && m.category === "patients") {
      return <PatientSOAP data={m.structured} />;
    }
    if (m.structured && m.category === "medicines") {
      return <MedicineCard data={m.structured} />;
    }
    if (m.structured && m.category === "inventory") {
      return <InventoryPanel data={m.structured} />;
    }
    if (m.structured && m.category === "instruments") {
      return <InstrumentPanel data={m.structured} />;
    }
    return <div>{m.text}</div>;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-black via-slate-900 to-black text-white">
      <aside className="flex h-full w-72 shrink-0 flex-col overflow-y-auto border-r border-white/5 bg-white/5 p-4">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center justify-center rounded p-2 transition-all duration-300 hover:scale-110 hover:bg-[#0B3C5D]"
          >
            <img src={backIcon} alt="Back" className="pointer-events-none h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            const created = newSession(category);
            setSessions((s) => [created, ...s]);
            setCurrentChatId(created.id);
            setInput("");
          }}
          className="mb-4 w-full rounded bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New Chat
        </button>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {CATEGORIES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (current) {
                  updateSession(current.id, (s) => ({
                    ...s,
                    category: option.value,
                  }));
                }
              }}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] ${
                category === option.value
                  ? "border-blue-400 bg-white/10 text-white"
                  : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >
              <img src={option.icon} alt="" className="h-8 w-8 object-contain" />
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => {
                setCurrentChatId(session.id);
                setInput("");
              }}
              className={`group cursor-pointer truncate rounded p-3 text-sm transition-colors ${
                currentChatId === session.id
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 truncate">
                  {session.category && (
                    <img
                      src={CATEGORY_META[session.category].icon}
                      alt=""
                      className="h-4 w-4 shrink-0 object-contain opacity-80"
                    />
                  )}
                  <span className="truncate">{session.title}</span>
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const title = prompt("New chat title:");
                      if (title?.trim()) {
                        updateSession(session.id, (s) => ({
                          ...s,
                          title: title.trim(),
                        }));
                      }
                    }}
                  >
                    <img src={editIcon} alt="Edit" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!confirm("Delete this chat?")) return;
                      setSessions((prev) => {
                        const remaining = prev.filter((s) => s.id !== session.id);
                        if (remaining.length === 0) {
                          const created = newSession();
                          setCurrentChatId(created.id);
                          return [created];
                        }
                        if (currentChatId === session.id) {
                          setCurrentChatId(remaining[0].id);
                        }
                        return remaining;
                      });
                    }}
                  >
                    <img src={deleteIcon} alt="Delete" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <img src={bot} alt="medibot" className="h-8 w-8 rounded-full" />
            <div>
              <div className="text-lg font-semibold">MediBot</div>
              <div className="text-xs opacity-70">AI Healthcare Assistant</div>
            </div>
          </div>
        </header>

        <section ref={chatRef} className="flex-1 space-y-4 overflow-y-auto bg-transparent p-6">
          <div className="mx-auto max-w-2xl space-y-3">
            {messages.length === 0 && (
              <div className="py-12 text-center text-white/40">
                <div className="text-sm">No messages yet</div>
                <div className="mt-2 text-xs">
                  Ask about patients, medicines, inventory, or instruments
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 text-sm ${
                    m.role === "user"
                      ? "max-w-xs rounded-lg bg-blue-600 text-white lg:max-w-md"
                      : "w-full max-w-xl rounded-lg bg-white/10 text-white"
                  }`}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {m.role === "bot" ? renderBotBody(m) : m.text}
                  {m.role === "bot" && m.confidence != null && (
                    <div className="mt-2 text-[11px] opacity-60">
                      Confidence {(m.confidence * 100).toFixed(0)}%
                      {m.model ? ` · ${m.model}` : ""}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-white/50">
                <span className="animate-pulse">Medibot is thinking...</span>
              </div>
            )}
          </div>
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
          className="border-t border-white/10 bg-black/20 p-4 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-3xl space-y-3">
            {(voiceError || voiceHint) && (
              <div
                className={`px-1 text-xs ${
                  voiceError ? "text-red-500" : "text-white/60"
                }`}
              >
                {voiceError || voiceHint}
              </div>
            )}

            <div className="flex items-end gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
              <div className="min-w-0 flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setVoiceError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder="Ask about patients, medicines, inventory, or instruments..."
                  rows={1}
                  onInput={adjustComposerHeight}
                  className="min-h-[44px] w-full resize-none overflow-hidden bg-transparent px-2 py-2 text-sm leading-5 text-white outline-none placeholder-white/60"
                />
              </div>

              <button
                type="button"
                onClick={startVoiceInput}
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                  voiceState === "listening"
                    ? "border-red-500 bg-red-100"
                    : "border-white/20 hover:bg-white/10"
                }`}
              >
                <img src={voiceIcon} className="h-5 w-5" alt="Voice" />
              </button>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 disabled:opacity-50"
              >
                <img src={sendIcon} className="h-5 w-5" alt="Send" />
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
