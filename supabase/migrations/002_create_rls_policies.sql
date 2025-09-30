-- RLS有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

-- プロフィールポリシー
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

-- ブックマークポリシー
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks"
ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- 著者フォローポリシー
CREATE POLICY "Users can view own follows"
ON author_follows FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own follows"
ON author_follows FOR ALL USING (auth.uid() = user_id);

-- 閲覧履歴ポリシー
CREATE POLICY "Users can view own history"
ON reading_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own history"
ON reading_history FOR ALL USING (auth.uid() = user_id);

-- コメントポリシー（Phase 2用）
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments"
ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE USING (auth.uid() = user_id);

-- いいねポリシー（Phase 2用）
CREATE POLICY "Likes are viewable by everyone"
ON article_likes FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes"
ON article_likes FOR ALL USING (auth.uid() = user_id);