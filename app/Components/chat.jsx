"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";



const paths = {
  chat: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3h2a8.5 8.5 0 0 1 8.5 8.5ZM7 10h10M7 14h6",
  close: "m6 6 12 12M18 6 6 18",
  check: "m3 12 4 4 9-9m-5 7 2 2 9-9",
  more: "M12 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  send: "m21 3-7 18-4-7-7-4 18-7ZM10 14 21 3",
  smile: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-7a4.5 4.5 0 0 0 8 0M8 9h.01M16 9h.01",
};

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

function Icon({ name, className = "h-5 w-5", strokeWidth = "1.7" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
const messageCache = {};

export default function Chat({



  recipient,  
  initialMessages = [],

}) {



  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const savedSession = JSON.parse(localStorage.getItem("supabaseSession") || "null");
  const currentUserId = savedSession?.user?.id;

  const onSendMessage = async (newMsg) => {

    const accessToken = savedSession?.access_token;
    const refreshToken = savedSession?.refresh_token;
    try {
      const res = await fetch("https://helio-aiqr.onrender.com/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
        body: JSON.stringify({
          "chatroom_id": recipient.chatroom_id,
          "content": newMsg.text
        }),
      });

      if (!res.ok) {
        const errorData = await res.json(); // read backend error
        console.error("Backend error:", errorData.error); // log it in console
        throw new Error(errorData.error || "Failed to load profile");
      }


    }
    catch (err) { console.error("Fetch failed:", (err).message); }
  };

  useEffect(() => {
    if (!recipient?.chatroom_id) return;

    const cached = messageCache[recipient.chatroom_id];
    if (cached) {
      setMessages(cached);
      return;
    }

    const loadMessages = async () => {

      const savedSession = JSON.parse(localStorage.getItem("supabaseSession") || "null");
      const currentUserId = savedSession?.user?.id;
      if (savedSession) {
        const { access_token, refresh_token } = savedSession;
        await supabase.auth.setSession({ access_token, refresh_token });
      }


      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chatroom_id", recipient.chatroom_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      const formatted = data.map((msg) => ({
        id: msg.id,
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        isOwn: msg.sender_id === currentUserId,
      }));

      messageCache[recipient.chatroom_id] = formatted;
      setMessages(formatted);
    };

    loadMessages();
  }, [recipient?.chatroom_id, currentUserId]);


  useEffect(() => {
    if (!recipient?.chatroom_id) return;

    
    const savedSession = JSON.parse(localStorage.getItem("supabaseSession") || "null");
    if (savedSession) {
      const { access_token, refresh_token } = savedSession;
      supabase.auth.setSession({ access_token, refresh_token });
    }

    const channel = supabase
      .channel(`chatroom-${recipient.chatroom_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chatroom_id=eq.${recipient.chatroom_id}`,
        },
        (payload) => {
          console.log("Realtime payload:", payload);
          const msg = payload.new;
          const confirmedMessage = {
            id: msg.id,
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString(),
            isOwn: msg.sender_id === currentUserId,
          };

          setMessages((prev) =>
            prev.map((m) =>
              m.text === confirmedMessage.text && m.isOwn
                ? confirmedMessage
                : m
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipient?.chatroom_id, currentUserId]);


  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);


  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
      inputRef.current.style.height = Math.min(120, Math.max(40, inputRef.current.scrollHeight)) + "px";
    }
  }, [inputText]);

  function handleSend(e) {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const tempId = Date.now();
    const newMsg = {
      id: tempId,
      text: inputText.trim(),
      isOwn: true,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    onSendMessage?.({ ...newMsg, tempId });
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    // The component acts as a flexible container that fills its parent, matching the sidebar's structure
    <article className="flex flex-col h-screen w-full min-w-0 bg-white text-slate-900 sm:border sm:border-slate-200 sm:shadow-sm dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">


      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-white/80 p-4 px-5 backdrop-blur-md z-10 dark:border-slate-800 dark:bg-slate-950/80">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-700 transition hover:opacity-80 dark:bg-indigo-900 dark:text-indigo-200 ${focus}`}
        >
          {recipient.initials}
          {recipient.isOnline && (
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight">{recipient.name}</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {recipient.isOnline && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            {recipient.isOnline ? "Online" : "Offline"}
          </div>
        </div>

        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium tracking-wide text-slate-500 sm:block dark:border-slate-800 dark:bg-slate-900/50">
          Direct message
        </span>

        <button
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
          className={`grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${focus} ${showDetails ? "bg-slate-100 text-slate-700 dark:bg-slate-800" : ""}`}
        >
          <Icon name="more" className="h-5 w-5" />
        </button>
      </header>

      {/* Scrollable Conversation */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-slate-50/50 p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:bg-slate-900/20 dark:scrollbar-thumb-slate-800"
      >
        <div className="mx-auto mb-8 max-w-xs text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400 before:mr-4 before:inline-block before:w-8 before:-translate-y-1 before:border-t before:border-slate-200 after:ml-4 after:inline-block after:w-8 after:-translate-y-1 after:border-t after:border-slate-200 dark:before:border-slate-800 dark:after:border-slate-800">
          Today
        </div>

        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Icon name="chat" className="h-6 w-6" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">A little space for you two.</h2>
          <p className="mt-1 text-xs text-slate-500">You’re connected with {recipient.name.split(' ')[0]}. Say something nice.</p>
        </div>

        <div className="flex flex-col gap-5 pb-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2.5 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
              {!msg.isOwn && (
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-100 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                  {recipient.initials}
                </div>
              )}
              <div className={`max-w-[75%] sm:max-w-[65%] ${msg.isOwn ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                <div
                  className={`whitespace-pre-wrap break-words px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${msg.isOwn
                    ? "rounded-2xl rounded-br-sm bg-indigo-600 text-white dark:bg-indigo-500"
                    : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                >
                  {msg.text}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
                  {msg.time}
                  {msg.isOwn && <Icon name="check" className="h-3 w-3 text-indigo-400" strokeWidth="2.5" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer Footer */}
      <footer className="shrink-0 bg-white p-4 sm:px-5 sm:py-4 dark:bg-slate-950">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-900"
        >
          <button
            type="button"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 ${focus}`}
          >
            <Icon name="smile" className="h-[22px] w-[22px]" />
          </button>

          <textarea
            ref={inputRef}
            rows="1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${recipient.name.split(' ')[0]}...`}
            className="flex-1 resize-none bg-transparent py-2 text-[13px] text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`flex h-9 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${focus}`}
          >
            <span className="hidden sm:inline">Send</span>
            <Icon name="send" className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2.5 hidden justify-between px-2 text-[10px] text-slate-400 sm:flex">
          <span><strong>Enter</strong> to send &middot; <strong>Shift + Enter</strong> for a new line</span>
          <span>End-to-end encrypted</span>
        </div>
      </footer>

      {/* Details Slide-over / Popover */}
      {showDetails && (
        <aside className="absolute bottom-0 right-0 top-0 z-20 w-full max-w-[320px] overflow-y-auto border-l border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold">Conversation details</h3>
            <button
              onClick={() => setShowDetails(false)}
              className={`grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 ${focus}`}
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
              {recipient.initials}
            </div>
            <h2 className="text-lg font-bold tracking-tight">{recipient.name}</h2>
            <p className="mt-1 text-xs text-slate-500">{recipient.bio}</p>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6 text-[11px] dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <strong className="font-medium text-slate-700 dark:text-slate-200">{recipient.email}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <strong className="font-medium text-emerald-600 dark:text-emerald-400">{recipient.status}</strong>
            </div>
          </div>
        </aside>
      )}

    </article>
  );
}