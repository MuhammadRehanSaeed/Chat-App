import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
  currentUser: string;
}

const ChatMessages = ({ messages, currentUser }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => {
          const isSent = message.sender === currentUser;
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isSent ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                  isSent
                    ? "bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-sm"
                    : "bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-sm"
                )}
              >
                {!isSent && (
                  <p className="text-xs font-semibold mb-1 opacity-80">
                    {message.sender}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.message}
                </p>
                <p
                  className={cn(
                    "text-xs mt-1 opacity-60",
                    isSent ? "text-right" : "text-left"
                  )}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
