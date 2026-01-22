import { createServerClient } from '@/lib/supabase/server';

// Server-side auth functions (for use in Server Components)
export const authServer = {
    async getUser() {
        const supabase = await createServerClient();
        const { data, error } = await supabase.auth.getUser();
        return { user: data.user, error };
    },

    async getSession() {
        const supabase = await createServerClient();
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },
};
