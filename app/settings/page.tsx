"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { User, Save, LogOut, Loader2, CheckCircle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 sm:p-6 md:p-8 max-w-4xl space-y-6 sm:space-y-8 w-full mx-auto">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your profile preferences and account settings
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center sm:justify-start">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading settings...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border border-border rounded-xl p-4 sm:p-6 bg-card space-y-5 sm:space-y-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <User className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h2 className="text-base font-semibold">Profile Information</h2>
                    <p className="text-xs text-muted-foreground">
                      Update your name and personal profile details.
                    </p>
                  </div>
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      message.type === "success"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">First Name</label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="text-base sm:text-sm h-10 sm:h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Last Name</label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="text-base sm:text-sm h-10 sm:h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Email Address</label>
                    <Input
                      value={email}
                      disabled
                      className="bg-muted opacity-70 cursor-not-allowed text-base sm:text-sm h-10 sm:h-9"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Email address is linked to your authentication account and cannot be changed here.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={saving} className="w-full sm:w-auto gap-2 h-10 sm:h-9 text-sm">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
              <div className="border border-border rounded-xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <Shield className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h2 className="text-base font-semibold">Account Actions</h2>
                    <p className="text-xs text-muted-foreground">
                      Session management and logout options.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div>
                    <p className="text-sm font-medium">Sign Out</p>
                    <p className="text-xs text-muted-foreground">
                      Log out from your current session on this browser.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full sm:w-auto gap-2 h-10 sm:h-9 text-xs sm:text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}