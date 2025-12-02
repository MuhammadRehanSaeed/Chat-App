import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { buildApiUrl, BACKEND_CONFIG } from "@/config/backend";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = buildApiUrl(BACKEND_CONFIG.API.LOGIN);
      console.log("Login request to:", url, "with body:", { username, password: "****" });

      // Call your authentication endpoint to get JWT token
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = "Authentication failed";
        try {
          const errorData = await response.json();
          console.log("Login error response body:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch {
          const text = await response.text();
          console.log("Login error raw response:", text);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Login success response body:", data);

      // Your backend wraps the login data inside "data"
      // {
      //   timestamp, status, success, message,
      //   data: { email, token, username }
      // }
      const token = data.data?.token;
      const backendUsername = data.data?.username ?? username;

      if (!token) {
        throw new Error("No token returned from backend");
      }

      // Store token and username from backend
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("username", backendUsername);

      toast({
        title: "Welcome back!",
        description: `Logged in as ${username}`,
      });

      navigate("/chat");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary p-3">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ChatConnect</h1>
          <p className="text-muted-foreground text-center">
            Sign in to start messaging
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Connect with your Spring Boot backend via WebSocket
        </p>
      </Card>
    </div>
  );
};

export default Login;
