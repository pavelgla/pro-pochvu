"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

type AuthState = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
};

// Mock profile for when Supabase is not connected
function mockProfile(user: User): Profile {
  return {
    id: user.id,
    user_id: user.id,
    name: user.user_metadata?.name || null,
    phone: null,
    addresses: [],
    loyalty_points: 0,
    referral_code: null,
    referred_by: null,
    role: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        return data as Profile | null;
      } catch {
        return null;
      }
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          const profile = (await fetchProfile(session.user.id)) || mockProfile(session.user);
          setState({ user: session.user, profile, loading: false });
        } else {
          setState({ user: null, profile: null, loading: false });
        }
      } catch {
        if (mounted) setState({ user: null, profile: null, loading: false });
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = (await fetchProfile(session.user.id)) || mockProfile(session.user);
        setState({ user: session.user, profile, loading: false });
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;

    // Create profile
    if (data.user) {
      await supabase.from("profiles").insert({
        user_id: data.user.id,
        name,
        role: "customer",
      });
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, loading: false });
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    });
    if (error) throw error;
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!state.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", state.user.id);
    if (error) throw error;
    setState((s) => ({
      ...s,
      profile: s.profile ? { ...s.profile, ...updates } : null,
    }));
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };
}
