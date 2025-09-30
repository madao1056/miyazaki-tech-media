import { supabase } from "./supabase";
import type { Bookmark } from "./types";

export const addBookmark = async (articleId: string): Promise<Bookmark> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("認証が必要です");

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, article_id: articleId })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // 重複エラー
      throw new Error("既にブックマーク済みです");
    }
    throw error;
  }

  return data;
};

export const removeBookmark = async (articleId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("認証が必要です");

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("article_id", articleId);

  if (error) throw error;
};

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const isBookmarked = async (articleId: string): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (error) {
    console.error("ブックマーク確認エラー:", error);
    return false;
  }

  return !!data;
};
