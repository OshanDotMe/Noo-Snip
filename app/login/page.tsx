"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, KeyRound, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vaultPin, setVaultPin] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
  
    if (vaultPin.length !== 6 || isNaN(Number(vaultPin))) {
      toast.error("Security PIN must be exactly 6 digits!");
      setLoading(false);
      return;
    }
  
    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });
  
        if (authError) throw authError;
  
        if (authData.user) {
          const { error: profileError } = await supabase.from("user_profiles").insert([
            {
              id: authData.user.id,
              email: cleanEmail,
              vault_pin: vaultPin,
            },
          ]);
  
          if (profileError) throw profileError;
  
          toast.success("Account created & verified with Security PIN!");
          router.push("/");
        }
      } else {
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
  
        if (loginError) throw loginError;
        if (authData.user) {
          const { data: profile, error: pinError } = await supabase
            .from("user_profiles")
            .select("vault_pin")
            .eq("id", authData.user.id)
            .single();
  
          if (pinError || profile?.vault_pin !== vaultPin) {
            await supabase.auth.signOut();
            toast.error("Invalid 6-Digit Vault PIN Code!");
            setLoading(false);
            return;
          }
        }
  
        toast.success("Access Granted to SnippetVault!");
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">{isSignUp ? "Create Vault Account" : "Vault Access"}</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Set up instant 6-digit PIN verification" : "Enter email, password & 6-digit Security PIN"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email Address"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
            <Input
              type="password"
              maxLength={6}
              placeholder="6-Digit Vault Security PIN"
              className="pl-9 tracking-widest font-mono"
              value={vaultPin}
              onChange={(e) => setVaultPin(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
            {loading ? "Verifying Vault Key..." : isSignUp ? "Create Account & Verify" : "Unlock Vault"}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Unlock Vault" : "Need an account? Create one with Security PIN"}
          </button>
        </div>
      </div>
    </div>
  );
}