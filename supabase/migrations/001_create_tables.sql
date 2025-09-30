-- プロフィールテーブル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ブックマークテーブル
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 著者フォローテーブル
CREATE TABLE author_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, author_id)
);

-- 閲覧履歴テーブル
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Phase 2用（準備のみ）
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE article_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- インデックス作成
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_article ON bookmarks(article_id);
CREATE INDEX idx_author_follows_user ON author_follows(user_id);
CREATE INDEX idx_author_follows_author ON author_follows(author_id);
CREATE INDEX idx_reading_history_user ON reading_history(user_id);
CREATE INDEX idx_reading_history_article ON reading_history(article_id);
CREATE INDEX idx_reading_history_last_read ON reading_history(last_read_at DESC);
CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_article_likes_user ON article_likes(user_id);
CREATE INDEX idx_article_likes_article ON article_likes(article_id);