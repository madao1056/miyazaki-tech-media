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
      comments: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          article_id: string;
          content: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
      article_likes: {
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
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type AuthorFollow =
  Database["public"]["Tables"]["author_follows"]["Row"];
export type ReadingHistory =
  Database["public"]["Tables"]["reading_history"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type ArticleLike = Database["public"]["Tables"]["article_likes"]["Row"];

export interface AuthState {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  redirectTo?: string;
}

export interface OAuthProvider {
  name: "google" | "github";
  displayName: string;
  icon: string;
  buttonClass: string;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}
