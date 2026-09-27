"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, KeyRound, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vaultPin, setVaultPin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              vault_pin: vaultPin,
            },
          },
        });

        if (authError) throw authError;

        toast.success("Account created successfully! Please log in.");
        setIsSignUp(false);
      } else {
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (loginError) throw loginError;

        const savedPin = authData.user?.user_metadata?.vault_pin;

        if (savedPin !== vaultPin) {
          await supabase.auth.signOut();
          toast.error("Invalid 6-Digit Vault PIN Code!");
          setLoading(false);
          return;
        }

        toast.success("Access Granted to NooSnip!");
        router.refresh();
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md p-5 sm:p-8 bg-card border border-border rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{isSignUp ? "Create Vault Account" : "Vault Access"}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isSignUp ? "Set up instant 6-digit PIN verification" : "Enter email, password & 6-digit Security PIN"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="First Name"
                  className="pl-9 text-base sm:text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isSignUp}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Last Name"
                  className="pl-9 text-base sm:text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email Address"
              className="pl-9 text-base sm:text-sm"
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
              className="pl-9 text-base sm:text-sm"
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
              className="pl-9 tracking-widest font-mono text-base sm:text-sm"
              value={vaultPin}
              onChange={(e) => setVaultPin(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium" disabled={loading}>
            {loading ? "Verifying Vault Key..." : isSignUp ? "Create Account & Verify" : "Unlock Vault"}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-primary transition-colors py-1"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Unlock Vault" : "Need an account? Create one with Security PIN"}
          </button>
        </div>
      </div>
    </div>
  );
}