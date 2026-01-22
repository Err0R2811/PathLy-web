import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';

// Client-side auth functions (for use in Client Components)
export const authClient = {
    async signUp(email: string, password: string, name: string) {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            return { user: null, error };
        }

        // Create profile entry
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    name,
                    interests: [],
                    difficulty_preference: 'Beginner',
                    daily_time_minutes: 30,
                    theme: 'light',
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
            }
        }

        return { user: data.user, error: null };
    },

    async login(email: string, password: string) {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { user: data.user, error };
    },

    async logout() {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    async getSession() {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },

    async getUser() {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        return { user: data.user, error };
    },
};

// Server-side auth functions (for use in Server Components)
export const authServer = {
    async getUser() {
        const supabase = createServerClient();
        const { data, error } = await supabase.auth.getUser();
        return { user: data.user, error };
    },

    async getSession() {
        const supabase = createServerClient();
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },
};
