import { generateRoadmapWithAI } from './ai/openai-service';

interface Task {
    title: string;
    contentType: string;
    description: string;
    contentLink?: string;
}

interface Module {
    title: string;
    week: number;
    order: number;
    objective: string;
    tasks: Task[];
}

interface LearningPlan {
    modules: Module[];
}

export async function generateLearningPlan(
    skillName: string,
    duration: number,
    difficulty: string
): Promise<LearningPlan> {
    try {
        // Call OpenAI to generate roadmap
        const roadmap = await generateRoadmapWithAI(skillName, duration, difficulty);

        // Transform AI response to match our database schema
        const modules: Module[] = [];
        let moduleOrder = 0;

        for (const week of roadmap.weeks) {
            for (const aiModule of week.modules) {
                modules.push({
                    title: aiModule.title,
                    week: week.week,
                    order: moduleOrder++,
                    objective: aiModule.objective,
                    tasks: aiModule.tasks || [],
                });
            }
        }

        return { modules };
    } catch (error) {
        console.error('Error generating learning plan:', error);

        // Fallback to basic plan if AI fails
        return generateFallbackPlan(skillName, duration, difficulty);
    }
}

// Fallback plan generator (uses the old logic)
function generateFallbackPlan(
    skillName: string,
    duration: number,
    difficulty: string
): LearningPlan {
    const weeks = Math.ceil(duration / 7);
    const modules: Module[] = [];

    const difficultyConfig = {
        Beginner: { theory: 0.7, practice: 0.2, project: 0.1 },
        Intermediate: { theory: 0.3, practice: 0.5, project: 0.2 },
        Expert: { theory: 0.1, practice: 0.4, project: 0.5 },
    };

    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.Beginner;

    for (let week = 1; week <= weeks; week++) {
        const weekModules = Math.min(3, weeks - week + 1);

        for (let i = 0; i < weekModules; i++) {
            const moduleType = i === 0 ? 'Fundamentals' : i === 1 ? 'Practice' : 'Project';

            modules.push({
                title: `Week ${week}: ${skillName} ${moduleType}`,
                week,
                order: (week - 1) * weekModules + i,
                objective: `Master ${skillName} ${moduleType.toLowerCase()} concepts`,
                tasks: [
                    {
                        title: `Introduction to ${skillName}`,
                        contentType: 'reading',
                        description: `Learn the basics of ${skillName}`,
                    },
                    {
                        title: `Practice ${skillName}`,
                        contentType: 'exercise',
                        description: `Apply what you learned`,
                    },
                    {
                        title: `Build with ${skillName}`,
                        contentType: 'project',
                        description: `Create a mini project`,
                    },
                ],
            });
        }
    }

    return { modules };
}
