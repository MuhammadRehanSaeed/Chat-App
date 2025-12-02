import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "@/hooks/useWebSocket";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { Message } from "@/types/chat";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    if (!username || !token) {
      navigate("/login");
    }
  }, [username, token, navigate]);

  const { sendMessage, isConnected } = useWebSocket({
    token: token || "",
    username: username || "",
    onMessage: (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    },
    onUsersUpdate: (users) => {
      console.log("Online users updated in Chat:", users);
      setOnlineUsers(users);
    },
  });

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    if (selectedUser) {
      // Private message - backend will send confirmation
      sendMessage(content, "private", selectedUser);
    } else {
      // Global message - backend will broadcast it back to us
      sendMessage(content, "global");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const filteredMessages = selectedUser
    ? messages.filter(
        (msg) =>
          // Show messages where we are talking to the selected user
          (msg.sender === selectedUser && msg.recipient === username) ||
          (msg.sender === username && msg.recipient === selectedUser) ||
          // Also show confirmations for this conversation
          (msg.type === "confirmation" && msg.recipient === selectedUser)
      )
    : messages.filter((msg) => 
        // In global chat, only show messages without recipients (global messages)
        msg.type === "message" && !msg.recipient
      );

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        currentUser={username || ""}
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedUser={selectedUser}
          isConnected={isConnected}
          onBack={() => setSelectedUser(null)}
        />
        
        <ChatMessages
          messages={filteredMessages}
          currentUser={username || ""}
        />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default Chat;
