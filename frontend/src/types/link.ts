export interface Link {
    id: number;
    original_url: string;
    short_code: string;
    custom_slug: string | null;
    short_url: string;
    expires_at: string | null;
    is_commercial: boolean;
    created_at: string;
}