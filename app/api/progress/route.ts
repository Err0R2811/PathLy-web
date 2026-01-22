import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { taskId, completed } = body;

        if (!taskId || completed === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify task belongs to user before updating
        const { data: task, error: fetchError } = await supabase
            .from('tasks')
            .select(`
        *,
        modules!inner (
          skill_plans!inner (user_id)
        )
      `)
            .eq('id', taskId)
            .single();

        if (fetchError || !task || task.modules.skill_plans.user_id !== user.id) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        // Update task
        const { error: updateError } = await supabase
            .from('tasks')
            .update({ completed })
            .eq('id', taskId);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}

export async function GET() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch all tasks for user's active skill plans
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select(`
        *,
        modules!inner (
          skill_plans!inner (
            user_id,
            status
          )
        )
      `)
            .eq('modules.skill_plans.user_id', user.id)
            .eq('modules.skill_plans.status', 'active');

        if (error) {
            throw error;
        }

        // Calculate analytics
        const totalTasks = tasks?.length || 0;
        const completedTasks = tasks?.filter((t) => t.completed).length || 0;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return NextResponse.json({
            totalTasks,
            completedTasks,
            progress,
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch progress" },
            { status: 500 }
        );
    }
}
