"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useHandleLogout } from "./handleLogout";





const lastMessage = '';


const paths = {
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  user: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  settings: "M4 7h16M4 17h16M8 4v6M16 14v6",
  logout: "M10 4H4v16h6M9 12h12m-4-4 4 4-4 4",
  edit: "m16 3 5 5-12 12-6 1 1-6Zm-3 3 5 5",
  mail: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm-2 2 9 6 9-6",
  pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0ZM14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  copy: "M10 8h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2ZM16 8V3H3v13h5",
  arrow: "m9 6 6 6-6 6",
  search: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
  plus: "M12 4.5v15m7.5-7.5h-15",
  close: "m6 6 12 12M18 6 6 18",
  chat: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3h2a8.5 8.5 0 0 1 8.5 8.5Z",
};

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function Detail({ icon, label, value, children }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} className="h-[18px] w-[18px] shrink-0 text-slate-400" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="mt-1 break-words text-[13px] font-medium text-slate-600 dark:text-slate-300">
          {value || "Not set"}
        </p>
      </div>
      {children}
    </div>
  );
}

export default function Sidebar({
  onSelectChat,
  homeHref = "#",
  profileHref = "#",

}) {
  const handleLogout = useHandleLogout();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

   const handleSelectChat = (chat) => {
    console.log(chat);
    setActiveChatId(chat.id); 
    onSelectChat?.(chat);     
  };

  const fetchChats = async () => {
    const session = JSON.parse(localStorage.getItem("supabaseSession") || "{}");
    const accessToken = session?.access_token;
    const refreshToken = session?.refresh_token;

    try {
      const res = await fetch("https://helio-aiqr.onrender.com/detail/friends", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData.error); // log it in console
        throw new Error(errorData.error || "Failed to load Chats");
      }

      const data = await res.json();
      console.log("Fetched chats:", data);


      const CHATS = data.map((chatroom) => ({
        id: chatroom.id,
        user: {
          name: chatroom.other_user.username,
          handle: chatroom.other_user.email.split("@")[0],
          initials: chatroom.other_user.username
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join(""),
          available: chatroom.other_user.available,
          avatarUrl: chatroom.other_user.profile_url || "",
          bio: chatroom.other_user.bio,
        },
        lastMessage: lastMessage || "Something good. Let’s start here ✨",
        
        unreadCount: 0,
      }));

      setChats(CHATS);

    } catch (err) {
      console.error("Fetch failed:", (err).message);
    }

  };

  useEffect(() => {
    fetchChats();
  }, []);

  const [activeTab, setActiveTab] = useState("home");


  const [profile, setProfile] = useState(() => ({

  }));

  useEffect(() => {
    const fetchProfile = async () => {
      const session = JSON.parse(localStorage.getItem("supabaseSession") || "{}");
      const accessToken = session?.access_token;
      const refreshToken = session?.refresh_token;



      try {
        const res = await fetch("https://helio-aiqr.onrender.com/api/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        });

        if (!res.ok) {
          const errorData = await res.json(); // read backend error
          console.error("Backend error:", errorData.error); // log it in console
          throw new Error(errorData.error || "Failed to load profile");
        }

        const data = await res.json();

        setProfile(data.data[0]);
      } catch (err) {
        console.error("Fetch failed:", (err).message);
      }
    };

    fetchProfile();
  }, []);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Search & New Chat state inside Home view
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const initials = (profile.name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  // Filter chats by search input
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.user.name.toLowerCase().includes(q) ||
        chat.user.handle.toLowerCase().includes(q)
    );
  }, [chats, searchQuery]);

  async function saveProfile(nextProfile) {
    const session = JSON.parse(localStorage.getItem("supabaseSession") || "{}");
    const accessToken = session?.access_token;
    const refreshToken = session?.refresh_token;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      // Send data to your backend API
      const response = await fetch("https://helio-aiqr.onrender.com/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
        body: JSON.stringify(nextProfile),
      });

      if (!response.ok) {
        const errorData = await response.json(); // read backend error
        console.error("Backend error:", errorData.error); // log it in console
        throw new Error(errorData.error || "Failed to save profile");
      }


      const updatedProfile = await response.json();


      setProfile(updatedProfile[0]);
      setEditing(false);
      setNotice("Profile updated successfully.");
    } catch (error) {
      setError("Couldn't save your changes. Please try again. ");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function handleSubmitProfile(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get("username") || "").trim();

    if (!username) {
      setError("Please enter your name.");
      return;
    }

    saveProfile({
      ...profile,
      username,
      bio: String(data.get("bio") || "").trim(),
    });
  }

  async function copyEmail() {
    setNotice("");
    try {
      await navigator.clipboard.writeText(profile.email);
      setNotice("Email address copied.");
    } catch {
      setNotice(`Copy manually: ${profile.email}`);
    }
  }

  async function handleCreateChat(e) {
    e.preventDefault();
    if (!newUserName) return;

    const session = JSON.parse(localStorage.getItem("supabaseSession") || "{}");
    const accessToken = session?.access_token;
    const refreshToken = session?.refresh_token;

    try {
      
      const response = await fetch("https://helio-aiqr.onrender.com/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
        body: JSON.stringify({ username: newUserName }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error("Backend error:", errorData.error); 
        throw new Error(errorData.error || "Failed to create profile");
      }

      const chatsResponse = await fetch("https://helio-aiqr.onrender.com/detail/friends", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });
      const chatsData = await chatsResponse.json();

      
      const CHATS = chatsData.map((chatroom) => ({
        id: chatroom.id,
        user: {
          name: chatroom.other_user.username,
          handle: chatroom.other_user.email.split("@")[0],
          initials: chatroom.other_user.username
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join(""),
          available: chatroom.other_user.available,
          avatarUrl: chatroom.other_user.profile_url || "",
          bio: chatroom.other_user.bio,
        },
        lastMessage: "Something good. Let’s start here ✨",
        
        unreadCount: 0,
      }));

      
      setChats(CHATS);


    }
    catch (err) {
      setError("Couldn't Find the User");
      console.error(err);
    }

    setNewUserName("");
    setShowAddModal(false);
  }

  const navigation = [
    { id: "home", icon: "home", label: "Chats", href: homeHref },
    { id: "profile", icon: "user", label: "Profile", href: profileHref },

  ];

  return (
    <aside
      aria-label="Main navigation and sidebar"
      className="flex h-[100dvh] w-full shrink-0 border-r border-slate-200 bg-white text-slate-900 sm:w-[400px] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Navigation rail */}
      <nav
        aria-label="Main navigation"
        className="flex w-16 shrink-0 flex-col items-center gap-3 border-r border-slate-200 bg-slate-50 py-6 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          aria-label="App home"
          className={`mb-6  h-10 w-10 place-items-center`}
        >
          <img src="/icons/Logo.png" alt="" />
        </button>

        {navigation.map(({ id, icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              title={label}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={`grid h-10 w-10 place-items-center rounded-xl transition ${focus} ${isActive
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                : "text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
            >
              <Icon name={icon} />
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handleLogout()}
          title="Log out"
          aria-label="Log out"
          className={`mt-auto grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 ${focus}`}
        >
          <Icon name="logout" />
        </button>
      </nav>

      {/* Main Panel Content */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">

        {/* VIEW 1: CHATS LIST (Home) */}
        {activeTab === "home" && (
          <>
            <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
              <h2 className="text-sm font-semibold">Messages</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 ${focus}`}
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
                <span>New chat</span>
              </button>
            </header>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Icon
                  name="search"
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations or users..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Modal to add new user */}
            {showAddModal && (
              <form
                onSubmit={handleCreateChat}
                className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/20"
              >
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter name or username..."
                  autoFocus
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newUserName.trim()}
                  className={`rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 ${focus}`}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ${focus}`}
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Chat List */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-1">
              {filteredChats.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No conversations found.
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isSelected = activeChatId === chat.id;
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => handleSelectChat(chat)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition ${focus} ${isSelected
                        ? "bg-indigo-50/80 text-indigo-950 dark:bg-indigo-500/10 dark:text-indigo-100"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                        }`}
                    >
                      {/* Avatar */}
                      <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {chat.user.avatarUrl ? (
                          <img
                            src={chat.user.avatarUrl}
                            alt=""
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          chat.user.initials
                        )}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 ${chat.user.available ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {chat.user.name}
                          </h3>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {chat.time}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {chat.lastMessage}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {chat.unreadCount > 0 && (
                        <span className="grid h-4 min-w-[16px] shrink-0 place-items-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                          {chat.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* VIEW 2: PROFILE VIEW (Matches your existing ProfileSidebar) */}
        {activeTab === "profile" && (
          <>
            <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
              <h2 className="text-sm font-semibold">Your profile</h2>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-medium uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                Personal
              </span>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="relative h-[105px] overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-500 to-violet-400">
                <span className="absolute left-6 top-5 text-[9px] font-semibold tracking-[0.24em] text-indigo-100">
                  A LITTLE MORE YOU.
                </span>
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-40 h-56 w-56 rounded-full border border-white/20"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-24 -top-48 h-72 w-72 rounded-full border border-white/15"
                />
              </div>

              <div className="px-5 pb-6">
                <div className="relative -mt-9 flex items-end justify-between gap-3">
                  <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-[26px] bg-indigo-100 text-2xl font-bold tracking-tight text-indigo-700 ring-[5px] ring-white dark:bg-indigo-950 dark:text-indigo-300 dark:ring-slate-950">
                    {profile.profile_url ? (
                      <img
                        src={profile.profile_url}
                        alt=""
                        width={80}
                        height={80}
                        className="h-full w-full rounded-[26px] object-cover"
                      />
                    ) : (
                      initials
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full border-[3px] border-white dark:border-slate-950 ${profile.available ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    aria-expanded={editing}
                    onClick={() => {
                      setEditing(!editing);
                      setError("");
                      setNotice("");
                    }}
                    className={`mb-1 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 ${focus}`}
                  >
                    <Icon name="edit" className="h-3.5 w-3.5" />
                    {editing ? "Cancel" : "Edit profile"}
                  </button>
                </div>

                {editing ? (
                  <form onSubmit={handleSubmitProfile} className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      Edit your profile
                    </h3>

                    <fieldset disabled={saving} className="space-y-4">
                      <label className="block text-xs font-medium text-slate-500">
                        Display name
                        <input
                          name="username"
                          autoComplete="username"
                          defaultValue={profile.username}
                          maxLength={50}
                          required
                          className={inputClass}
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-500">
                        Bio
                        <textarea
                          name="bio"
                          defaultValue={profile.bio}
                          maxLength={160}
                          rows={4}
                          className={`${inputClass} resize-y`}
                        />
                      </label>



                      <button
                        type="submit"
                        className={`w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60 ${focus}`}
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                    </fieldset>
                  </form>
                ) : (
                  <>
                    <h1 className="mt-5 break-words text-2xl font-bold tracking-tight">
                      {profile.username}
                    </h1>

                    <p className="mb-6 mt-4 whitespace-pre-line break-words text-[13px] leading-6 text-slate-500 dark:text-slate-400">
                      {profile.bio}
                    </p>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={profile.available}
                      aria-label="Available for messages"
                      disabled={saving}
                      onClick={() =>
                        saveProfile({
                          ...profile,
                          available: !profile.available,
                        })
                      }
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition disabled:cursor-wait disabled:opacity-60 ${focus} ${profile.available
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${profile.available ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                      />
                      <span className="flex-1">
                        <span className="block text-xs font-semibold">
                          {profile.available
                            ? "Available for messages"
                            : "Currently away"}
                        </span>
                        <span className="mt-1 block text-[10px] opacity-70">
                          {profile.available
                            ? "Let your team know you’re around"
                            : "Taking a little breathing room"}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-1 ${profile.available ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full bg-white transition-transform ${profile.available ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                      </span>
                    </button>

                    <h3 className="mb-5 mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Personal details
                    </h3>

                    <div className="space-y-5">
                      <Detail icon="mail" label="Email address" value={profile.email}>
                        <button
                          type="button"
                          onClick={copyEmail}
                          aria-label="Copy email address"
                          title="Copy email address"
                          className={`rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 ${focus}`}
                        >
                          <Icon name="copy" className="h-4 w-4" />
                        </button>
                      </Detail>

                    </div>
                  </>
                )}

                {error && (
                  <p role="alert" className="mt-4 text-xs leading-5 text-rose-500">
                    {error}
                  </p>
                )}
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-4 break-words text-xs leading-5 text-indigo-500 empty:hidden dark:text-indigo-400"
                >
                  {notice}
                </p>
              </div>
            </div>
          </>
        )}



      </section>
    </aside>
  );
}