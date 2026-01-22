import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    // Check if Supabase credentials are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey ||
        supabaseUrl === 'your-supabase-url' ||
        supabaseAnonKey === 'your-supabase-anon-key') {
        throw new Error(
            '⚠️ Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file. ' +
            'Visit https://supabase.com to create a project and get your credentials.'
        );
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    );
}
