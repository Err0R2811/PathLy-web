"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Module.module.css";

interface Task {
    id: string;
    title: string;
    contentType: string;
    description: string | null;
    completed: boolean;
    order: number;
}

interface Module {
    id: string;
    title: string;
    week: number;
    objective: string;
    tasks: Task[];
    skillPlan: {
        skillName: string;
    };
}

interface ModuleClientProps {
    module: Module;
}

export default function ModuleClient({ module: initialModule }: ModuleClientProps) {
    const [module, setModule] = useState(initialModule);
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleToggleTask = async (taskId: string) => {
        setLoading(taskId);

        const task = module.tasks.find((t) => t.id === taskId);
        if (!task) return;

        try {
            const res = await fetch("/api/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId,
                    completed: !task.completed,
                }),
            });

            if (res.ok) {
                setModule({
                    ...module,
                    tasks: module.tasks.map((t) =>
                        t.id === taskId ? { ...t, completed: !t.completed } : t
                    ),
                });
            }
        } catch (error) {
            console.error("Error updating task:", error);
        } finally {
            setLoading(null);
        }
    };

    const completedCount = module.tasks.filter((t) => t.completed).length;
    const progress = Math.round((completedCount / module.tasks.length) * 100);

    const getTaskIcon = (contentType: string) => {
        switch (contentType) {
            case "reading":
                return "📖";
            case "video":
                return "🎥";
            case "project":
                return "💻";
            case "exercise":
                return "✏️";
            default:
                return "📝";
        }
    };

    return (
        <div className={styles.container}>
            <Link href="/home" className={styles.backButton}>
                ← Back to Home
            </Link>

            <div className={styles.header}>
                <span className={styles.skillBadge}>{module.skillPlan.skillName}</span>
                <h1 className={styles.title}>{module.title}</h1>
                <p className={styles.objective}>{module.objective}</p>
                <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={styles.progressText}>
                        {completedCount} of {module.tasks.length} tasks completed ({progress}%)
                    </span>
                </div>
            </div>

            <div className={styles.tasks}>
                {module.tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`${styles.taskCard} ${task.completed ? styles.completed : ""}`}
                    >
                        <div className={styles.taskContent}>
                            <div className={styles.taskIcon}>{getTaskIcon(task.contentType)}</div>
                            <div className={styles.taskInfo}>
                                <h3 className={styles.taskTitle}>{task.title}</h3>
                                {task.description && (
                                    <p className={styles.taskDescription}>{task.description}</p>
                                )}
                                <span className={styles.taskType}>
                                    {task.contentType.charAt(0).toUpperCase() + task.contentType.slice(1)}
                                </span>
                            </div>
                        </div>
                        <button
                            className={`${styles.checkbox} ${task.completed ? styles.checked : ""}`}
                            onClick={() => handleToggleTask(task.id)}
                            disabled={loading === task.id}
                        >
                            {task.completed && (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M4 10l4 4 8-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {completedCount === module.tasks.length && (
                <div className={styles.completionCard}>
                    <div className={styles.completionIcon}>🎉</div>
                    <h3 className={styles.completionTitle}>Module Complete!</h3>
                    <p className={styles.completionText}>
                        Great job! You've completed all tasks for this week.
                    </p>
                    <Link href="/home" className="btn btn-primary">
                        Continue Learning
                    </Link>
                </div>
            )}
        </div>
    );
}
