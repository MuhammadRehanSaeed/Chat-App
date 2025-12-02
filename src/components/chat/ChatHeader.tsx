import { ArrowLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  selectedUser: string | null;
  isConnected: boolean;
  onBack?: () => void;
}

const ChatHeader = ({ selectedUser, isConnected, onBack }: ChatHeaderProps) => {
  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center gap-4">
      {selectedUser && onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}

      <div className="flex items-center gap-3 flex-1">
        {selectedUser ? (
          <>
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {selectedUser.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-online-status border-2 border-card" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{selectedUser}</h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-2">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Global Chat</h2>
              <p className="text-xs text-muted-foreground">Public conversation</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-online-status" : "bg-offline-status"
          )}
        />
        <span className="text-xs text-muted-foreground">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
