"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useCallback } from "react";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  addresses: any[];
  loyaltyPoints: number;
  referralCode: string | null;
  role: string;
};

export function useAuth() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loading = status === "loading";
  const user = session?.user ?? null;

  const fetchProfile = useCallback(async () => {
    if (!session?.user) return;
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) setProfile(await res.json());
    } catch { /* ignore */ } finally {
      setProfileLoading(false);
    }
  }, [session?.user]);

  async function handleSignIn(email: string, password: string) {
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) throw new Error("Неверный email или пароль");
  }

  async function handleSignUp(email: string, password: string, name: string) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Ошибка регистрации");
    }
    await handleSignIn(email, password);
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    setProfile(null);
  }

  async function resetPassword(email: string) {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Ошибка сброса пароля");
  }

  async function updateProfile(updates: Partial<Profile>) {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Ошибка обновления профиля");
    setProfile(await res.json());
  }

  return {
    user, profile, loading: loading || profileLoading,
    signIn: handleSignIn, signUp: handleSignUp, signOut: handleSignOut,
    resetPassword, updateProfile, fetchProfile,
  };
}
