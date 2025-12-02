import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  selectedUser: string | null;
}

const ChatInput = ({ onSendMessage, disabled, selectedUser }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              selectedUser
                ? `Message ${selectedUser}...`
                : "Type a message to everyone..."
            }
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {selectedUser && (
          <p className="text-xs text-muted-foreground mt-2">
            Sending a private message to {selectedUser}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
