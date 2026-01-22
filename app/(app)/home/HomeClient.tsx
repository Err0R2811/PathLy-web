"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Home.module.css";
import SkillPlannerForm from "@/components/planner/SkillPlannerForm";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface Module {
    id: string;
    title: string;
    week: number;
    tasks: Task[];
}

interface SkillPlan {
    id: string;
    skillName: string;
    duration: number;
    difficulty: string;
    modules: Module[];
}

interface HomeClientProps {
    skillPlans: SkillPlan[];
    userName: string;
}

export default function HomeClient({ skillPlans, userName }: HomeClientProps) {
    const [showPlanner, setShowPlanner] = useState(false);

    const activePlan = skillPlans[0];

    const calculateProgress = (plan: SkillPlan) => {
        const allTasks = plan.modules.flatMap((m) => m.tasks);
        const completedTasks = allTasks.filter((t) => t.completed).length;
        return allTasks.length > 0
            ? Math.round((completedTasks / allTasks.length) * 100)
            : 0;
    };

    const getTodayTask = (plan: SkillPlan) => {
        for (const module of plan.modules) {
            const incompleteTasks = module.tasks.filter((t) => !t.completed);
            if (incompleteTasks.length > 0) {
                return { task: incompleteTasks[0], module: module.title };
            }
        }
        return null;
    };

    if (showPlanner) {
        return (
            <SkillPlannerForm
                onSuccess={() => {
                    setShowPlanner(false);
                    window.location.reload();
                }}
            />
        );
    }

    if (!activePlan) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyCard}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <h2 className={styles.emptyTitle}>Start Your Learning Journey</h2>
                    <p className={styles.emptyText}>
                        Create your first skill plan and begin mastering new skills with a
                        structured roadmap.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowPlanner(true)}
                    >
                        Create Skill Plan
                    </button>
                </div>
            </div>
        );
    }

    const progress = calculateProgress(activePlan);
    const todayTask = getTodayTask(activePlan);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.greeting}>Welcome back, {userName}! 👋</h1>
                <p className={styles.subtitle}>Let's continue your learning journey</p>
            </div>

            <div className={styles.currentSkill}>
                <div className={styles.skillHeader}>
                    <div>
                        <h2 className={styles.skillName}>{activePlan.skillName}</h2>
                        <p className={styles.skillMeta}>
                            {activePlan.difficulty} • {activePlan.duration} days
                        </p>
                    </div>
                    <div className={styles.progressCircle}>
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke="var(--border-light)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 36}`}
                                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                                transform="rotate(-90 40 40)"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--color-primary)" />
                                    <stop offset="100%" stopColor="var(--color-secondary)" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className={styles.progressText}>{progress}%</div>
                    </div>
                </div>

                {todayTask && (
                    <div className={styles.todayTask}>
                        <h3 className={styles.todayLabel}>🎯 Today's Task</h3>
                        <div className={styles.taskCard}>
                            <div>
                                <p className={styles.taskTitle}>{todayTask.task.title}</p>
                                <p className={styles.taskModule}>{todayTask.module}</p>
                            </div>
                            <Link
                                href={`/modules/${activePlan.modules.find((m) => m.tasks.some((t) => t.id === todayTask.task.id))?.id}`}
                                className="btn btn-primary"
                            >
                                Start
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.modules}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Learning Roadmap</h3>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowPlanner(true)}
                    >
                        New Plan
                    </button>
                </div>

                <div className={styles.moduleList}>
                    {activePlan.modules.map((module) => {
                        const completedTasks = module.tasks.filter((t) => t.completed)
                            .length;
                        const totalTasks = module.tasks.length;
                        const moduleProgress =
                            totalTasks > 0
                                ? Math.round((completedTasks / totalTasks) * 100)
                                : 0;

                        return (
                            <Link
                                key={module.id}
                                href={`/modules/${module.id}`}
                                className={styles.moduleCard}
                            >
                                <div className={styles.moduleInfo}>
                                    <span className={styles.weekBadge}>Week {module.week}</span>
                                    <h4 className={styles.moduleTitle}>{module.title}</h4>
                                    <p className={styles.moduleProgress}>
                                        {completedTasks} of {totalTasks} tasks completed
                                    </p>
                                </div>
                                <div className={styles.moduleProgressBar}>
                                    <div
                                        className={styles.moduleProgressFill}
                                        style={{ width: `${moduleProgress}%` }}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
