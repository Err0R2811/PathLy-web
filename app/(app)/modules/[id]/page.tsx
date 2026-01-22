import { redirect } from "next/navigation";
import { authServer } from "@/lib/auth/auth-server";
import ModuleClient from "./ModuleClient";
import { createServerClient } from "@/lib/supabase/server";

export default async function ModulePage({ params }: { params: { id: string } }) {
    const { user } = await authServer.getUser();

    if (!user) {
        redirect("/login");
    }

    const supabase = await createServerClient();

    // Fetch module with tasks
    const { data: module, error } = await supabase
        .from('modules')
        .select(`
      *,
      tasks (*),
      skill_plans!inner (user_id)
    `)
        .eq('id', params.id)
        .eq('skill_plans.user_id', user.id)
        .single();

    if (error || !module) {
        redirect("/home");
    }

    return <ModuleClient module={module} />;
}
