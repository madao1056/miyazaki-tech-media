import { supabase } from "./supabase";
import type { ReadingHistory } from "./types";

export const trackArticleView = async (articleId: string): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // ログインしていない場合は記録しない

    const { error } = await supabase.from("reading_history").upsert(
      {
        user_id: user.id,
        article_id: articleId,
        last_read_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,article_id",
        ignoreDuplicates: false,
      },
    );

    if (error) {
      console.error("閲覧履歴記録エラー:", error);
    }
  } catch (error) {
    console.error("閲覧履歴記録中のエラー:", error);
  }
};

export const getReadingHistory = async (
  limit = 20,
): Promise<ReadingHistory[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reading_history")
    .select("*")
    .eq("user_id", user.id)
    .order("last_read_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("閲覧履歴取得エラー:", error);
    return [];
  }

  return data || [];
};
