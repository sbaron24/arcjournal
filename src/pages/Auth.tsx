import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = authSchema.parse({ email, password });
      setIsLoading(true);

      const { error } = isLogin
        ? await signIn(validated.email, validated.password)
        : await signUp(validated.email, validated.password);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: "Success",
          description: "Account created! Please check your email to confirm.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-mystic/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-celestial/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gold to-gold" />
            <Sparkles className="w-8 h-8 text-gold" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-gold to-gold" />
          </div>
          <h1 className="font-serif text-4xl text-foreground mb-2">
            {isLogin ? "Welcome Back" : "Begin Your Journey"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Sign in to access your reflections"
              : "Create an account to save your tarot journey"}
          </p>
        </div>

        <Card className="border-mystic/30">
          <CardHeader>
            <CardTitle>{isLogin ? "Sign In" : "Sign Up"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to continue"
                : "Create your account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={100}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-mystic hover:text-gold transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
