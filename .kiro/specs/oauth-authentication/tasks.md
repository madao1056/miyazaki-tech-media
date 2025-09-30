# Tasks Document: OAuth認証追加

## 実装タスク一覧

このドキュメントは、設計書に基づいた実装タスクの詳細な分解です。各タスクは独立して実装・テスト可能な単位に分割されています。

---

## Phase 0: 環境準備・依存関係

### Task 0.1: Supabaseプロジェクトセットアップ

**優先度**: 🔴 必須（ブロッカー）  
**所要時間**: 30分  
**依存**: なし

#### 作業内容

1. Supabaseアカウント作成・ログイン
2. 新規プロジェクト作成
   - プロジェクト名: `bizmap-auth`
   - リージョン: `Northeast Asia (Tokyo)`
3. プロジェクトURL・APIキーを取得
4. OAuth プロバイダー設定
   - Google OAuth Client ID/Secret登録
   - GitHub OAuth App作成・登録

#### 成果物

- [ ] Supabaseプロジェクト作成完了
- [ ] `PUBLIC_SUPABASE_URL` 取得
- [ ] `PUBLIC_SUPABASE_ANON_KEY` 取得
- [ ] Google OAuth設定完了
- [ ] GitHub OAuth設定完了

#### 参考

- [Supabase Quick Start](https://supabase.com/docs/guides/getting-started)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [GitHub OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-github)

---

### Task 0.2: 環境変数設定

**優先度**: 🔴 必須  
**所要時間**: 10分  
**依存**: Task 0.1

#### 作業内容

1. `.env.local` ファイル作成
2. 環境変数追加
3. Vercel環境変数設定

#### 成果物

```bash
# .env.local
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] ローカル環境変数設定
- [ ] Vercel環境変数設定（Development/Preview/Production）
- [ ] `.gitignore` に `.env.local` 追加確認

---

### Task 0.3: 依存パッケージインストール

**優先度**: 🔴 必須  
**所要時間**: 5分  
**依存**: なし

#### 作業内容

```bash
npm install @supabase/supabase-js
npm install zustand  # 状態管理（オプション）
```

#### 成果物

- [ ] `@supabase/supabase-js` インストール
- [ ] `package.json` 更新
- [ ] `package-lock.json` 更新

---

## Phase 1: バックエンド基盤構築

### Task 1.1: Supabaseデータベーススキーマ作成

**優先度**: 🔴 必須  
**所要時間**: 30分  
**依存**: Task 0.1

#### 作業内容

Supabase SQL Editorで以下を実行：

```sql
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
CREATE INDEX idx_author_follows_user ON author_follows(user_id);
CREATE INDEX idx_reading_history_user ON reading_history(user_id);
CREATE INDEX idx_reading_history_last_read ON reading_history(last_read_at DESC);
```

#### 成果物

- [ ] 全テーブル作成完了
- [ ] インデックス作成完了
- [ ] Supabase Table Editorで確認

---

### Task 1.2: Row Level Security (RLS) 設定

**優先度**: 🔴 必須（セキュリティ）  
**所要時間**: 20分  
**依存**: Task 1.1

#### 作業内容

```sql
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
```

#### 成果物

- [ ] 全テーブルのRLS有効化
- [ ] 全ポリシー作成完了
- [ ] セキュリティテスト実施

---

### Task 1.3: Supabaseトリガー作成（プロフィール自動作成）

**優先度**: 🟡 推奨  
**所要時間**: 15分  
**依存**: Task 1.1

#### 作業内容

```sql
-- 新規ユーザー作成時に自動でプロフィール作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 成果物

- [ ] トリガー関数作成
- [ ] トリガー設定完了
- [ ] 新規ユーザー作成テストで動作確認

---

## Phase 2: 認証ロジック実装

### Task 2.1: Supabaseクライアント設定

**優先度**: 🔴 必須  
**所要時間**: 15分  
**依存**: Task 0.2, Task 0.3

#### 作業内容

**ファイル**: `src/lib/auth/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

#### 成果物

- [ ] `src/lib/auth/supabase.ts` 作成
- [ ] 環境変数バリデーション実装
- [ ] エクスポート確認

---

### Task 2.2: TypeScript型定義作成

**優先度**: 🔴 必須  
**所要時間**: 30分  
**依存**: Task 1.1

#### 作業内容

**ファイル**: `src/lib/auth/types.ts`

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          email: string | null;
          bio: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          email?: string | null;
          bio?: string | null;
          website?: string | null;
        };
        Update: {
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          article_id: string;
        };
        Update: never;
      };
      author_follows: {
        Row: {
          id: string;
          user_id: string;
          author_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          author_id: string;
        };
        Update: never;
      };
      reading_history: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          last_read_at: string;
        };
        Insert: {
          user_id: string;
          article_id: string;
        };
        Update: {
          last_read_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type AuthorFollow =
  Database["public"]["Tables"]["author_follows"]["Row"];
export type ReadingHistory =
  Database["public"]["Tables"]["reading_history"]["Row"];

export interface AuthState {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}
```

#### 成果物

- [ ] `src/lib/auth/types.ts` 作成
- [ ] 全テーブルの型定義完了
- [ ] 型エクスポート確認

---

### Task 2.3: 認証ユーティリティ関数実装

**優先度**: 🔴 必須  
**所要時間**: 45分  
**依存**: Task 2.1, Task 2.2

#### 作業内容

**ファイル**: `src/lib/auth/utils.ts`

```typescript
import { supabase } from "./supabase";
import type { Provider } from "@supabase/supabase-js";

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

export const getCurrentUser = async () => {
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
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};
```

#### 成果物

- [ ] `src/lib/auth/utils.ts` 作成
- [ ] `signInWithOAuth` 実装
- [ ] `signOut` 実装
- [ ] `getCurrentUser` 実装
- [ ] `getSession` 実装

---

### Task 2.4: フィーチャーフラグ設定

**優先度**: 🟢 通常  
**所要時間**: 10分  
**依存**: なし

#### 作業内容

**ファイル**: `src/lib/config/features.ts`

```typescript
export const FEATURES = {
  // Phase 1 (公開)
  AUTH: true,
  BOOKMARKS: true,
  AUTHOR_FOLLOW: true,
  READING_HISTORY: true,
  PERSONALIZED_FEED: true,

  // Phase 2 (非表示)
  COMMENTS: false,
  LIKES: false,
  SHARE_TRACKING: false,
  NOTIFICATIONS: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return FEATURES[feature];
};
```

#### 成果物

- [ ] `src/lib/config/features.ts` 作成
- [ ] フィーチャーフラグ定義完了
- [ ] `isFeatureEnabled` ヘルパー実装

---

## Phase 3: UI コンポーネント実装

### Task 3.1: OAuthプロバイダーアイコン追加

**優先度**: 🟢 通常  
**所要時間**: 15分  
**依存**: なし

#### 作業内容

**ファイル**:

- `src/assets/svgs/google.astro`
- `src/assets/svgs/github.astro`

```astro
<!-- google.astro -->
---
import type { Icon } from "@/lib/types";
interface Props extends Icon {}
const { size = "24", color = "currentColor" } = Astro.props;
---
<svg /* Google SVGパス */></svg>

<!-- github.astro -->
---
import type { Icon } from "@/lib/types";
interface Props extends Icon {}
const { size = "24", color = "currentColor" } = Astro.props;
---
<svg /* GitHub SVGパス */></svg>
```

#### 成果物

- [ ] `src/assets/svgs/google.astro` 作成
- [ ] `src/assets/svgs/github.astro` 作成
- [ ] サイズ・色のprops対応

---

### Task 3.2: 認証モーダルコンポーネント実装

**優先度**: 🔴 必須  
**所要時間**: 45分  
**依存**: Task 2.3, Task 3.1

#### 作業内容

**ファイル**: `src/components/auth/AuthModal.astro`

```astro
---
import GoogleIcon from "@assets/svgs/google.astro";
import GitHubIcon from "@assets/svgs/github.astro";
---

<dialog id="auth_modal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>

    <h3 class="font-bold text-lg mb-4">ログイン</h3>

    <div class="space-y-3">
      <p class="text-sm text-base-content/70">
        ログインすると記事のブックマークや著者フォローができます
      </p>

      <button
        id="google-login-btn"
        class="btn btn-outline w-full justify-start"
        type="button"
      >
        <GoogleIcon size="20" />
        <span>Googleでログイン</span>
      </button>

      <button
        id="github-login-btn"
        class="btn btn-outline w-full justify-start"
        type="button"
      >
        <GitHubIcon size="20" />
        <span>GitHubでログイン</span>
      </button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<script>
  import { signInWithOAuth } from '@/lib/auth/utils';

  document.getElementById('google-login-btn')?.addEventListener('click', async () => {
    try {
      await signInWithOAuth('google');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  });

  document.getElementById('github-login-btn')?.addEventListener('click', async () => {
    try {
      await signInWithOAuth('github');
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  });
</script>
```

#### 成果物

- [ ] `src/components/auth/AuthModal.astro` 作成
- [ ] DaisyUI modal統合
- [ ] OAuth ログインボタン実装
- [ ] エラーハンドリング実装

---

### Task 3.3: 認証ボタンコンポーネント実装

**優先度**: 🔴 必須  
**所要時間**: 30分  
**依存**: Task 2.3

#### 作業内容

**ファイル**: `src/components/auth/AuthButton.astro`

```astro
---
import UserIcon from "@assets/svgs/user.astro";
---

<div id="auth-button-container"></div>

<script>
  import { getCurrentUser } from '@/lib/auth/utils';

  const container = document.getElementById('auth-button-container');

  const renderAuthButton = async () => {
    const user = await getCurrentUser();

    if (!user) {
      // ログアウト状態
      container!.innerHTML = `
        <button
          class="btn btn-ghost btn-circle"
          onclick="auth_modal.showModal()"
          aria-label="Login"
        >
          <svg class="w-6 h-6"><!-- User icon --></svg>
        </button>
      `;
    } else {
      // ログイン状態
      container!.innerHTML = `
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-8 rounded-full">
              <img src="${user.avatar_url || '/default-avatar.jpg'}" alt="${user.display_name}" />
            </div>
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><a href="/my">マイページ</a></li>
            <li><hr class="my-1"></li>
            <li><button id="logout-btn">ログアウト</button></li>
          </ul>
        </div>
      `;

      // ログアウトボタンのイベント設定
      document.getElementById('logout-btn')?.addEventListener('click', async () => {
        const { signOut } = await import('@/lib/auth/utils');
        await signOut();
        window.location.reload();
      });
    }
  };

  renderAuthButton();
</script>
```

#### 成果物

- [ ] `src/components/auth/AuthButton.astro` 作成
- [ ] ログイン/ログアウト状態の切り替え実装
- [ ] ユーザーアバター表示
- [ ] ドロップダウンメニュー実装

---

### Task 3.4: ヘッダーに認証ボタン統合

**優先度**: 🔴 必須  
**所要時間**: 10分  
**依存**: Task 3.2, Task 3.3

#### 作業内容

**ファイル**: `src/components/elements/top-header.astro`

```astro
---
import Search01 from "@/assets/svgs/search-01.astro";
import MenuDropdown from "./menu-dropdown.astro";
import { SITE } from "@/lib/config";
import ThemeController from "../bases/theme-controller.astro";
import SearchModal from "./search-modal.astro";
import AuthButton from "../auth/AuthButton.astro"; // 🆕 追加
import AuthModal from "../auth/AuthModal.astro";   // 🆕 追加
---

<div class="navbar border-b border-primary-content/80 dark:border-primary-content/20">
  <div class="navbar-start lg:w-1/2">
    <MenuDropdown />
    <a class="text-xl px-2 text-nowrap lg:hidden" href="/">{SITE.title}</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <a class="text-xl px-2" href="/">{SITE.title}</a>
  </div>
  <div class="navbar-end">
    <ThemeController />
    <button class="btn btn-ghost btn-circle" onclick="search_modal.showModal()" aria-label="Search">
      <Search01 />
    </button>
    <AuthButton /> <!-- 🆕 認証ボタン追加 -->
  </div>
</div>

<SearchModal />
<AuthModal />   <!-- 🆕 認証モーダル追加 -->
```

#### 成果物

- [ ] `top-header.astro` 更新
- [ ] 認証ボタン配置
- [ ] 認証モーダル配置
- [ ] レイアウト確認

---

## Phase 4: 機能実装（ブックマーク）

### Task 4.1: ブックマークAPI関数実装

**優先度**: 🔴 必須  
**所要時間**: 30分  
**依存**: Task 2.1, Task 2.2

#### 作業内容

**ファイル**: `src/lib/auth/bookmarks.ts`

```typescript
import { supabase } from "./supabase";

export const addBookmark = async (articleId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, article_id: articleId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeBookmark = async (articleId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("article_id", articleId);

  if (error) throw error;
};

export const getBookmarks = async () => {
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
  return data;
};

export const isBookmarked = async (articleId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .single();

  return !!data;
};
```

#### 成果物

- [ ] `src/lib/auth/bookmarks.ts` 作成
- [ ] `addBookmark` 実装
- [ ] `removeBookmark` 実装
- [ ] `getBookmarks` 実装
- [ ] `isBookmarked` 実装

---

### Task 4.2: ブックマークボタンコンポーネント実装

**優先度**: 🔴 必須  
**所要時間**: 45分  
**依存**: Task 4.1

#### 作業内容

**ファイル**: `src/components/auth/BookmarkButton.astro`

```astro
---
interface Props {
  articleId: string;
}

const { articleId } = Astro.props;
---

<button
  id={`bookmark-btn-${articleId}`}
  class="btn btn-ghost btn-sm"
  data-article-id={articleId}
  aria-label="Bookmark"
>
  <svg class="w-5 h-5" id={`bookmark-icon-${articleId}`}>
    <!-- Bookmark icon (outline/filled) -->
  </svg>
  <span id={`bookmark-text-${articleId}`}>ブックマーク</span>
</button>

<script>
  import { addBookmark, removeBookmark, isBookmarked } from '@/lib/auth/bookmarks';
  import { getCurrentUser } from '@/lib/auth/utils';

  const buttons = document.querySelectorAll('[id^="bookmark-btn-"]');

  buttons.forEach(async (button) => {
    const articleId = button.getAttribute('data-article-id')!;
    const icon = document.getElementById(`bookmark-icon-${articleId}`);
    const text = document.getElementById(`bookmark-text-${articleId}`);

    // 初期状態チェック
    const bookmarked = await isBookmarked(articleId);
    updateUI(bookmarked);

    button.addEventListener('click', async () => {
      const user = await getCurrentUser();

      if (!user) {
        // 未ログイン時はログインモーダル表示
        (window as any).auth_modal.showModal();
        return;
      }

      try {
        const currentlyBookmarked = await isBookmarked(articleId);

        if (currentlyBookmarked) {
          await removeBookmark(articleId);
          updateUI(false);
        } else {
          await addBookmark(articleId);
          updateUI(true);
        }
      } catch (error) {
        console.error('Bookmark action failed:', error);
      }
    });

    function updateUI(bookmarked: boolean) {
      if (bookmarked) {
        icon?.classList.add('fill-current');
        text!.textContent = 'ブックマーク済み';
      } else {
        icon?.classList.remove('fill-current');
        text!.textContent = 'ブックマーク';
      }
    }
  });
</script>
```

#### 成果物

- [ ] `src/components/auth/BookmarkButton.astro` 作成
- [ ] ブックマーク追加/削除機能実装
- [ ] 未ログイン時のログインモーダル表示
- [ ] UI状態更新（アイコン・テキスト）

---

### Task 4.3: 記事詳細ページにブックマークボタン追加

**優先度**: 🔴 必須  
**所要時間**: 15分  
**依存**: Task 4.2

#### 作業内容

**ファイル**: `src/pages/articles/[id].astro`

記事詳細ページの適切な位置にブックマークボタンを配置。

```astro
---
import BookmarkButton from "@/components/auth/BookmarkButton.astro";
// ... 既存のインポート

const { id } = Astro.params;
// ... 既存のロジック
---

<BaseLayout>
  <!-- 記事ヘッダー -->
  <article>
    <!-- タイトル、著者情報など -->

    <div class="flex gap-2 my-4">
      <ShareButton />
      <BookmarkButton articleId={id!} /> <!-- 🆕 追加 -->
    </div>

    <!-- 記事本文 -->
  </article>
</BaseLayout>
```

#### 成果物

- [ ] 記事詳細ページ更新
- [ ] ブックマークボタン配置
- [ ] レイアウト・デザイン調整

---

## Phase 5: 機能実装（著者フォロー）

### Task 5.1: 著者フォローAPI関数実装

**優先度**: 🔴 必須  
**所要時間**: 30分  
**依存**: Task 2.1, Task 2.2

#### 作業内容

**ファイル**: `src/lib/auth/follows.ts`

```typescript
import { supabase } from "./supabase";

export const followAuthor = async (authorId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("author_follows")
    .insert({ user_id: user.id, author_id: authorId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const unfollowAuthor = async (authorId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("author_follows")
    .delete()
    .eq("user_id", user.id)
    .eq("author_id", authorId);

  if (error) throw error;
};

export const getFollowedAuthors = async () => {
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
  return data;
};

export const isFollowingAuthor = async (authorId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("author_follows")
    .select("id")
    .eq("user_id", user.id)
    .eq("author_id", authorId)
    .single();

  return !!data;
};
```

#### 成果物

- [ ] `src/lib/auth/follows.ts` 作成
- [ ] `followAuthor` 実装
- [ ] `unfollowAuthor` 実装
- [ ] `getFollowedAuthors` 実装
- [ ] `isFollowingAuthor` 実装

---

### Task 5.2: フォローボタンコンポーネント実装

**優先度**: 🔴 必須  
**所要時間**: 40分  
**依存**: Task 5.1

#### 作業内容

**ファイル**: `src/components/auth/FollowButton.astro`

```astro
---
interface Props {
  authorId: string;
}

const { authorId } = Astro.props;
---

<button
  id={`follow-btn-${authorId}`}
  class="btn btn-primary btn-sm"
  data-author-id={authorId}
>
  <span id={`follow-text-${authorId}`}>フォロー</span>
</button>

<script>
  import { followAuthor, unfollowAuthor, isFollowingAuthor } from '@/lib/auth/follows';
  import { getCurrentUser } from '@/lib/auth/utils';

  const buttons = document.querySelectorAll('[id^="follow-btn-"]');

  buttons.forEach(async (button) => {
    const authorId = button.getAttribute('data-author-id')!;
    const text = document.getElementById(`follow-text-${authorId}`);

    // 初期状態チェック
    const following = await isFollowingAuthor(authorId);
    updateUI(following);

    button.addEventListener('click', async () => {
      const user = await getCurrentUser();

      if (!user) {
        (window as any).auth_modal.showModal();
        return;
      }

      try {
        const currentlyFollowing = await isFollowingAuthor(authorId);

        if (currentlyFollowing) {
          await unfollowAuthor(authorId);
          updateUI(false);
        } else {
          await followAuthor(authorId);
          updateUI(true);
        }
      } catch (error) {
        console.error('Follow action failed:', error);
      }
    });

    function updateUI(following: boolean) {
      if (following) {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline');
        text!.textContent = 'フォロー中';
      } else {
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
        text!.textContent = 'フォロー';
      }
    }
  });
</script>
```

#### 成果物

- [ ] `src/components/auth/FollowButton.astro` 作成
- [ ] フォロー/解除機能実装
- [ ] 未ログイン時のログインモーダル表示
- [ ] UI状態更新（ボタンスタイル・テキスト）

---

### Task 5.3: 著者ページにフォローボタン追加

**優先度**: 🔴 必須  
**所要時間**: 15分  
**依存**: Task 5.2

#### 作業内容

**ファイル**: `src/pages/authors/[id]/index.astro`

```astro
---
import FollowButton from "@/components/auth/FollowButton.astro";
// ... 既存のインポート

const { id } = Astro.params;
// ... 著者情報取得ロジック
---

<BaseLayout>
  <div class="author-header">
    <img src={author.avatar} alt={author.name} />
    <h1>{author.name}</h1>
    <FollowButton authorId={id!} /> <!-- 🆕 追加 -->
  </div>

  <!-- 著者の記事一覧など -->
</BaseLayout>
```

#### 成果物

- [ ] 著者ページ更新
- [ ] フォローボタン配置
- [ ] レイアウト調整

---

## Phase 6: 機能実装（閲覧履歴）

### Task 6.1: 閲覧履歴API関数実装

**優先度**: 🔴 必須  
**所要時間**: 20分  
**依存**: Task 2.1, Task 2.2

#### 作業内容

**ファイル**: `src/lib/auth/history.ts`

```typescript
import { supabase } from "./supabase";

export const trackArticleView = async (articleId: string) => {
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
    },
  );

  if (error) console.error("Failed to track article view:", error);
};

export const getReadingHistory = async (limit = 20) => {
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

  if (error) throw error;
  return data;
};
```

#### 成果物

- [ ] `src/lib/auth/history.ts` 作成
- [ ] `trackArticleView` 実装
- [ ] `getReadingHistory` 実装

---

### Task 6.2: 記事ページに閲覧履歴トラッキング追加

**優先度**: 🔴 必須  
**所要時間**: 15分  
**依存**: Task 6.1

#### 作業内容

**ファイル**: `src/pages/articles/[id].astro`

```astro
---
// ... 既存のコード
---

<BaseLayout>
  <!-- 記事コンテンツ -->
</BaseLayout>

<script>
  import { trackArticleView } from '@/lib/auth/history';

  const articleId = window.location.pathname.split('/').pop()!;

  // ページ表示時に閲覧履歴を記録
  trackArticleView(articleId);
</script>
```

#### 成果物

- [ ] 記事ページに閲覧履歴トラッキング追加
- [ ] ページ表示時に自動記録

---

## Phase 7: マイページ実装

### Task 7.1: マイページレイアウト作成

**優先度**: 🔴 必須  
**所要時間**: 45分  
**依存**: Task 4.1, Task 5.1, Task 6.1

#### 作業内容

**ファイル**: `src/pages/my/index.astro`

```astro
---
import BaseLayout from "@/layouts/base.astro";
import { getBookmarks } from "@/lib/auth/bookmarks";
import { getFollowedAuthors } from "@/lib/auth/follows";
import { getReadingHistory } from "@/lib/auth/history";
import { getCurrentUser } from "@/lib/auth/utils";

const user = await getCurrentUser();

if (!user) {
  return Astro.redirect('/');
}

const bookmarks = await getBookmarks();
const follows = await getFollowedAuthors();
const history = await getReadingHistory();
---

<BaseLayout>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">マイページ</h1>

    <div class="tabs tabs-boxed mb-6">
      <a class="tab tab-active" data-tab="bookmarks">ブックマーク</a>
      <a class="tab" data-tab="follows">フォロー中の著者</a>
      <a class="tab" data-tab="history">閲覧履歴</a>
    </div>

    <!-- ブックマーク一覧 -->
    <div id="bookmarks-content" class="tab-content">
      {bookmarks.length === 0 ? (
        <p class="text-center text-base-content/70">ブックマークした記事はありません</p>
      ) : (
        <div class="grid gap-4">
          {bookmarks.map((bookmark) => (
            <div class="card bg-base-100 shadow">
              <!-- 記事カード -->
            </div>
          ))}
        </div>
      )}
    </div>

    <!-- フォロー中の著者一覧 -->
    <div id="follows-content" class="tab-content hidden">
      {follows.length === 0 ? (
        <p class="text-center text-base-content/70">フォロー中の著者はいません</p>
      ) : (
        <div class="grid gap-4">
          {follows.map((follow) => (
            <div class="card bg-base-100 shadow">
              <!-- 著者カード -->
            </div>
          ))}
        </div>
      )}
    </div>

    <!-- 閲覧履歴 -->
    <div id="history-content" class="tab-content hidden">
      {history.length === 0 ? (
        <p class="text-center text-base-content/70">閲覧履歴はありません</p>
      ) : (
        <div class="grid gap-4">
          {history.map((item) => (
            <div class="card bg-base-100 shadow">
              <!-- 記事カード -->
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</BaseLayout>

<script>
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab')!;

      tabs.forEach((t) => t.classList.remove('tab-active'));
      tab.classList.add('tab-active');

      contents.forEach((c) => c.classList.add('hidden'));
      document.getElementById(`${target}-content`)?.classList.remove('hidden');
    });
  });
</script>
```

#### 成果物

- [ ] `src/pages/my/index.astro` 作成
- [ ] タブUI実装（ブックマーク、フォロー、履歴）
- [ ] 各セクションのデータ表示
- [ ] 未ログイン時のリダイレクト

---

### Task 7.2: マイページに記事・著者カード統合

**優先度**: 🟢 通常  
**所要時間**: 30分  
**依存**: Task 7.1

#### 作業内容

既存の記事カード・著者カードコンポーネントをマイページで再利用。

```astro
---
import NewsCard from "@/components/cards/newsCard.astro";
import AuthorCard from "@/components/cards/authorCard.astro";
import { getArticles } from "@/lib/handlers/articles";
import { getAuthors } from "@/lib/handlers/authors";

// ブックマークされた記事IDから記事情報を取得
const articles = await getArticles();
const bookmarkedArticles = articles.filter((a) =>
  bookmarks.some((b) => b.article_id === a.id)
);

// フォロー中の著者IDから著者情報を取得
const authors = await getAuthors();
const followedAuthors = authors.filter((a) =>
  follows.some((f) => f.author_id === a.id)
);
---

<!-- ブックマーク一覧 -->
<div id="bookmarks-content">
  {bookmarkedArticles.map((article) => (
    <NewsCard article={article} />
  ))}
</div>

<!-- フォロー中の著者 -->
<div id="follows-content">
  {followedAuthors.map((author) => (
    <AuthorCard author={author} />
  ))}
</div>
```

#### 成果物

- [ ] マイページに既存カードコンポーネント統合
- [ ] 記事・著者データの取得ロジック実装
- [ ] 空状態の表示実装

---

## Phase 8: パーソナライズ機能

### Task 8.1: パーソナライズ推薦ロジック実装

**優先度**: 🟡 推奨  
**所要時間**: 60分  
**依存**: Task 6.1

#### 作業内容

**ファイル**: `src/lib/auth/recommendations.ts`

```typescript
import { supabase } from "./supabase";
import { getReadingHistory } from "./history";
import { getFollowedAuthors } from "./follows";
import { getArticles } from "@/lib/handlers/articles";

export const getPersonalizedRecommendations = async (limit = 10) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 未ログイン時は人気記事を返す
    const articles = await getArticles();
    return articles.slice(0, limit);
  }

  // 閲覧履歴からカテゴリー傾向を分析
  const history = await getReadingHistory(50);
  const historyArticleIds = history.map((h) => h.article_id);

  const allArticles = await getArticles();
  const historyArticles = allArticles.filter((a) =>
    historyArticleIds.includes(a.id),
  );

  // カテゴリーの出現頻度を計算
  const categoryCount: Record<string, number> = {};
  historyArticles.forEach((article) => {
    const category = article.data.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  // 最も多いカテゴリーTop 3
  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat);

  // フォロー中の著者の記事
  const follows = await getFollowedAuthors();
  const followedAuthorIds = follows.map((f) => f.author_id);

  // 推薦記事を抽出
  const recommendations = allArticles.filter((article) => {
    // 既に読んだ記事は除外
    if (historyArticleIds.includes(article.id)) return false;

    // フォロー中の著者の記事
    if (followedAuthorIds.includes(article.data.author)) return true;

    // 好みのカテゴリーの記事
    if (topCategories.includes(article.data.category)) return true;

    return false;
  });

  return recommendations.slice(0, limit);
};
```

#### 成果物

- [ ] `src/lib/auth/recommendations.ts` 作成
- [ ] カテゴリー傾向分析ロジック実装
- [ ] フォロー中著者の記事優先表示
- [ ] 未ログイン時の人気記事表示

---

### Task 8.2: トップページにおすすめセクション追加

**優先度**: 🟡 推奨  
**所要時間**: 30分  
**依存**: Task 8.1

#### 作業内容

**ファイル**: `src/pages/index.astro`

```astro
---
import { getPersonalizedRecommendations } from "@/lib/auth/recommendations";
import { getCurrentUser } from "@/lib/auth/utils";
import NewsCard from "@/components/cards/newsCard.astro";

const user = await getCurrentUser();
const recommendations = user ? await getPersonalizedRecommendations(6) : [];
---

<BaseLayout>
  <!-- 既存のヘッドラインセクション -->

  {user && recommendations.length > 0 && (
    <section class="my-8">
      <h2 class="text-2xl font-bold mb-4">あなたへのおすすめ</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((article) => (
          <NewsCard article={article} />
        ))}
      </div>
    </section>
  )}

  <!-- 既存の最新記事セクション -->
</BaseLayout>
```

#### 成果物

- [ ] トップページにおすすめセクション追加
- [ ] ログインユーザーのみ表示
- [ ] レイアウト調整

---

## Phase 9: 認証コールバック・エラーハンドリング

### Task 9.1: 認証コールバックページ作成

**優先度**: 🔴 必須  
**所要時間**: 30分  
**依存**: Task 2.1

#### 作業内容

**ファイル**: `src/pages/auth/callback.astro`

```astro
---
// OAuthコールバック後の処理
---

<script>
  import { supabase } from '@/lib/auth/supabase';

  const handleAuthCallback = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth callback error:', error);
      window.location.href = '/?error=auth_failed';
      return;
    }

    if (data.session) {
      // 認証成功、トップページにリダイレクト
      window.location.href = '/';
    } else {
      window.location.href = '/?error=no_session';
    }
  };

  handleAuthCallback();
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <div class="loading loading-spinner loading-lg"></div>
    <p class="mt-4">ログイン処理中...</p>
  </div>
</div>
```

#### 成果物

- [ ] `src/pages/auth/callback.astro` 作成
- [ ] セッション確認処理実装
- [ ] エラー時のリダイレクト実装
- [ ] ローディング表示

---

### Task 9.2: エラーハンドリング実装

**優先度**: 🟡 推奨  
**所要時間**: 30分  
**依存**: なし

#### 作業内容

**ファイル**: `src/lib/auth/error-handler.ts`

```typescript
export interface AuthError {
  code: string;
  message: string;
}

export const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    auth_failed: "ログインに失敗しました",
    no_session: "セッションの取得に失敗しました",
    invalid_credentials: "認証情報が無効です",
    user_not_found: "ユーザーが見つかりません",
    network_error: "ネットワークエラーが発生しました",
  };

  return messages[code] || "予期しないエラーが発生しました";
};

export const handleAuthError = (error: AuthError) => {
  console.error("Auth error:", error);

  const userMessage = getErrorMessage(error.code);

  // Toast通知等で表示
  showErrorToast(userMessage);
};

const showErrorToast = (message: string) => {
  // DaisyUI toast実装
  const toast = document.createElement("div");
  toast.className = "toast toast-top toast-end";
  toast.innerHTML = `
    <div class="alert alert-error">
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
```

#### 成果物

- [ ] `src/lib/auth/error-handler.ts` 作成
- [ ] エラーメッセージマッピング
- [ ] Toast通知実装

---

## Phase 10: テスト・最適化

### Task 10.1: TypeScript型チェック

**優先度**: 🔴 必須  
**所要時間**: 15分  
**依存**: 全実装タスク

#### 作業内容

```bash
npx astro check
```

#### 成果物

- [ ] 型エラー0件
- [ ] エラー修正完了

---

### Task 10.2: 手動テスト実施

**優先度**: 🔴 必須  
**所要時間**: 90分  
**依存**: 全実装タスク

#### テストケース

**認証フロー**

- [ ] Google OAuthログイン成功
- [ ] GitHub OAuthログイン成功
- [ ] ログアウト成功
- [ ] ページリロード後もログイン状態維持

**ブックマーク機能**

- [ ] 未ログイン時にブックマークボタンクリック→ログインモーダル表示
- [ ] ログイン後ブックマーク追加成功
- [ ] ブックマーク削除成功
- [ ] マイページでブックマーク一覧表示

**著者フォロー機能**

- [ ] 未ログイン時にフォローボタンクリック→ログインモーダル表示
- [ ] フォロー追加成功
- [ ] フォロー解除成功
- [ ] マイページでフォロー中著者一覧表示

**閲覧履歴**

- [ ] 記事閲覧時に履歴記録
- [ ] マイページで閲覧履歴表示

**パーソナライズ推薦**

- [ ] ログイン後トップページにおすすめ表示
- [ ] フォロー中著者の記事が推薦される
- [ ] 閲覧カテゴリーに基づいた推薦

**UI/UX**

- [ ] ダークモード対応確認
- [ ] モバイル表示確認
- [ ] タブレット表示確認

---

### Task 10.3: パフォーマンステスト

**優先度**: 🟡 推奨  
**所要時間**: 30分  
**依存**: Task 10.2

#### 作業内容

```bash
npm run build
npm run preview
```

Chrome DevToolsで以下を確認：

- [ ] Lighthouse Performance 95+
- [ ] 認証UIのロード時間
- [ ] 初回ページロード時間
- [ ] TTI (Time to Interactive)

#### 成果物

- [ ] Lighthouse スコア95+維持
- [ ] パフォーマンス問題の特定・修正

---

## Phase 11: ドキュメント・デプロイ

### Task 11.1: README更新

**優先度**: 🟢 通常  
**所要時間**: 20分  
**依存**: なし

#### 作業内容

`README.md` に認証機能のセットアップ手順を追加。

```markdown
## 認証機能のセットアップ

### 1. Supabaseプロジェクト作成

...

### 2. 環境変数設定

...

### 3. OAuth プロバイダー設定

...
```

#### 成果物

- [ ] README更新
- [ ] セットアップ手順記載
- [ ] トラブルシューティング追加

---

### Task 11.2: Vercelデプロイ

**優先度**: 🔴 必須  
**所要時間**: 20分  
**依存**: Task 10.1, Task 10.2

#### 作業内容

1. Vercel環境変数設定
2. デプロイ実行
3. 本番環境での動作確認

```bash
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

#### 成果物

- [ ] Vercel環境変数設定完了
- [ ] 本番デプロイ成功
- [ ] 本番環境で全機能動作確認

---

## タスク実行順序（推奨）

```
Phase 0 (環境準備)
  ├─ Task 0.1: Supabaseセットアップ
  ├─ Task 0.2: 環境変数設定
  └─ Task 0.3: 依存パッケージ

Phase 1 (バックエンド)
  ├─ Task 1.1: DBスキーマ
  ├─ Task 1.2: RLS設定
  └─ Task 1.3: トリガー

Phase 2 (認証ロジック)
  ├─ Task 2.1: Supabaseクライアント
  ├─ Task 2.2: 型定義
  ├─ Task 2.3: 認証ユーティリティ
  └─ Task 2.4: フィーチャーフラグ

Phase 3 (認証UI)
  ├─ Task 3.1: アイコン
  ├─ Task 3.2: 認証モーダル
  ├─ Task 3.3: 認証ボタン
  └─ Task 3.4: ヘッダー統合

Phase 4 (ブックマーク)
  ├─ Task 4.1: API関数
  ├─ Task 4.2: UIコンポーネント
  └─ Task 4.3: 記事ページ統合

Phase 5 (著者フォロー)
  ├─ Task 5.1: API関数
  ├─ Task 5.2: UIコンポーネント
  └─ Task 5.3: 著者ページ統合

Phase 6 (閲覧履歴)
  ├─ Task 6.1: API関数
  └─ Task 6.2: トラッキング実装

Phase 7 (マイページ)
  ├─ Task 7.1: レイアウト
  └─ Task 7.2: カード統合

Phase 8 (パーソナライズ)
  ├─ Task 8.1: 推薦ロジック
  └─ Task 8.2: トップページ統合

Phase 9 (エラー処理)
  ├─ Task 9.1: コールバックページ
  └─ Task 9.2: エラーハンドリング

Phase 10 (テスト)
  ├─ Task 10.1: 型チェック
  ├─ Task 10.2: 手動テスト
  └─ Task 10.3: パフォーマンステスト

Phase 11 (デプロイ)
  ├─ Task 11.1: README更新
  └─ Task 11.2: Vercelデプロイ
```

---

## 見積もり総時間

- **Phase 0**: 45分
- **Phase 1**: 65分
- **Phase 2**: 100分
- **Phase 3**: 110分
- **Phase 4**: 90分
- **Phase 5**: 85分
- **Phase 6**: 35分
- **Phase 7**: 75分
- **Phase 8**: 90分
- **Phase 9**: 60分
- **Phase 10**: 135分
- **Phase 11**: 40分

**合計**: 約930分（15.5時間）

実際の開発では、デバッグやUI調整に追加時間が必要となるため、**20〜25時間**を見込むことを推奨します。

---

この設計書は要件定義・設計書に基づいて作成されました。実装前に内容を確認し、承認をお願いします。
