"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Settings.module.css";

export default function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const router = useRouter();

    const handleToggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const handleLogout = async () => {
        const { authClient } = await import('@/lib/auth/auth-client');
        await authClient.logout();
        router.push("/login");
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>Manage your PathLy account and preferences</p>
            </div>

            <div className={styles.sections}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Appearance</h2>
                    <div className={styles.settingItem}>
                        <div>
                            <h3 className={styles.settingLabel}>Theme</h3>
                            <p className={styles.settingDescription}>
                                Choose your preferred color theme
                            </p>
                        </div>
                        <button
                            onClick={handleToggleTheme}
                            className={`${styles.themeToggle} ${theme === "dark" ? styles.dark : ""
                                }`}
                        >
                            <div className={styles.toggleCircle}>
                                {theme === "light" ? "☀️" : "🌙"}
                            </div>
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Learning</h2>
                    <div className={styles.settingItem}>
                        <div>
                            <h3 className={styles.settingLabel}>Reset Progress</h3>
                            <p className={styles.settingDescription}>
                                Clear all current skill plans and start fresh
                            </p>
                        </div>
                        <button className="btn btn-secondary">Reset</button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account</h2>
                    <div className={styles.settingItem}>
                        <div>
                            <h3 className={styles.settingLabel}>Sign Out</h3>
                            <p className={styles.settingDescription}>
                                Log out of your PathLy account
                            </p>
                        </div>
                        <button className="btn btn-accent" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <p>PathLy v1.0.0</p>
                <p>Built with ❤️ for learners</p>
            </div>
        </div>
    );
}
