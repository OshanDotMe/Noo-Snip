"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if(isSignUp){
      const {error} = await supabase.auth.signUp({email, password});
      if (error) toast.error(error.message);
      else toast.success("Verfication link sent to your email!");
    }else{
      const {error} = await supabase.auth.signInWithPassword({email, password});
      if (error) toast.error(error.message);
      else{
        toast.success("Logged in successfully!");
        router.push("/");
      }
    }
    setLoading(false);
  };

  return(
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleAuth} className="w-full max-w-md p-6 bg-card border border-border rounded-xl space-y-4">
        <h1 className="text-2xl font-bold text-center">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <p className="text-center text-xs text-muted-foreground cursor-pointer hover:underline" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}