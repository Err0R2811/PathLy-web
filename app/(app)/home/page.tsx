import { redirect } from "next/navigation";
import { authServer } from "@/lib/auth/auth-server";
import HomeClient from "./HomeClient";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
    const { user } = await authServer.getUser();

    if (!user) {
        redirect("/login");
    }

    const supabase = await createServerClient();

    // Fetch active skill plans for the user
    const { data: skillPlans } = await supabase
        .from('skill_plans')
        .select(`
      *,
      modules (
        *,
        tasks (*)
      )
    `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'there';

    return <HomeClient skillPlans={skillPlans || []} userName={userName} />;
}
