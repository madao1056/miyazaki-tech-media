import { supabase } from "./supabase";
import type { Provider } from "@supabase/supabase-js";
import type { Profile } from "./types";

export const signInWithOAuth = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    return profile;
  } catch {
    return null;
  }
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const initializeAuth = async () => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      // ログイン時の処理
      console.log("User signed in:", session.user);
    } else if (event === "SIGNED_OUT") {
      // ログアウト時の処理
      console.log("User signed out");
    }
  });

  return subscription;
};
