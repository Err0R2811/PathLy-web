"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SkillPlannerForm.module.css";

interface SkillPlannerFormProps {
    onSuccess?: () => void;
}

export default function SkillPlannerForm({ onSuccess }: SkillPlannerFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        skillName: "",
        duration: 30,
        difficulty: "" as "Beginner" | "Intermediate" | "Expert" | "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        if (!formData.skillName || !formData.difficulty) {
            setError("Please complete all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/skill-plans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to create plan");
                setLoading(false);
                return;
            }

            // Success - redirect to home
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/home");
                router.refresh();
            }
        } catch (err) {
            setError("Failed to create learning plan");
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create Your Learning Plan</h2>
                <div className={styles.steps}>
                    <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ""}`}>1</div>
                    <div className={styles.stepLine}></div>
                    <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ""}`}>2</div>
                    <div className={styles.stepLine}></div>
                    <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ""}`}>3</div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {step === 1 && (
                    <div className={styles.stepContent}>
                        <label className={styles.label}>What skill do you want to learn?</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., React, Python, Guitar, Spanish..."
                            value={formData.skillName}
                            onChange={(e) =>
                                setFormData({ ...formData, skillName: e.target.value })
                            }
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => formData.skillName && setStep(2)}
                            disabled={!formData.skillName}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <label className={styles.label}>How much time do you have?</label>
                        <div className={styles.buttonGroup}>
                            {[30, 60, 90].map((days) => (
                                <button
                                    key={days}
                                    className={`${styles.optionButton} ${formData.duration === days ? styles.selected : ""
                                        }`}
                                    onClick={() => setFormData({ ...formData, duration: days })}
                                >
                                    <span className={styles.optionValue}>{days}</span>
                                    <span className={styles.optionLabel}>days</span>
                                </button>
                            ))}
                        </div>
                        <div className={styles.navigation}>
                            <button className="btn btn-secondary" onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button className="btn btn-primary" onClick={() => setStep(3)}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.stepContent}>
                        <label className={styles.label}>Choose your difficulty level</label>
                        <div className={styles.difficultyGrid}>
                            {[
                                {
                                    level: "Beginner" as const,
                                    desc: "Starting from scratch",
                                    emoji: "🌱",
                                },
                                {
                                    level: "Intermediate" as const,
                                    desc: "Some experience",
                                    emoji: "🔥",
                                },
                                {
                                    level: "Expert" as const,
                                    desc: "Advanced mastery",
                                    emoji: "⚡",
                                },
                            ].map((option) => (
                                <button
                                    key={option.level}
                                    className={`${styles.difficultyCard} ${formData.difficulty === option.level ? styles.selected : ""
                                        }`}
                                    onClick={() =>
                                        setFormData({ ...formData, difficulty: option.level })
                                    }
                                >
                                    <span className={styles.emoji}>{option.emoji}</span>
                                    <span className={styles.difficultyLevel}>{option.level}</span>
                                    <span className={styles.difficultyDesc}>{option.desc}</span>
                                </button>
                            ))}
                        </div>
                        <div className={styles.navigation}>
                            <button className="btn btn-secondary" onClick={() => setStep(2)}>
                                Back
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!formData.difficulty || loading}
                            >
                                {loading ? "Creating..." : "Create Plan"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
