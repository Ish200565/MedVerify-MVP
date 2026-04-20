/**
 * MedBot.jsx
 * Floating chatbot widget for MedicineDashboard.
 *
 * Usage — add inside MedicineDashboard's return, after all content:
 *   <MedBot />
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, X, Send, Loader2, ChevronDown,
  Sparkles, Pill, Tent, Users, Package,
  RotateCcw, Copy, Check,
} from "lucide-react";
import API from "../services/api";

/* ── typewriter speed (ms per character) ────────────────── */
const TYPEWRITER_SPEED = 12;

/* ── markdown-ish renderer (bold + bullets) ─────────────── */
function RenderMarkdown({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        /* bold spans */
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          ) : part
        );

        /* bullet lines */
        if (line.trimStart().startsWith("•") || line.trimStart().startsWith("-")) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
              <span className="leading-relaxed">{parts}</span>
            </div>
          );
        }

        /* section headings (ALL CAPS lines ending with :) */
        if (/^[A-Z][A-Z\s]{3,}:/.test(line) || /^[─═–—]/.test(line)) {
          return (
            <p key={i} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3 mb-0.5">
              {line.replace(/^[─═–—]+/, "").trim()}
            </p>
          );
        }

        return <p key={i} className="leading-relaxed">{parts}</p>;
      })}
    </div>
  );
}

/* ── typewriter bubble ───────────────────────────────────── */
function TypewriterBubble({ fullText, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const idxRef                    = useRef(0);
  const timerRef                  = useRef(null);

  useEffect(() => {
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      if (idxRef.current < fullText.length) {
        idxRef.current += 1;
        setDisplayed(fullText.slice(0, idxRef.current));
        timerRef.current = setTimeout(tick, TYPEWRITER_SPEED);
      } else {
        setDone(true);
        onDone?.();
      }
    };

    timerRef.current = setTimeout(tick, TYPEWRITER_SPEED);
    return () => clearTimeout(timerRef.current);
  }, [fullText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2.5 items-start"
    >
      {/* avatar */}
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-200 mt-0.5">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>

      <div className="max-w-[82%]">
        <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white border border-slate-100 text-slate-700 shadow-sm">
          <RenderMarkdown text={displayed} />
          {/* blinking cursor while typing */}
          {!done && (
            <span className="inline-block w-0.5 h-3.5 bg-blue-500 ml-0.5 align-middle animate-pulse" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── static bubble (already-typed messages) ─────────────── */
function StaticBubble({ msg }) {
  const [copied, setCopied] = useState(false);
  const isBot = msg.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isBot ? "items-start" : "items-end justify-end"}`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-200 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div className="group relative max-w-[82%]">
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm"
            : "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm shadow-md shadow-blue-200"
        }`}>
          {isBot ? <RenderMarkdown text={msg.content} /> : msg.content}
        </div>

        {isBot && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── three-dot loading indicator ────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5 items-start"
    >
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-300"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.55, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── quick-prompt chips ──────────────────────────────────── */
const QUICK_PROMPTS = [
  { icon: Package, label: "Low stock",      text: "Which medicines are running low on stock?"       },
  { icon: Tent,    label: "Upcoming camps",  text: "List all upcoming camps with dates and locations." },
  { icon: Pill,    label: "Expiring meds",   text: "Which medicines are expiring within 30 days?"    },
  { icon: Users,   label: "Doctors",         text: "Who are the registered doctors?"                 },
];

/* ── main export ─────────────────────────────────────────── */
export default function MedBot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. I'm **MedBot**, your MedVerify assistant.\n\nI have access to your medicines, stock levels, camps, doctors, and reports.\n\nHow can I help you?",
      typed: true, // welcome message renders without typewriter
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [unread,  setUnread]  = useState(0);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* scroll to bottom on new content */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* focus input on open */
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  /* mark the last bot message as fully typed */
  const markLastTyped = useCallback(() => {
    setMessages(prev =>
      prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, typed: true } : m
      )
    );
  }, []);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput("");
    const userMsg = { role: "user", content, typed: true };
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(p => [...p, userMsg]);
    setLoading(true);

    try {
      const res = await API.post("/chatbot/ask", { message: content, history });
      // typed: false → triggers typewriter
      const botMsg = { role: "assistant", content: res.data.reply, typed: false };
      setMessages(p => [...p, botMsg]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMessages(p => [...p, {
        role: "assistant",
        content: "Sorry, I could not reach the server. Please try again.",
        typed: false,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared. Ask me anything about medicines, camps, or reports.",
      typed: true,
    }]);
  };

  return (
    <>
      {/* ── FLOATING BUTTON ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl shadow-blue-300/50 flex items-center justify-center"
        aria-label="Open MedBot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <ChevronDown className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="bot"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <Sparkles className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── CHAT PANEL ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.93, y: 16  }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] h-[580px] max-h-[calc(100vh-120px)] flex flex-col rounded-3xl bg-slate-50 shadow-2xl shadow-slate-300/60 border border-slate-200 overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">MedBot</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-blue-100">Live database access</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors text-blue-100 hover:text-white"
                  title="Clear chat">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors text-blue-100 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
            >
              {messages.map((msg, i) => {
                const isLast   = i === messages.length - 1;
                const isBot    = msg.role === "assistant";
                const needsTyping = isBot && !msg.typed && isLast;

                return needsTyping ? (
                  <TypewriterBubble
                    key={i}
                    fullText={msg.content}
                    onDone={markLastTyped}
                  />
                ) : (
                  <StaticBubble key={i} msg={msg} />
                );
              })}

              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* QUICK PROMPTS — shown only on welcome screen */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 grid grid-cols-2 gap-2 shrink-0">
                {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
                  <button key={label} onClick={() => sendMessage(text)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all text-left shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* INPUT BAR */}
            <div className="px-3 pb-3 pt-2 shrink-0 border-t border-slate-100 bg-white">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                  }}
                  onKeyDown={handleKey}
                  placeholder="Ask about medicines, camps, stock…"
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
                  style={{ maxHeight: "96px", overflowY: "auto" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors shadow-md shadow-blue-200 disabled:shadow-none"
                >
                  {loading
                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    : <Send    className="w-3.5 h-3.5 text-white" />
                  }
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-300 mt-1.5">
                MedBot · Powered by MedVerify
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}