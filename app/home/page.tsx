"use client";

import AuthCheck from "../Components/authCheck";
import { useState } from "react";
import ProfileSidebar from "../Components/sidebarProfile";
import Chat from "../Components/chat";

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<{
  name: string;
  email: string;
  initials: string;
  status: string;
  isOnline: boolean;
  avatarUrl: string;
  bio: string;
} | null>(null);

interface ChatData {
  user: {
    name: string;
    handle: string;
    initials: string;
    available: boolean;
    avatarUrl: string;
    bio: string;
  };
  id: string
}

const handleSelectChat = (chat: ChatData) => {
  const participant = {
    chatroom_id : chat.id,
    name: chat.user.name,
    email: `${chat.user.handle}@example.com`,
    initials: chat.user.initials,
    status: chat.user.available ? "Available" : "Offline",
    isOnline: chat.user.available,
    avatarUrl: chat.user.avatarUrl,
    bio: chat.user.bio,
  };
  setSelectedChat(participant);
};




  return (
    <AuthCheck>
      <div className="flex">
        <ProfileSidebar onSelectChat={handleSelectChat} />
        <main className="flex-1">
          {selectedChat ? (
            <Chat recipient={selectedChat} />
          ) : (
            <p className="text-gray-500 p-8">Select a chat to start messaging</p>
          )}
        </main>
      </div>
    </AuthCheck>
  );
}
