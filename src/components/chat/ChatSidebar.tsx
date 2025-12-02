import { MessageSquare, LogOut, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  currentUser: string;
  onlineUsers: string[];
  selectedUser: string | null;
  onSelectUser: (user: string | null) => void;
  onLogout: () => void;
}

const ChatSidebar = ({
  currentUser,
  onlineUsers,
  selectedUser,
  onSelectUser,
  onLogout,
}: ChatSidebarProps) => {
  // Filter out current user from online users
  const otherUsers = onlineUsers.filter(user => user !== currentUser);

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-sidebar-primary p-2">
            <MessageSquare className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-sidebar-foreground">ChatConnect</h2>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
              {currentUser.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {currentUser}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-online-status" />
              <p className="text-xs text-sidebar-accent-foreground">Online</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto py-3 px-3",
                  !selectedUser && "bg-sidebar-accent"
                )}
                onClick={() => onSelectUser(null)}
              >
                <Globe className="w-5 h-5 text-sidebar-accent-foreground" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sidebar-foreground">Global Chat</p>
                  <p className="text-xs text-sidebar-accent-foreground">Everyone can see</p>
                </div>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3">
                <Users className="w-4 h-4 text-sidebar-accent-foreground" />
                <h3 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wider">
                  Direct Messages
                </h3>
              </div>
              
              {otherUsers.length === 0 ? (
                <p className="text-sm text-sidebar-accent-foreground px-3 py-2">
                  No other users online
                </p>
              ) : (
                <div className="space-y-1">
                  {otherUsers.map((user) => (
                    <Button
                      key={user}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3 px-3",
                        selectedUser === user && "bg-sidebar-accent"
                      )}
                      onClick={() => onSelectUser(user)}
                    >
                      <div className="relative">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary font-semibold">
                            {user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-online-status border-2 border-sidebar" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-sidebar-foreground truncate">{user}</p>
                        <p className="text-xs text-sidebar-accent-foreground">Online</p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
