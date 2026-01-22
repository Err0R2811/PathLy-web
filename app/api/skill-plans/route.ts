import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateLearningPlan } from "@/lib/planGenerator";

export async function POST(req: Request) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { skillName, duration, difficulty } = body;

        if (!skillName || !duration || !difficulty) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate learning plan with OpenAI
        const plan = await generateLearningPlan(skillName, duration, difficulty);

        // Create skill plan
        const { data: skillPlan, error: planError } = await supabase
            .from('skill_plans')
            .insert({
                user_id: user.id,
                skill_name: skillName,
                duration,
                difficulty,
                status: 'active',
            })
            .select()
            .single();

        if (planError) {
            throw planError;
        }

        // Create modules and tasks
        for (const moduleData of plan.modules) {
            const { data: module, error: moduleError } = await supabase
                .from('modules')
                .insert({
                    skill_plan_id: skillPlan.id,
                    title: moduleData.title,
                    week: moduleData.week,
                    order: moduleData.order,
                    objective: moduleData.objective,
                })
                .select()
                .single();

            if (moduleError) {
                throw moduleError;
            }

            // Create tasks for this module
            const tasksData = moduleData.tasks.map((task, index) => ({
                module_id: module.id,
                title: task.title,
                content_type: task.contentType,
                content_link: task.contentLink || null,
                description: task.description,
                completed: false,
                order: index,
            }));

            const { error: tasksError } = await supabase
                .from('tasks')
                .insert(tasksData);

            if (tasksError) {
                throw tasksError;
            }
        }

        return NextResponse.json({ skillPlan }, { status: 201 });
    } catch (error) {
        console.error("Error creating skill plan:", error);
        return NextResponse.json(
            { error: "Failed to create skill plan" },
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
        const { data: skillPlans, error } = await supabase
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

        if (error) {
            throw error;
        }

        return NextResponse.json(skillPlans);
    } catch (error) {
        console.error("Error fetching skill plans:", error);
        return NextResponse.json(
            { error: "Failed to fetch skill plans" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Skill plan ID required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('skill_plans')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting skill plan:", error);
        return NextResponse.json(
            { error: "Failed to delete skill plan" },
            { status: 500 }
        );
    }
}
