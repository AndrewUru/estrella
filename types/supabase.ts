// types/supabase.ts

export interface UserProfile {
  id: string; // UUID
  full_name: string | null;
  email: string;
  role: "user" | "admin" | "facilitator";
  subscription_id: string | null;
  plan_type: "basic" | "pro" | "premium" | null;
  plan: string | null;
  is_active: boolean;
  avatar_url: string | null;
  created_at?: string;
}
