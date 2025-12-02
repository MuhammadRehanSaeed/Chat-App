import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { Message, WebSocketMessage } from "@/types/chat";
import { buildWebSocketUrl } from "@/config/backend";

interface UseWebSocketProps {
  token: string;
  username: string;
  onMessage: (message: Message) => void;
  onUsersUpdate?: (users: string[]) => void;
}

export const useWebSocket = ({ token, username, onMessage, onUsersUpdate }: UseWebSocketProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const onMessageRef = useRef(onMessage);
  const onUsersUpdateRef = useRef(onUsersUpdate);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onMessageRef.current = onMessage;
    onUsersUpdateRef.current = onUsersUpdate;
  }, [onMessage, onUsersUpdate]);

  const connect = useCallback(() => {
    if (!token || !username) return;
    
    // Prevent multiple connections
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const socket = new WebSocket(buildWebSocketUrl(token));
      
      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "You are now connected to the chat",
        });
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log("Received message:", data);

          if (data.type === "message") {
            const message: Message = {
              id: Date.now().toString(),
              sender: data.from || "Unknown",
              message: data.message || "",
              timestamp: data.timestamp || new Date().toISOString(),
              type: "message",
            };
            
            onMessageRef.current(message);

            // Show notification if it's from another user
            if (data.from !== username && data.notification) {
              toast({
                title: `New message from ${data.from}`,
                description: data.message?.substring(0, 50) + (data.message && data.message.length > 50 ? "..." : ""),
              });
            }
          } else if (data.type === "private_message") {
            // Handle private messages from backend
            const message: Message = {
              id: Date.now().toString(),
              sender: data.from || "Unknown",
              message: data.message || "",
              timestamp: data.timestamp || new Date().toISOString(),
              type: "message",
              recipient: username, // This is a private message TO us
            };
            
            onMessageRef.current(message);

            // Show notification for private message
            if (data.notification) {
              toast({
                title: `Private message from ${data.from}`,
                description: data.message?.substring(0, 50) + (data.message && data.message.length > 50 ? "..." : ""),
              });
            }
          } else if (data.type === "confirmation") {
            const message: Message = {
              id: Date.now().toString(),
              sender: username,
              message: data.message || "",
              timestamp: new Date().toISOString(),
              type: "confirmation",
              recipient: data.to,
            };
            onMessageRef.current(message);
          } else if (data.type === "online_users") {
            // Handle online users update from backend
            const users = (data as any).users || [];
            console.log("Online users updated:", users);
            setOnlineUsers(users);
            onUsersUpdateRef.current?.(users);
          } else if (data.type === "error") {
            // Handle error messages from backend
            toast({
              title: "Error",
              description: data.message || "An error occurred",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({
          title: "Connection error",
          description: "Failed to connect to chat server",
          variant: "destructive",
        });
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 3000);
      };

      ws.current = socket;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
    }
  }, [token, username]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, username]); // Only reconnect when token or username changes

  const sendMessage = useCallback((message: string, type: "global" | "private" = "global", recipient?: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Not connected",
        description: "Cannot send message. Please wait for connection.",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      message,
      type,
    };

    if (type === "private" && recipient) {
      payload.recipient = recipient;
    }

    ws.current.send(JSON.stringify(payload));
    console.log("Sent message:", payload);
  }, []);

  return {
    sendMessage,
    isConnected,
    onlineUsers,
  };
};
