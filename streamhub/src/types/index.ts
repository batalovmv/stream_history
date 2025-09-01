export type UUID = string
export interface Profile { id: UUID; display_name?: string | null; avatar_url?: string | null; is_admin: boolean; created_at: string }
export interface Game { id: number; name: string; slug: string }
export interface Video {
    id: number; youtube_url: string; title: string; description?: string | null; game_id?: number | null; tags?: string[]; published_at?: string | null; created_at: string; author_id: UUID;
    games?: { name: string; slug: string }
}
export interface Comment { id: number; video_id: number; user_id: UUID; body: string; created_at: string; profiles?: { display_name?: string | null; avatar_url?: string | null } }
export interface Plan { id: number; title: string; body?: string | null; scheduled_at?: string | null; created_at: string; author_id: UUID }
export interface Comment {
    id: number;
    video_id: number;
    user_id: string;
    body: string;
    created_at: string;
    parent_id?: number | null;
    profiles?: { display_name?: string | null; avatar_url?: string | null };
}
export type NotificationType = 'LIKE_VIDEO' | 'COMMENT_VIDEO' | 'REPLY_COMMENT'

export interface Notification {
    id: number
    recipient_id: string
    actor_id: string
    type: NotificationType
    video_id?: number | null
    comment_id?: number | null
    created_at: string
    read_at?: string | null
    // обогащение из join (UI удобно показывает имя актёра, назв. видео)
    actor?: { display_name?: string | null; handle?: string | null; avatar_url?: string | null }
    video?: { title?: string | null }
}
