export type MoodValue =
  | "gratitud"
  | "inspiracion"
  | "en_proceso"
  | "necesito_apoyo"
  | null;

export interface ProfileSummary {
  full_name: string | null;
  avatar_url: string | null;
}

export interface FeedPost {
  id: string;
  content: string;
  created_at: string;
  mood: MoodValue;
  user_id?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  liked_by_user?: boolean | null;
  full_name?: string | null;
  avatar_url?: string | null;
  profiles?: ProfileSummary | null;
}

export interface PostComment {
  id: string;
  update_id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes_count?: number | null;
  full_name?: string | null;
}
