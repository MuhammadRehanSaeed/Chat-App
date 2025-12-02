import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, Shield, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block rounded-full bg-primary/10 p-4 mb-4">
            <MessageSquare className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Welcome to ChatConnect
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time messaging powered by WebSocket technology. 
            Connect instantly with friends and colleagues through global or private chats.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="text-lg px-8"
            >
              Get Started
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-3 p-6 rounded-xl bg-card border border-border">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Real-time</h3>
              <p className="text-sm text-muted-foreground">
                Instant message delivery with WebSocket technology for seamless communication
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-card border border-border">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Secure</h3>
              <p className="text-sm text-muted-foreground">
                JWT-based authentication ensures your conversations stay private and secure
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-card border border-border">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Flexible</h3>
              <p className="text-sm text-muted-foreground">
                Switch between global chat rooms and private one-on-one conversations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
