export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    is_admin: boolean;
    google_id?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    locale: string;
    translations: Record<string, string>;
};

export interface ExperienceUpdate {
    id: number;
    experience_id: number;
    content: string;
    image_path: string | null;
    created_at: string;
}

export interface Experience {
    id: number;
    user_id: number;
    type: 'work' | 'organization' | 'committee';
    company_or_event_name: string;
    umbrella_organization: string | null;
    role: string;
    start_date: string;
    end_date: string | null;
    updates?: ExperienceUpdate[];
}

