import { supabase } from "./supabase";
import type { AuthorFollow } from "./types";

export const followAuthor = async (authorId: string): Promise<AuthorFollow> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("認証が必要です");

  const { data, error } = await supabase
    .from("author_follows")
    .insert({ user_id: user.id, author_id: authorId })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // 重複エラー
      throw new Error("既にフォロー済みです");
    }
    throw error;
  }

  return data;
};

export const unfollowAuthor = async (authorId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("認証が必要です");

  const { error } = await supabase
    .from("author_follows")
    .delete()
    .eq("user_id", user.id)
    .eq("author_id", authorId);

  if (error) throw error;
};

export const getFollowedAuthors = async (): Promise<AuthorFollow[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("author_follows")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const isFollowingAuthor = async (authorId: string): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("author_follows")
    .select("id")
    .eq("user_id", user.id)
    .eq("author_id", authorId)
    .maybeSingle();

  if (error) {
    console.error("フォロー確認エラー:", error);
    return false;
  }

  return !!data;
};
